#!/bin/bash
# Merge ALL branches to main - Auto-resolve conflicts
# This script merges all unmerged branches, preferring main's version on conflicts

set -e

echo "============================================"
echo "Merge ALL Branches to Main"
echo "============================================"
echo "Strategy: Prefer main (ours) on conflicts"
echo ""

# Ensure we're on main and up to date
git checkout main
git pull origin main
git pull mrmaligi main

# Get ALL remote branches (from both remotes)
echo "Fetching all branches from all remotes..."
git fetch origin --prune
git fetch mrmaligi --prune

# Get list of unmerged branches from both remotes
ALL_BRANCHES=$(git branch -r --no-merged main | grep -v "HEAD" | grep -v "main$" | sed 's/^  //')

echo ""
echo "Found $(echo "$ALL_BRANCHES" | wc -l) unmerged branches:"
echo "$ALL_BRANCHES"
echo ""

# Counters
MERGED=0
CONFLICTS_AUTO_RESOLVED=0
FAILED=0
FAILED_BRANCHES=""

merge_branch() {
    local remote_branch=$1
    local remote=$(echo "$remote_branch" | cut -d'/' -f1)
    local branch=$(echo "$remote_branch" | cut -d'/' -f2-)
    
    echo "----------------------------------------"
    echo "Processing: $remote/$branch"
    
    # Try to merge
    if git merge --no-edit "$remote_branch" 2>/dev/null; then
        echo "  ✅ Merged cleanly"
        ((MERGED++))
        return 0
    fi
    
    # If failed, check if it's a conflict we can auto-resolve
    if git diff --name-only --diff-filter=U | grep -q "."; then
        echo "  ⚠️  Conflicts detected - auto-resolving (preferring main/ours)"
        
        # Resolve all conflicts by taking "ours" (main branch version)
        git diff --name-only --diff-filter=U | while read file; do
            echo "    Resolving: $file"
            git checkout --ours "$file" 2>/dev/null || true
            git add "$file" 2>/dev/null || true
        done
        
        # Check if all conflicts resolved
        if git diff --name-only --diff-filter=U | grep -q "."; then
            echo "  ❌ Could not auto-resolve all conflicts"
            git merge --abort 2>/dev/null || true
            ((FAILED++))
            FAILED_BRANCHES="$FAILED_BRANCHES\n  - $remote/$branch"
            return 1
        fi
        
        # Commit the merge
        git commit -m "Merge $branch from $remote (conflicts auto-resolved)" --no-edit 2>/dev/null || {
            echo "  ❌ Commit failed"
            git merge --abort 2>/dev/null || true
            ((FAILED++))
            FAILED_BRANCHES="$FAILED_BRANCHES\n  - $remote/$branch"
            return 1
        }
        
        echo "  ✅ Merged with auto-resolved conflicts"
        ((CONFLICTS_AUTO_RESOLVED++))
        return 0
    fi
    
    # Other error
    echo "  ❌ Merge failed"
    git merge --abort 2>/dev/null || true
    ((FAILED++))
    FAILED_BRANCHES="$FAILED_BRANCHES\n  - $remote/$branch"
    return 1
}

# Process all branches
for remote_branch in $ALL_BRANCHES; do
    merge_branch "$remote_branch" || true
done

# Summary
echo ""
echo "============================================"
echo "Merge Complete!"
echo "============================================"
echo ""
echo "✅ Clean merges: $MERGED"
echo "🔧 Auto-resolved conflicts: $CONFLICTS_AUTO_RESOLVED"
echo "❌ Failed: $FAILED"
echo ""

if [ $FAILED -gt 0 ]; then
    echo "Failed branches:"
    echo -e "$FAILED_BRANCHES"
    echo ""
fi

# Push to all remotes
echo "============================================"
echo "Pushing to ALL remotes..."
echo "============================================"
echo ""

for remote in origin mrmaligi; do
    echo "Pushing to $remote..."
    if git push "$remote" main 2>/dev/null; then
        echo "  ✅ Pushed to $remote"
    else
        echo "  ❌ Failed to push to $remote"
    fi
done

echo ""
echo "============================================"
echo "Done!"
echo "============================================"
