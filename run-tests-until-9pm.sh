#!/bin/bash
echo "🧪 Continuous Testing - Until 9:00 PM"
echo "Started: $(date '+%H:%M:%S')"
echo ""

iteration=1
while [ $(date +%H) -lt 21 ]; do
  echo "================================"
  echo "🔄 ITERATION $iteration - $(date '+%H:%M:%S')"
  echo "================================"
  
  echo ""
  echo "🔒 Testing Premium Section..."
  npx playwright test e2e/premium-section.spec.ts:12 --reporter=line 2>&1 | grep -E "(passed|failed|TESTING)"
  
  echo ""
  echo "👤 Testing User Dashboard..."
  npx playwright test e2e/user-dashboard-full.spec.ts --reporter=line 2>&1 | tail -5
  
  echo ""
  echo "⚖️ Testing Lawyer Dashboard..."
  npx playwright test e2e/lawyer-dashboard-full.spec.ts --reporter=line 2>&1 | tail -5
  
  echo ""
  echo "🔧 Testing Admin Routes..."
  npx playwright test e2e/admin-quick-check.spec.ts --reporter=line 2>&1 | tail -5
  
  echo ""
  echo "✅ Iteration $iteration complete"
  echo "⏳ Waiting 2 minutes..."
  sleep 120
  
  iteration=$((iteration + 1))
done

echo ""
echo "🛑 9:00 PM reached - Testing complete!"
