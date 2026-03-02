#!/bin/bash
# Quick connection test to Supabase database

PROJECT_REF="zogfvzzizbbmmmnlzxdg"
DB_HOST="db.$PROJECT_REF.supabase.co"
DB_URL="postgresql://postgres:${SUPABASE_DB_PASSWORD}@$DB_HOST:5432/postgres"

echo "🔌 Testing connection to Supabase database..."
echo ""

if [ -z "$SUPABASE_DB_PASSWORD" ]; then
    echo "❌ SUPABASE_DB_PASSWORD not set"
    echo ""
    echo "Get your password from:"
    echo "https://supabase.com/dashboard/project/$PROJECT_REF/settings/database"
    echo ""
    echo "Then run: export SUPABASE_DB_PASSWORD='your-password'"
    exit 1
fi

# Test connection
if psql "$DB_URL" -c "SELECT version();" --quiet 2>/dev/null; then
    echo "✅ Connected successfully!"
    echo ""
    
    # Check pgTAP
    if psql "$DB_URL" -c "SELECT * FROM pg_extension WHERE extname = 'pgtap';" --quiet 2>/dev/null | grep -q pgtap; then
        echo "✅ pgTAP extension is installed"
    else
        echo "⚠️  pgTAP extension not found. Installing..."
        psql "$DB_URL" -c "CREATE EXTENSION IF NOT EXISTS pgtap;" --quiet
        echo "✅ pgTAP installed"
    fi
    echo ""
    echo "You're ready to run tests: ./run-db-tests-remote.sh"
else
    echo "❌ Connection failed. Check your password."
    exit 1
fi
