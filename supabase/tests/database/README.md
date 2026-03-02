# Database Testing Guide

This folder contains database tests using pgTAP via the Supabase CLI.

## Test Files

| File | Description |
|------|-------------|
| `01_schema.test.sql` | Validates tables, columns, and extensions exist |
| `02_rls_policies.test.sql` | Checks RLS is enabled and policies are defined |
| `03_relationships.test.sql` | Tests foreign key relationships |
| `04_constraints.test.sql` | Validates unique, primary key, and not null constraints |
| `05_rls_behavior.test.sql` | Tests RLS policies actually work with test data |

## Running Tests (Local)

### Run all tests:
```bash
supabase test db
```

### Run a specific test file:
```bash
supabase test db --file 01_schema.test.sql
```

## Running Tests (Remote / Production)

To test your actual Supabase database:

```bash
# Set your database password
export SUPABASE_DB_PASSWORD="your-db-password"

# Run tests against remote database
./run-db-tests-remote.sh
```

Or get the password from your Supabase dashboard (Settings > Database > Connection string) and run directly with psql:

```bash
psql "postgresql://postgres:[password]@db.zogfvzzizbbmmmnlzxdg.supabase.co:5432/postgres" \
  -f supabase/tests/database/01_schema.test.sql
```

## Requirements

- Supabase CLI v1.11.4 or higher (for local tests)
- `psql` client installed (for remote tests)
  - macOS: `brew install libpq`
  - Ubuntu: `sudo apt install postgresql-client`

## Test Structure

Tests use [pgTAP](https://pgtap.org/) assertions:
- `has_table()` - Check table exists
- `has_column()` - Check column exists
- `fk_ok()` - Check foreign key relationship
- `col_is_pk()` - Check primary key
- `col_is_unique()` - Check unique constraint
- `policies_are()` - Check RLS policies
- `results_eq()` - Compare query results

## CI/CD Integration

Add to your GitHub Actions or CI pipeline:

```yaml
- name: Run database tests
  run: |
    supabase start
    supabase test db
```

## Adding New Tests

1. Create a new `.test.sql` file in this folder
2. Start with:
   ```sql
   begin;
   select plan(N); -- number of tests
   -- your tests here
   select * from finish();
   rollback;
   ```
3. Run with `supabase test db`
