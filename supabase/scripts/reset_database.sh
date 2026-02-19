#!/bin/bash
# Supabase Database Reset Script
# Usage: ./reset_database.sh

SUPABASE_URL="https://usiorucxradthxhetqaq.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaW9ydWN4cmFkdGh4aGV0cWFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ4NzgwOSwiZXhwIjoyMDg2MDYzODA5fQ.Hg0_WVJYfLDJU-Qa4beXfECGSKL6A-fivN3Ubxe5cWI"

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
