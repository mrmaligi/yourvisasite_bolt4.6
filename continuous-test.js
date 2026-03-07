const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TESTS = {
  admin: ['e2e/admin-quick-check.spec.ts', 'e2e/admin-all-routes.spec.ts'],
  lawyer: ['e2e/lawyer-dashboard-full.spec.ts', 'e2e/lawyer-approval-check.spec.ts'],
  user: ['e2e/user-dashboard-full.spec.ts'],
  premium: ['e2e/premium-section.spec.ts', 'e2e/premium-page.spec.ts']
};

const TARGET_HOUR = 21; // 9:00 PM
const TARGET_MINUTE = 0;

// Results tracking
const results = {
  iterations: 0,
  passed: 0,
  failed: 0,
  startTime: new Date()
};

function getTimeString() {
  return new Date().toLocaleTimeString('en-AU', { hour12: false });
}

function shouldStop() {
  const now = new Date();
  return now.getHours() > TARGET_HOUR || 
         (now.getHours() === TARGET_HOUR && now.getMinutes() >= TARGET_MINUTE);
}

function runTest(category, testFiles) {
  console.log(`\n⏰ ${getTimeString()} - Running ${category.toUpperCase()} tests...`);
  
  try {
    const output = execSync(
      `npx playwright test ${testFiles.join(' ')} --reporter=list 2>&1`,
      { 
        cwd: '/home/openclaw/.openclaw/workspace/visabuild-app',
        encoding: 'utf-8',
        timeout: 300000 // 5 minutes per test batch
      }
    );
    
    // Parse results
    const passedMatch = output.match(/(\d+) passed/);
    const failedMatch = output.match(/(\d+) failed/);
    
    const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
    const failed = failedMatch ? parseInt(failedMatch[1]) : 0;
    
    results.passed += passed;
    results.failed += failed;
    
    console.log(`✅ ${category}: ${passed} passed, ${failed} failed`);
    
    // Check for premium section specifically
    if (category === 'premium') {
      const hasPremiumSection = output.includes('Premium badge') || 
                                output.includes('PREMIUM') ||
                                output.includes('Premium page');
      console.log(`🔍 Premium section check: ${hasPremiumSection ? 'WORKING ✓' : 'ISSUE DETECTED ⚠️'}`);
    }
    
    return { passed, failed };
  } catch (error) {
    console.log(`❌ ${category} tests FAILED`);
    results.failed += 1;
    return { passed: 0, failed: 1, error: error.message };
  }
}

function checkPremiumSection() {
  console.log(`\n🔍 ${getTimeString()} - Quick Premium Section Check...`);
  
  try {
    const output = execSync(
      'npx playwright test e2e/premium-section.spec.ts:12 --reporter=line 2>&1',
      { 
        cwd: '/home/openclaw/.openclaw/workspace/visabuild-app',
        encoding: 'utf-8',
        timeout: 60000
      }
    );
    
    if (output.includes('passed')) {
      console.log('✅ Premium section is WORKING correctly');
      return true;
    } else {
      console.log('❌ Premium section has issues');
      return false;
    }
  } catch (error) {
    console.log('❌ Premium section check failed');
    return false;
  }
}

function printSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Iterations: ${results.iterations}`);
  console.log(`Total Passed: ${results.passed}`);
  console.log(`Total Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  console.log(`Duration: ${((new Date() - results.startTime) / 60000).toFixed(1)} minutes`);
  console.log('='.repeat(50));
}

// Main loop
console.log('🧪 CONTINUOUS TEST RUNNER');
console.log('Target: Run until 9:00 PM');
console.log('Tests: Admin, Lawyer, User, Premium');
console.log('='.repeat(50));

while (!shouldStop()) {
  results.iterations++;
  
  console.log('\n' + '='.repeat(50));
  console.log(`🔄 ITERATION ${results.iterations} - ${getTimeString()}`);
  console.log('='.repeat(50));
  
  // Run all test categories
  for (const [category, files] of Object.entries(TESTS)) {
    runTest(category, files);
    
    // Small delay between test batches
    execSync('sleep 2');
  }
  
  // Quick premium check
  checkPremiumSection();
  
  // Print mini summary
  console.log(`\n✅ Iteration ${results.iterations} complete`);
  console.log(`📊 Current: ${results.passed} passed, ${results.failed} failed`);
  
  // Check if we should continue
  if (shouldStop()) {
    console.log('\n🛑 Target time (9:00 PM) reached!');
    break;
  }
  
  // Wait 3 minutes before next iteration
  console.log('⏳ Waiting 3 minutes...');
  execSync('sleep 180');
}

// Final summary
printSummary();

console.log('\n✨ Testing complete!');
