#!/bin/bash
# VisaBuild V2 Page Generator Script
# Run this script to continue creating V2 pages

cd /home/openclaw/.openclaw/workspace/visabuild-app

echo "=========================================="
echo "VisaBuild V2 Page Generator"
echo "=========================================="
echo ""

# Count current progress
V2_COUNT=$(find src/pages -name "*V2.tsx" | wc -l)
TOTAL=$(find src/pages -name "*.tsx" | wc -l)
PERCENTAGE=$(echo "scale=1; $V2_COUNT * 100 / $TOTAL" | bc)

echo "Current Progress: $V2_COUNT / $TOTAL files ($PERCENTAGE%)"
echo ""

# Show remaining pages by category
echo "Remaining pages by category:"
echo "- Public pages: $(find src/pages/public -name "*.tsx" ! -name "*V2.tsx" | wc -l)"
echo "- User pages: $(find src/pages/user -name "*.tsx" ! -name "*V2.tsx" | wc -l)"
echo "- Lawyer pages: $(find src/pages/lawyer -name "*.tsx" ! -name "*V2.tsx" | wc -l)"
echo "- Admin pages: $(find src/pages/admin -name "*.tsx" ! -name "*V2.tsx" | wc -l)"
echo ""

# List next 10 pages to convert
echo "Next 10 pages to convert:"
find src/pages -name "*.tsx" ! -name "*V2.tsx" ! -name "*.test.tsx" | head -10
echo ""

echo "To continue manually, ask the agent to:"
echo "1. Read the original .tsx file"
echo "2. Create a V2 version with square design"
echo "3. Update App.tsx to use V2"
echo "4. Build and commit changes"
echo ""
echo "=========================================="