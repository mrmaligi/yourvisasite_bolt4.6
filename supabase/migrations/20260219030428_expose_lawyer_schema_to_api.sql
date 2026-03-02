/*
  # Expose lawyer schema to PostgREST API

  1. Changes
    - Configures PostgREST to expose the `lawyer` schema alongside `public` and `graphql_public`
    - Grants necessary permissions to `anon` and `authenticated` roles on the `lawyer` schema
    - This allows frontend code to query lawyer.profiles and lawyer.consultation_slots via supabase.schema('lawyer')

  2. Security
    - Only USAGE and SELECT are granted to anon (read-only for public directory)
    - Authenticated users get full CRUD permissions
    - Existing RLS policies on lawyer schema tables remain enforced
*/

ALTER ROLE authenticator SET pgrst.db_schemas TO 'public, graphql_public, lawyer';

GRANT USAGE ON SCHEMA lawyer TO anon;
GRANT USAGE ON SCHEMA lawyer TO authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA lawyer TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA lawyer TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA lawyer
  GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA lawyer
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
