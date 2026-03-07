#!/bin/bash

# Continuous Test Runner - Runs until 9:00 PM
# Tests: Admin, Lawyer, User, Premium sections

TARGET_TIME="21:00"
TEST_RESULTS_DIR="test-results-continuous"
mkdir -p $TEST_RESULTS_DIR

echo "🧪 Continuous Testing Started"
echo "Target: Run tests until $TARGET_TIME"
echo "Tests: Admin, Lawyer, User, Premium"
echo "================================"

# Test files to run
ADMIN_TESTS="e2e/admin-quick-check.spec.ts e2e/admin-all-routes.spec.ts"
LAWYER_TESTS="e2e/lawyer-dashboard-full.spec.ts e2e/lawyer-approval-check.spec.ts e2e/full-lawyer-flow.spec.ts"
USER_TESTS="e2e/user-dashboard-full.spec.ts"
PREMIUM_TESTS="e2e/premium-section.spec.ts e2e/premium-page.spec.ts"

run_tests() {
    local test_name=$1
    local test_files=$2
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    
    echo ""
    echo "⏰ $(date '+%H:%M:%S') - Running $test_name tests..."
    
    npx playwright test $test_files \
        --reporter=list \
        --workers=2 \
        2>&1 | tee "$TEST_RESULTS_DIR/${test_name}_${timestamp}.log"
    
    local exit_code=${PIPESTATUS[0]}
    
    if [ $exit_code -eq 0 ]; then
        echo "✅ $test_name tests PASSED"
    else
        echo "❌ $test_name tests FAILED (exit code: $exit_code)"
    fi
    
    return $exit_code
}

check_premium_section() {
    echo ""
    echo "🔍 Checking Premium Section specifically..."
    
    # Run just the first premium test to check if it's working
    npx playwright test e2e/premium-section.spec.ts:12 \
        --reporter=line \
        2>&1 | grep -E "(passed|failed|TESTING)"
}

# Main loop
iteration=1
while true; do
    current_time=$(date +"%H:%M")
    
    # Check if it's 9:00 PM or later (convert to minutes for comparison)
    current_hour=$(date +"%H")
    current_min=$(date +"%M")
    current_total=$((current_hour * 60 + current_min))
    target_total=$((21 * 60))  # 21:00 = 9:00 PM
    
    if [ $current_total -ge $target_total ]; then
        echo ""
        echo "🛑 Target time reached ($TARGET_TIME). Stopping tests."
        break
    fi
    
    echo ""
    echo "================================"
    echo "🔄 ITERATION $iteration - $(date '+%Y-%m-%d %H:%M:%S')"
    echo "================================"
    
    # Run Admin tests
    run_tests "admin" "$ADMIN_TESTS"
    
    # Run Lawyer tests
    run_tests "lawyer" "$LAWYER_TESTS"
    
    # Run User tests
    run_tests "user" "$USER_TESTS"
    
    # Run Premium tests
    run_tests "premium" "$PREMIUM_TESTS"
    
    # Quick check of premium section
    check_premium_section
    
    echo ""
    echo "✅ Iteration $iteration complete"
    
    # Wait 2 minutes before next iteration
    echo "⏳ Waiting 2 minutes before next iteration..."
    sleep 120
    
    ((iteration++))
done

echo ""
echo "================================"
echo "🧪 Continuous Testing Complete"
echo "Results saved in: $TEST_RESULTS_DIR"
echo "================================"

# Generate summary
echo ""
echo "📊 Summary:"
grep -h "passed\|failed" $TEST_RESULTS_DIR/*.log 2>/dev/null | tail -20 || echo "No results found"
