import { supabase } from '../supabase';
import { ApiError } from '../errors/api.error';
import type { User } from '@supabase/supabase-js';
import type { UserRole } from '../../types/database';

export async function withAuth<T>(action: (user: User) => Promise<T>): Promise<T> {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session?.user) {
    throw ApiError.unauthorized('User not authenticated');
  }

  return action(session.user);
}

export async function withRole<T>(role: UserRole | UserRole[], action: (user: User) => Promise<T>): Promise<T> {
  return withAuth(async (user) => {
    // Check role from metadata or profile
    // Note: Checking profile requires a DB call, which might be expensive if done on every call.
    // For now, we can check user_metadata if role is stored there, or fetch profile.
    // The safest way is to fetch profile or rely on RLS.
    // However, usually services rely on RLS.
    // If we need explicit role check in application code:

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      throw ApiError.unauthorized('User profile not found');
    }

    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(profile.role)) {
      throw ApiError.forbidden('User does not have required role');
    }

    return action(user);
  });
}
