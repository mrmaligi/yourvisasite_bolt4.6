# Supabase Factory Reset & Rebuild Guide

## Step 1: Connect to Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/usiorucxradthxhetqaq/sql/new

## Step 2: Run the Reset Script

Copy and paste the contents of `supabase/migrations/000_factory_reset.sql` into the SQL editor and click **Run**.

This will:
- Drop all triggers
- Drop all functions  
- Drop all policies
- Drop all tables
- Clean schemas

## Step 3: Run Migrations in Order

Run these migration files IN ORDER in the SQL editor:

1. `20260207001931_001_extensions_and_schemas.sql`
2. `20260207002010_002_core_public_tables.sql`
3. `20260207002044_003_lawyer_and_commerce_tables.sql`
4. `20260207002145_004_row_level_security.sql`
5. `20260207002233_005_tracker_algorithm.sql`
6. `20260207030840_long_field.sql`
7. `20260207031615_006_security_hardening.sql`
8. `20260207032654_007_stripe_rls_optimization.sql`
9. `20260207040701_008_comprehensive_fixes.sql`
10. `20260207091200_009_marketplace_system.sql`
11. `20260207093612_010_marketplace_security_fixes.sql`
12. `20260207094501_011_marketplace_reviews_and_lawyer_seed.sql`
13. `20260207101111_012_fix_purchase_rls_policies.sql`
14. `20260216034400_013_seed_priority_au_visas.sql`
15. `20260218040000_014_expand_au_visas_part1.sql`
16. `20260218040100_015_expand_au_visas_part2.sql`
17. `20260218060000_016_seed_canada_uk_visas.sql`
18. `20260218080000_017_saved_visas_and_platform_settings.sql`
19. `20260218100000_018_consultation_payments.sql`
20. `20260218101000_019_add_485_visa.sql`
21. `20260218120000_020_expand_nz_uk_canada_family.sql`
22. `20260218130000_021_tracker_moderation_notifications.sql`
23. `20260218131000_022_booking_reminder_column.sql`
24. `20260218140000_023_document_categories.sql`
25. `20260218140500_024_tier_1_visas.sql`
26. `20260218141000_025_remaining_visas.sql`
27. `20260218141500_026_visa_links.sql`

Then the new growth features:
28. `20260219080000_growth_features.sql`
29. `20260219081000_contact_form.sql`
30. `20260219090000_forum_system.sql`
31. `20260219091000_document_templates.sql`

## Alternative: Run via CLI

If you have supabase CLI installed:

```bash
supabase db reset
supabase db push
```

Or apply specific migrations:

```bash
# Reset (DANGER - DELETES ALL DATA)
psql $DATABASE_URL -f supabase/migrations/000_factory_reset.sql

# Apply all migrations in order
for f in supabase/migrations/*.sql; do
  psql $DATABASE_URL -f "$f"
done
```

## Credentials

Project URL: https://usiorucxradthxhetqaq.supabase.co
Project ID: usiorucxradthxhetqaq
