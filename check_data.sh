#!/bin/bash
echo "🔍 DATA HEALTH CHECK"
echo "===================="

KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1ODc5MiwiZXhwIjoyMDg3MDM0NzkyfQ.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw"
BASE="https://zogfvzzizbbmmmnlzxdg.supabase.co/rest/v1"

echo ""
echo "📋 VISAS:"
VISAS=$(curl -s "${BASE}/visas?select=*" -H "apikey: ${KEY}")
if echo "$VISAS" | grep -q "id"; then
  COUNT=$(echo "$VISAS" | grep -o '"id"' | wc -l)
  ACTIVE=$(echo "$VISAS" | grep '"is_active":true' | wc -l)
  echo "  Total: $COUNT"
  echo "  Active: $ACTIVE ✅"
  echo "  Sample: $(echo "$VISAS" | grep -o '"name":"[^"]*"' | head -3 | sed 's/"name":"/  - /g' | sed 's/"//g')"
else
  echo "  Error: $VISAS"
fi

echo ""
echo "⚖️  PROFILES (Lawyers/Users):"
PROFILES=$(curl -s "${BASE}/profiles?select=id,email,role" -H "apikey: ${KEY}")
if echo "$PROFILES" | grep -q "id"; then
  TOTAL=$(echo "$PROFILES" | grep -o '"id"' | wc -l)
  LAWYERS=$(echo "$PROFILES" | grep '"role":"lawyer"' | wc -l)
  USERS=$(echo "$PROFILES" | grep '"role":"user"' | wc -l)
  ADMINS=$(echo "$PROFILES" | grep '"role":"admin"' | wc -l)
  echo "  Total: $TOTAL"
  echo "  Lawyers: $LAWYERS ✅"
  echo "  Users: $USERS"
  echo "  Admins: $ADMINS"
else
  echo "  Error: $PROFILES"
fi

echo ""
echo "📅 CONSULTATIONS:"
CONSULTATIONS=$(curl -s "${BASE}/consultations?select=count" -H "apikey: ${KEY}")
if echo "$CONSULTATIONS" | grep -q "count"; then
  echo "  Table exists ✅"
else
  echo "  May be empty or error"
fi

echo ""
echo "📚 BOOKINGS:"
BOOKINGS=$(curl -s "${BASE}/bookings?select=count" -H "apikey: ${KEY}")
if echo "$BOOKINGS" | grep -q "count"; then
  echo "  Table exists ✅"
else
  echo "  May be empty or error"
fi

echo ""
echo "💎 PREMIUM PURCHASES:"
PURCHASES=$(curl -s "${BASE}/premium_purchases?select=count" -H "apikey: ${KEY}")
if echo "$PURCHASES" | grep -q "count"; then
  echo "  Table exists ✅"
else
  echo "  May be empty or error"
fi

echo ""
echo "===================="
echo "✅ CHECK COMPLETE"
