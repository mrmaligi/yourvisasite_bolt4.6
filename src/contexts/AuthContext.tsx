import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type Session, type User, type AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile, UserRole } from '../types/database';
// import { authService } from '../lib/services/auth.service'; // Direct supabase usage to avoid loop

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: any | null; // Typed loosely to avoid circular dependency issues
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ data: { user: User | null; session: Session | null }; error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: { user: User | null; session: Session | null }; error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;

  // Aliases/Compat
  signInWithEmail: (email: string, password: string) => Promise<{ data: { user: User | null; session: Session | null }; error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ data: { user: User | null; session: Session | null }; error: AuthError | null }>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => ({ data: { user: null, session: null }, error: null }),
  signUp: async () => ({ data: { user: null, session: null }, error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
  signInWithEmail: async () => ({ data: { user: null, session: null }, error: null }),
  signUpWithEmail: async () => ({ data: { user: null, session: null }, error: null }),
  signInWithGoogle: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Use direct supabase query to avoid import cycles
      const { data, error } = await supabase
        .from('profiles')
        .select('*, lawyer_profiles(*)')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('[AuthContext] Unexpected error in fetchProfile:', err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }).catch((err) => {
      console.error('Error getting session:', err);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);

      if (s?.user) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
           // On sign in, ensure loading is true until profile is fetched
           if (event === 'SIGNED_IN') setIsLoading(true);
           fetchProfile(s.user.id).finally(() => setIsLoading(false));
        }
      } else {
        setProfile(null);
        if (event === 'SIGNED_OUT') {
          setIsLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
  };

  const signInWithGoogle = async () => {
    const redirectTo = (import.meta.env.VITE_APP_URL || window.location.origin) + '/login';
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const role = profile?.role || null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        role,
        isLoading,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        signInWithEmail: signIn,
        signUpWithEmail: signUp,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
