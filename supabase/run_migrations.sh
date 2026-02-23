#!/bin/bash
# Supabase Migration Runner
# Usage: ./run_migrations.sh "YOUR_SUPABASE_PASSWORD"

set -e

SUPABASE_URL="https://usiorucxradthxhetqaq.supabase.co"
SUPABASE_USER="postgres"
SUPABASE_DB="postgres"
MIGRATION_FILE="COMPLETE_DATABASE_SCHEMA.sql"

if [ -z "$1" ]; then
    echo "Usage: ./run_migrations.sh 'YOUR_SUPABASE_PASSWORD'"
    exit 1
fi

SUPABASE_PASSWORD="$1"

echo "=========================================="
echo "VisaBuild Database Migration Runner"
echo "=========================================="
echo ""
echo "Connecting to: $SUPABASE_URL"
echo "Database: $SUPABASE_DB"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql is not installed"
    echo "Install PostgreSQL client:"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "  macOS: brew install libpq"
    echo "  Windows: Download from PostgreSQL website"
    exit 1
fi

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "✅ Found migration file"
echo "📊 File size: $(du -h $MIGRATION_FILE | cut -f1)"
echo ""

# Test connection
echo "🔌 Testing connection..."
if PGPASSWORD="$SUPABASE_PASSWORD" psql \
    -h "aws-0-ap-southeast-1.pooler.supabase.com" \
    -p 5432 \
    -U "$SUPABASE_USER" \
    -d "$SUPABASE_DB" \
    -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Connection successful"
else
    echo "❌ Connection failed!"
    echo "Please check your password and try again"
    exit 1
fi

echo ""
echo "⚠️  WARNING: This will create/modify database tables"
echo "Make sure you have a backup if needed!"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Cancelled"
    exit 0
fi

echo ""
echo "🚀 Running migrations..."
echo "This may take a few minutes..."
echo ""

# Run the migration
if PGPASSWORD="$SUPABASE_PASSWORD" psql \
    -h "aws-0-ap-southeast-1.pooler.supabase.com" \
    -p 5432 \
    -U "$SUPABASE_USER" \
    -d "$SUPABASE_DB" \
    -f "$MIGRATION_FILE" \
    --echo-errors \
    2>&1 | tee migration_log.txt; then
    
    echo ""
    echo "=========================================="
    echo "✅ MIGRATION COMPLETED SUCCESSFULLY!"
    echo "=========================================="
    echo ""
    echo "Database includes:"
    echo "  • 12 tables for core functionality"
    echo "  • 50+ indexes for performance"
    echo "  • RLS policies for security"
    echo "  • Triggers for automation"
    echo "  • Seed data for forum categories"
    echo ""
    echo "Log saved to: migration_log.txt"
    
else
    echo ""
    echo "=========================================="
    echo "❌ MIGRATION FAILED!"
    echo "=========================================="
    echo ""
    echo "Check migration_log.txt for errors"
    exit 1
fi
