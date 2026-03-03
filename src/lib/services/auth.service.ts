import { supabase } from '../supabase';
import { ProfileRepository, type ProfileWithLawyer } from '../repositories/profile.repository';
import { errorHandler } from '../errors/handler';
import { ApiError } from '../errors/api.error';
import type { AuthError } from '@supabase/supabase-js';

export class AuthService {
  private repository: ProfileRepository;

  constructor() {
    this.repository = new ProfileRepository();
  }

  async signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async signUp(email: string, password: string, fullName: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error };
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  }

  async fetchProfile(userId: string): Promise<ProfileWithLawyer | null> {
    try {
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        const { data, error } = await this.repository.findById(userId);

        if (error) {
          // If error is not found, retry?
          // Usually not found means user exists but profile not yet created.
          // But maybeSingle returns null data, not error if not found.
          if (error.code !== 'PGRST116') { // Not "no rows returned" (though maybeSingle prevents this error)
             return null;
          }
        }

        if (data) {
          return data;
        }

        // Wait before retrying (wait for trigger to create profile)
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return null;
    } catch (err) {
      // Don't throw here to avoid crashing auth flow
      return null;
    }
  }
}

export const authService = new AuthService();
