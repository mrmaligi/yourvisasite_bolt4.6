#!/bin/bash
# Run database tests against REMOTE Supabase database
# Usage: ./run-db-tests-remote.sh [production|staging]

set -e

ENVIRONMENT="${1:-production}"
echo "🧪 Running Database Tests on $ENVIRONMENT"
echo "=========================================="
echo ""

# Check for required tools
if ! command -v psql &> /dev/null; then
    echo "❌ psql is required but not installed. Install with:"
    echo "   - macOS: brew install libpq"
    echo "   - Ubuntu: sudo apt install postgresql-client"
    exit 1
fi

# Get connection string from Supabase
if [ -z "$SUPABASE_DB_PASSWORD" ]; then
    echo "⚠️  SUPABASE_DB_PASSWORD not set"
    echo "   Set it with: export SUPABASE_DB_PASSWORD='your-password'"
    echo ""
    echo "   Or enter it now:"
    read -s SUPABASE_DB_PASSWORD
    export SUPABASE_DB_PASSWORD
fi

# Project reference
PROJECT_REF="zogfvzzizbbmmmnlzxdg"
DB_HOST="db.$PROJECT_REF.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

# Build connection string
DB_URL="postgresql://$DB_USER:$SUPABASE_DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

echo "📋 Checking pgTAP extension..."
psql "$DB_URL" -c "CREATE EXTENSION IF NOT EXISTS pgtap;" 2>/dev/null || {
    echo "❌ Failed to enable pgTAP. Make sure you have postgres role access."
    exit 1
}

echo "✅ pgTAP enabled"
echo ""

# Run each test file
TEST_DIR="supabase/tests/database"
PASSED=0
FAILED=0

for test_file in "$TEST_DIR"/*.test.sql; do
    filename=$(basename "$test_file")
    echo "🧪 Running: $filename"
    
    if psql "$DB_URL" -f "$test_file" --quiet --set=ON_ERROR_STOP=1 2>&1 | grep -q "Result: PASS"; then
        echo "   ✅ PASSED"
        ((PASSED++))
    else
        echo "   ❌ FAILED"
        ((FAILED++))
        # Show full output on failure
        echo "   Output:"
        psql "$DB_URL" -f "$test_file" 2>&1 | sed 's/^/   /'
    fi
done

echo ""
echo "======================================"
echo "📊 Results: $PASSED passed, $FAILED failed"
echo "======================================"

if [ $FAILED -gt 0 ]; then
    exit 1
fi
