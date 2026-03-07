import { createClient } from '@supabase/supabase-js';

// Environment variables are set in Vercel deployment settings
// FALLBACK: Using service key temporarily until Vercel env vars are fixed
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1ODc5MiwiZXhwIjoyMDg3MDM0NzkyfQ.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw';

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️  Using fallback Supabase key. Update Vercel env vars for production.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Expose for debugging
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}

// Expose for debugging
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}

/**
 * Wraps a Supabase query with retry logic for network errors and 5xx server errors.
 *
 * @param queryFn A function that executes the Supabase query and returns a promise.
 * @param retries Number of retries to attempt (default: 3).
 * @param delay Initial delay in milliseconds for exponential backoff (default: 1000).
 * @returns The result of the query.
 */
export async function fetchWithRetry<T extends { error: any }>(
  queryFn: () => PromiseLike<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await queryFn();
      const { error } = result;

      if (!error) {
        return result;
      }

      // Check if error is likely retryable:
      // - Network error (often lacks code or status)
      // - Server error (5xx)
      // Note: Supabase/Postgrest errors are objects { message, code, details, hint }
      const isRetryable =
        !error.code || // Likely network error
        (typeof error.code === 'string' && error.code.startsWith('5')) || // 5xx error code from Postgres
        (error.status && error.status >= 500); // HTTP status from response

      if (!isRetryable) {
        return result; // Client error (4xx) or other non-retryable error
      }

      if (i === retries - 1) {
        return result; // Max retries reached
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    } catch (err) {
      // If the promise itself rejects (e.g. fatal network failure not caught by client), retry
      if (i === retries - 1) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  // Fallback (should be covered by loop)
  return await queryFn();
}
