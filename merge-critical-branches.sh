#!/bin/bash
# Carefully merge critical branches one by one

set -e

echo "============================================"
echo "Careful Branch Merge - Critical First"
echo "============================================"
echo ""

git checkout main
git pull origin main

# Priority 1: Critical alignment fixes
PRIORITY_1=(
  "fix-profile-update-column-9771242944497996546"
  "fix-profile-update-id-column-2264333040329466803"
  "fix-profile-column-mismatch-14871007449391851274"
  "fix-type-definitions-5302076654073436041"
  "fix-database-schema-types-10036583379534139352"
)

# Priority 2: Auth fixes
PRIORITY_2=(
  "auth-role-fix-17075749307794106343"
  "fix-auth-role-derivation-12250821926359819473"
  "fix-auth-shared-hooks-12128341203887328535"
  "jules-fix-auth-alignment-and-types-13872444526934790791"
)

# Priority 3: Dashboard and UI
PRIORITY_3=(
  "fix-dashboards-and-consultations-7065354245030941373"
  "redesign-user-dashboard-8772787661021037610"
  "enhance-dashboards-10059851706780735098"
  "enhance-dashboards-2101075246293163101"
)

merge_branch() {
  local branch=$1
  local remote=$2
  
  echo "----------------------------------------"
  echo "Merging: $remote/$branch"
  
  # Fetch the branch
  git fetch $remote $branch 2>/dev/null || {
    echo "  ⚠️  Branch not found on $remote, skipping..."
    return 0
  }
  
  # Try merge with --no-commit to check for conflicts
  if git merge --no-commit --no-ff $remote/$branch 2>/dev/null; then
    git commit -m "Merge $branch from $remote" --no-edit
    echo "  ✅ Merged successfully"
    return 0
  else
    echo "  ⚠️  CONFLICT - aborting this merge"
    git merge --abort 2>/dev/null || true
    git reset --hard HEAD
    return 1
  fi
}

# Merge Priority 1
echo "============================================"
echo "PRIORITY 1: Critical Alignment Fixes"
echo "============================================"
for branch in "${PRIORITY_1[@]}"; do
  merge_branch "$branch" "origin" || true
done

# Merge Priority 2
echo ""
echo "============================================"
echo "PRIORITY 2: Auth Fixes"
echo "============================================"
for branch in "${PRIORITY_2[@]}"; do
  merge_branch "$branch" "origin" || true
done

# Merge Priority 3
echo ""
echo "============================================"
echo "PRIORITY 3: Dashboard Improvements"
echo "============================================"
for branch in "${PRIORITY_3[@]}"; do
  merge_branch "$branch" "origin" || true
done

echo ""
echo "============================================"
echo "Pushing to both remotes..."
echo "============================================"
git push origin main
git push mrmaligi main

echo ""
echo "✅ Done! Check for any conflict messages above."
