#!/bin/bash
# Supabase Database Reset Script
# Usage: ./reset_database.sh

# Load environment variables
if [ -f "../../.env" ]; then
    # shellcheck source=../../.env
    source "../../.env"
elif [ -f ".env" ]; then
    # shellcheck source=.env
    source ".env"
fi

# Use provided variables or fall back to defaults/prompts
SUPABASE_URL="${SUPABASE_URL:-$VITE_SUPABASE_URL}"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_KEY:-$SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SUPABASE_URL" ]; then
    read -p "Enter Supabase URL: " SUPABASE_URL
fi

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    read -s -p "Enter Supabase Service Key: " SUPABASE_SERVICE_KEY
    echo ""
fi

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "Error: SUPABASE_URL and SUPABASE_SERVICE_KEY are required."
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  WARNING: This will DELETE ALL DATA in the database!${NC}"
echo "Project: $SUPABASE_URL"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 1: Running factory reset...${NC}"

# Run the reset SQL
curl -X POST "$SUPABASE_URL/rest/v1/sql" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d @"../migrations/000_factory_reset.sql"

echo ""
echo -e "${GREEN}✅ Reset complete${NC}"
echo ""
echo -e "${YELLOW}Step 2: Rebuilding database...${NC}"

# Get all migration files sorted
MIGRATIONS=($(ls -1 ../migrations/*.sql | grep -v "000_factory_reset" | sort))

total=${#MIGRATIONS[@]}
current=0

for migration in "${MIGRATIONS[@]}"; do
    current=$((current + 1))
    filename=$(basename "$migration")
    echo -e "${YELLOW}[$current/$total] Applying: $filename${NC}"
    
    curl -X POST "$SUPABASE_URL/rest/v1/sql" \
      -H "apikey: $SUPABASE_SERVICE_KEY" \
      -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
      -H "Content-Type: application/json" \
      -d @"$migration"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}  ✓ Success${NC}"
    else
        echo -e "${RED}  ✗ Failed${NC}"
        echo "Stopping due to error."
        exit 1
    fi
    echo ""
done

echo ""
echo -e "${GREEN}✅ Database reset and rebuild complete!${NC}"
echo ""
echo "Summary:"
echo "- All tables dropped and recreated"
echo "- All 78+ visas re-seeded"
echo "- All RLS policies reapplied"
echo "- Forum, referrals, quiz system added"
echo ""
echo "Next steps:"
echo "1. Test the application"
echo "2. Create a test user"
echo "3. Verify all features work"
