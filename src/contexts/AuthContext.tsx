import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type Session, type User, type AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile, UserRole } from '../types/database';
import { MOCK_USERS, MOCK_ADMINS, MOCK_LAWYER_USERS, USE_MOCK } from '../lib/mockData';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  role: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
  switchRole: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to create a fake Supabase User object from a Profile
  const createMockUser = (p: Profile): User => ({
    id: p.id,
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { full_name: p.full_name, avatar_url: p.avatar_url },
    aud: 'authenticated',
    confirmation_sent_at: new Date().toISOString(),
    recovery_sent_at: new Date().toISOString(),
    email: `${p.role}@example.com`,
    phone: p.phone || '',
    created_at: p.created_at,
    confirmed_at: p.created_at,
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    is_anonymous: false
  });

  const switchRole = (newRole: UserRole) => {
    let mockProfile: Profile;
    if (newRole === 'admin') mockProfile = MOCK_ADMINS[0];
    else if (newRole === 'lawyer') mockProfile = MOCK_LAWYER_USERS[0];
    else mockProfile = MOCK_USERS[0];

    const mockUser = createMockUser(mockProfile);
    setUser(mockUser);
    setProfile(mockProfile);
    setSession({
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh',
        user: mockUser,
      });
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data);
  };

  useEffect(() => {
    if (USE_MOCK) {
      // Initialize with default mock user (User role)
      switchRole('user');
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);

      if (s?.user) {
        if (event === 'SIGNED_IN') {
          setIsLoading(true);
          fetchProfile(s.user.id).finally(() => setIsLoading(false));
        } else {
          fetchProfile(s.user.id);
        }
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (USE_MOCK) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/login` },
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (USE_MOCK) return { error: null };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    if (USE_MOCK) return { error: null };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    if (USE_MOCK) return { error: null };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    return { error };
  };

  const signOut = async () => {
    if (USE_MOCK) {
        // In mock mode, sign out might just reset to default or do nothing
        // Let's reset to User role
        switchRole('user');
        return;
    }
    await supabase.auth.signOut();
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (USE_MOCK) return; // No real backend refresh
    if (user) await fetchProfile(user.id);
  };

  // Role is derived exclusively from profile to ensure single source of truth
  const role = profile?.role || null;

  return (
    <AuthContext.Provider
      value={{
        session, user, profile, role, isLoading,
        signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword,
        signOut, refreshProfile, switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
