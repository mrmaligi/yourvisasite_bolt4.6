#!/bin/bash
# Run database tests for yourvisasite

set -e

echo "🧪 Running Supabase Database Tests"
echo "=================================="
echo ""

# Check if supabase is running
if ! supabase status | grep -q "started"; then
    echo "⚠️  Supabase is not running. Starting it now..."
    supabase start
    echo ""
fi

echo "📋 Test Files:"
ls -1 supabase/tests/database/*.test.sql 2>/dev/null || echo "No test files found"
echo ""

echo "🚀 Running tests..."
echo ""
supabase test db

echo ""
echo "✅ Tests complete!"
