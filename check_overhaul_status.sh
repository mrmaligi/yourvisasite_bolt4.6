#!/bin/bash
# UI Overhaul Status Checker
# Run this to check progress of the overhaul

echo "🔍 UI/UX OVERHAUL STATUS CHECK"
echo "================================"
echo ""

cd /home/openclaw/.openclaw/workspace/visabuild-app

# Check git log for recent commits
echo "📊 Recent Commits:"
git log --oneline -5 2>/dev/null || echo "  No git log available"

echo ""
echo "📁 Files Modified Recently:"
find src -name "*.tsx" -mtime -0.1 2>/dev/null | head -10 || echo "  No recent changes"

echo ""
echo "🔧 Build Status:"
npm run build 2>&1 | tail -5 || echo "  Build check failed"

echo ""
echo "✅ Status Check Complete"
