
# Automation Scripts Usage

This repository contains scripts to help with database migrations and data seeding.

## Prerequisites

- Node.js / Bun
- Supabase Project Credentials

## Environment Variables

Create a `.env` file or export the following variables:

```bash
export SUPABASE_PROJECT_REF="zogfvzzizbbmmmnlzxdg"
export SUPABASE_SERVICE_KEY="your-service-key-here"
export SUPABASE_DB_PASSWORD="your-db-password-here" # Required for migrations
export USER_ID="588f4a9a-85af-4684-abe8-8c414992cf6c"
export VISA_SUBCLASS="820"
export DOCS_PATH="/path/to/documents" # Optional, defaults to p_visa/ in current dir
```

## Scripts

### 1. Apply Migrations

Applies all SQL files in `supabase/migrations/` to the database.
Requires `SUPABASE_DB_PASSWORD`.

```bash
bun run scripts/run_migrations.ts
```

### 2. Upload Documents

Uploads visa documents to Supabase Storage and creates database entries.
Requires `SUPABASE_SERVICE_KEY`.

```bash
bun run scripts/upload_docs.ts
```

### 3. Unlock Premium Content

Creates a purchase record for the specified user and visa.
Requires `SUPABASE_SERVICE_KEY`.

```bash
bun run scripts/unlock_premium.ts
```
