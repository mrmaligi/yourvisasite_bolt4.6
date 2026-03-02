#!/bin/bash
# Quick fix to enable RLS on all tables using psql

DB_URL="postgresql://postgres:Mrmaligi%402007@db.zogfvzzizbbmmmnlzxdg.supabase.co:5432/postgres"

echo "🔧 Applying RLS fix directly to database..."
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql not found. Please install PostgreSQL client:"
    echo "   macOS: brew install libpq"
    echo "   Ubuntu: sudo apt install postgresql-client"
    exit 1
fi

# Apply the migration
psql "$DB_URL" -f supabase/migrations/20260301224533_enable_rls_security.sql 2>&1

echo ""
echo "✅ RLS fix applied!"
