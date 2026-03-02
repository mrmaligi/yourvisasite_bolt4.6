#!/bin/bash
# Merge all branches into main
# Usage: ./merge-all-branches.sh

set -e

echo "============================================"
echo "Merge All Branches to Main"
echo "============================================"
echo ""

# Ensure we're on main
git checkout main
git pull origin main

# Get all remote branches (excluding HEAD and main)
BRANCHES=$(git branch -r --no-merged main | grep -v "HEAD" | grep -v "main$" | sed 's/origin\///' | sed 's/mrmaligi\///' | sort -u)

echo "Found $(echo "$BRANCHES" | wc -l) unmerged branches:"
echo "$BRANCHES"
echo ""

# Categorize branches
FIX_BRANCHES=$(echo "$BRANCHES" | grep -E "(fix|fix-|hotfix)" || true)
FEAT_BRANCHES=$(echo "$BRANCHES" | grep -E "(feat|feature)" || true)
JULES_BRANCHES=$(echo "$BRANCHES" | grep -E "jules" || true)
OTHER_BRANCHES=$(echo "$BRANCHES" | grep -vE "(fix|feat|feature|jules|hotfix)" || true)

echo "Categories:"
echo "  Fix branches: $(echo "$FIX_BRANCHES" | wc -l)"
echo "  Feature branches: $(echo "$FEAT_BRANCHES" | wc -l)"
echo "  Jules branches: $(echo "$JULES_BRANCHES" | wc -l)"
echo "  Other branches: $(echo "$OTHER_BRANCHES" | wc -l)"
echo ""

# Track conflicts
CONFLICTS=()
MERGED=()

# Function to merge a branch
merge_branch() {
    local branch=$1
    echo "----------------------------------------"
    echo "Merging: $branch"
    
    # Try to merge
    if git merge --no-edit "$branch" 2>/dev/null; then
        echo "✅ Successfully merged: $branch"
        MERGED+=("$branch")
    else
        echo "⚠️  CONFLICT in: $branch"
        git merge --abort 2>/dev/null || true
        CONFLICTS+=("$branch")
        return 1
    fi
    echo ""
}

# Merge in order: fixes first, then features, then jules, then others
echo "============================================"
echo "Phase 1: Merging Fix Branches"
echo "============================================"
for branch in $FIX_BRANCHES; do
    merge_branch "$branch" || true
done

echo "============================================"
echo "Phase 2: Merging Feature Branches"
echo "============================================"
for branch in $FEAT_BRANCHES; do
    merge_branch "$branch" || true
done

echo "============================================"
echo "Phase 3: Merging Jules Branches"
echo "============================================"
for branch in $JULES_BRANCHES; do
    merge_branch "$branch" || true
done

echo "============================================"
echo "Phase 4: Merging Other Branches"
echo "============================================"
for branch in $OTHER_BRANCHES; do
    merge_branch "$branch" || true
done

# Summary
echo ""
echo "============================================"
echo "Merge Complete!"
echo "============================================"
echo ""
echo "✅ Successfully merged: ${#MERGED[@]} branches"
for branch in "${MERGED[@]}"; do
    echo "   - $branch"
done

echo ""
echo "⚠️  Conflicts (needs manual resolution): ${#CONFLICTS[@]} branches"
for branch in "${CONFLICTS[@]}"; do
    echo "   - $branch"
done

echo ""
echo "Next steps:"
if [ ${#CONFLICTS[@]} -eq 0 ]; then
    echo "1. Review the merged changes"
    echo "2. Run tests: npm run typecheck"
    echo "3. Push to main: git push origin main"
else
    echo "1. Resolve conflicts in the listed branches"
    echo "2. Re-run this script"
    echo "3. Or merge conflict branches manually"
fi
