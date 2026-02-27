import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type Session, type User, type AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../lib/services/auth.service';
import type { Profile, UserRole } from '../types/database';
import type { ProfileWithLawyer } from '../lib/repositories/profile.repository';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: ProfileWithLawyer | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;

  // Aliases/Compat
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithGoogle: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileWithLawyer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    console.log('[AuthContext] Fetching profile for user:', currentUser.id);
    try {
      const data = await authService.fetchProfile(currentUser.id);
      console.log('[AuthContext] Profile fetch result:', data ? 'found' : 'not found');
      if (data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('[AuthContext] Unexpected error in fetchProfile:', err);
      // Even on error, we should stop loading to prevent infinite spinners
      // Ideally we might set an error state, but for now we clear profile to trigger setup/error UI
      setProfile(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }).catch((err) => {
      console.error('Error getting session:', err);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      console.log('[AuthContext] Auth state change:', event);
      setSession(s);
      setUser(s?.user ?? null);

      if (s?.user) {
        // For sign in events, we want to ensure loading state is handled
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          setIsLoading(true);
          fetchProfile(s.user).finally(() => setIsLoading(false));
        } else if (event === 'TOKEN_REFRESHED') {
           // Background refresh, don't set loading true
           if (!profile) fetchProfile(s.user);
        } else {
          // Fallback
          if (!profile) fetchProfile(s.user);
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
    return authService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    return authService.signUp(email, password, fullName);
  };

  const signOut = async () => {
    await authService.signOut();
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
    if (user) {
        setIsLoading(true);
        await fetchProfile(user).finally(() => setIsLoading(false));
    }
  };

  // Role is derived exclusively from profile to ensure single source of truth
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
