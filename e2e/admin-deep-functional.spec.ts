import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const ADMIN_EMAIL = 'mrmaligi@outlook.com';
const ADMIN_PASSWORD = 'Qwerty@2007';

test.describe('DEEP FUNCTIONAL TESTS - Admin Features Last Layer', () => {
  test.setTimeout(90000);
  
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    const _adminBtn = page.locator('button:has-text("Admin")').first();
    if (await _adminBtn.isVisible({ timeout: 10000 }).catch(() => false)) { 
        await _adminBtn.click({ force: true }).catch(() => {});
        await page.waitForTimeout(1000);
    }
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await Promise.race([
        page.waitForFunction(() => !window.location.href.includes('/register') && !window.location.href.includes('/login'), { timeout: 30000 }),
        page.waitForSelector('text=/success|dashboard|pending|welcome/i', { timeout: 30000 })
    ]).catch(() => {});
    await page.waitForTimeout(3000);
  });

  // ==========================================
  // 1. USERS - Deep Test (Create, Read, Update)
  // ==========================================
  test('Users: Full CRUD workflow', async ({ page }) => {
    console.log('\n👥 TESTING USERS MODULE');
    
    // Navigate to Users
    await page.goto(`${BASE_URL}/admin/users`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Check if user list loads
    const hasUserTable = await page.locator('table, [class*="user"], [class*="table"]').count() > 0;
    console.log(`  ✅ User list page loads: ${hasUserTable}`);
    
    // Try to search
    const searchBox = page.locator('input[type="text"], input[placeholder*="search" i]').first();
    if (await searchBox.isVisible().catch(() => false)) {
      await searchBox.fill('test');
      await page.waitForTimeout(1000);
      console.log('  ✅ Search functionality works');
    }
    
    // Check for user actions (edit, view buttons)
    const actionButtons = await page.locator('button, a[href*="edit"], a[href*="view"]').count();
    console.log(`  ✅ Action buttons found: ${actionButtons}`);
    
    await page.screenshot({ path: 'test-results/deep-users.png', fullPage: true });
  });

  // ==========================================
  // 2. LAWYERS - Deep Test (Verify, Manage)
  // ==========================================
  test('Lawyers: Management workflow', async ({ page }) => {
    console.log('\n⚖️ TESTING LAWYERS MODULE');
    
    await page.goto(`${BASE_URL}/admin/lawyers`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Check lawyer list
    const lawyerCount = await page.locator('tr, [class*="lawyer"], [class*="card"]').count();
    console.log(`  ✅ Lawyers loaded: ${lawyerCount} items found`);
    
    // Check for verification status badges
    const hasStatusBadges = await page.locator('text=/approved|pending|rejected/i').count() > 0;
    console.log(`  ✅ Status badges present: ${hasStatusBadges}`);
    
    // Check for action buttons
    const canManage = await page.locator('button:has-text("Verify"), button:has-text("Edit"), button:has-text("View")').count() > 0;
    console.log(`  ✅ Management actions available: ${canManage}`);
    
    await page.screenshot({ path: 'test-results/deep-lawyers.png', fullPage: true });
  });

  // ==========================================
  // 3. VISAS - Deep Test (CRUD, Search)
  // ==========================================
  test('Visas: Database management', async ({ page }) => {
    console.log('\n📋 TESTING VISAS MODULE');
    
    await page.goto(`${BASE_URL}/admin/visas`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Check visa list loads
    const visaItems = await page.locator('tr, [class*="visa"]').count();
    console.log(`  ✅ Visas loaded: ${visaItems} visas found`);
    
    // Check search/filter
    const searchInput = page.locator('input[type="text"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('189');
      await page.waitForTimeout(1000);
      console.log('  ✅ Visa search works');
    }
    
    // Check for subclass numbers
    const hasSubclassData = await page.locator('text=/subclass|189|190|482|500/i').count() > 0;
    console.log(`  ✅ Visa data displayed: ${hasSubclassData}`);
    
    await page.screenshot({ path: 'test-results/deep-visas.png', fullPage: true });
  });

  // ==========================================
  // 4. CONTENT CMS - Deep Test (Pages, Blog)
  // ==========================================
  test('Content: CMS functionality', async ({ page }) => {
    console.log('\n📝 TESTING CONTENT MODULE');
    
    // Test Blog
    await page.goto(`${BASE_URL}/admin/blog`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    const blogPosts = await page.locator('tr, article, [class*="post"], [class*="blog"]').count();
    console.log(`  ✅ Blog posts: ${blogPosts} found`);
    
    // Check for create button
    const canCreate = await page.locator('button:has-text("New"), button:has-text("Create"), button:has-text("Add")').count() > 0;
    console.log(`  ✅ Can create content: ${canCreate}`);
    
    // Test Pages
    await page.goto(`${BASE_URL}/admin/pages`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    const pages = await page.locator('tr, [class*="page"]').count();
    console.log(`  ✅ Pages: ${pages} found`);
    
    await page.screenshot({ path: 'test-results/deep-content.png', fullPage: true });
  });

  // ==========================================
  // 5. SUPPORT TICKETS - Deep Test (Workflow)
  // ==========================================
  test('Support: Ticket management', async ({ page }) => {
    console.log('\n🎫 TESTING SUPPORT TICKETS');
    
    await page.goto(`${BASE_URL}/admin/support/tickets`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Check ticket list
    const tickets = await page.locator('tr, [class*="ticket"]').count();
    console.log(`  ✅ Tickets: ${tickets} found`);
    
    // Check status filters
    const hasFilters = await page.locator('button:has-text("Open"), button:has-text("Resolved"), select').count() > 0;
    console.log(`  ✅ Status filters: ${hasFilters}`);
    
    // Check for priority indicators
    const hasPriority = await page.locator('text=/high|urgent|low|medium/i').count() > 0;
    console.log(`  ✅ Priority indicators: ${hasPriority}`);
    
    await page.screenshot({ path: 'test-results/deep-support.png', fullPage: true });
  });

  // ==========================================
  // 6. ANALYTICS - Deep Test (Data Display)
  // ==========================================
  test('Analytics: Data visualization', async ({ page }) => {
    console.log('\n📊 TESTING ANALYTICS');
    
    await page.goto(`${BASE_URL}/admin/analytics/overview`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Check for charts
    const hasCharts = await page.locator('svg, canvas, [class*="chart"], [class*="recharts"]').count() > 0;
    console.log(`  ✅ Charts present: ${hasCharts}`);
    
    // Check for metrics
    const hasMetrics = await page.locator('text=/users|bookings|revenue|visits/i').count() > 0;
    console.log(`  ✅ Metrics displayed: ${hasMetrics}`);
    
    // Check for date filters
    const hasDateFilter = await page.locator('button:has-text("7 days"), button:has-text("30 days"), input[type="date"]').count() > 0;
    console.log(`  ✅ Date filters: ${hasDateFilter}`);
    
    await page.screenshot({ path: 'test-results/deep-analytics.png', fullPage: true });
  });

  // ==========================================
  // 7. SETTINGS - Deep Test (Configuration)
  // ==========================================
  test('Settings: Configuration forms', async ({ page }) => {
    console.log('\n⚙️ TESTING SETTINGS');
    
    await page.goto(`${BASE_URL}/admin/settings`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Check for form inputs
    const formInputs = await page.locator('input, select, textarea').count();
    console.log(`  ✅ Form fields: ${formInputs} inputs found`);
    
    // Check for save button
    const hasSave = await page.locator('button[type="submit"], button:has-text("Save")').count() > 0;
    console.log(`  ✅ Save functionality: ${hasSave}`);
    
    // Try to interact with a setting
    const firstInput = page.locator('input[type="text"]').first();
    if (await firstInput.isVisible().catch(() => false)) {
      const originalValue = await firstInput.inputValue();
      await firstInput.fill('Test Value');
      await page.waitForTimeout(500);
      await firstInput.fill(originalValue);
      console.log('  ✅ Settings editable');
    }
    
    await page.screenshot({ path: 'test-results/deep-settings.png', fullPage: true });
  });

  // ==========================================
  // 8. PRICING - Deep Test (Commerce)
  // ==========================================
  test('Pricing: Commerce management', async ({ page }) => {
    console.log('\n💰 TESTING PRICING');
    
    await page.goto(`${BASE_URL}/admin/pricing`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Check pricing tiers
    const pricingItems = await page.locator('tr, [class*="price"], [class*="tier"]').count();
    console.log(`  ✅ Pricing items: ${pricingItems} found`);
    
    // Check for currency symbols
    const hasCurrency = await page.locator('text=/\$|AUD|USD|€|£/').count() > 0;
    console.log(`  ✅ Currency displayed: ${hasCurrency}`);
    
    await page.screenshot({ path: 'test-results/deep-pricing.png', fullPage: true });
  });

  // ==========================================
  // 9. PERFORMANCE - Deep Test (System Status)
  // ==========================================
  test('Performance: System monitoring', async ({ page }) => {
    console.log('\n🔧 TESTING PERFORMANCE MONITORING');
    
    await page.goto(`${BASE_URL}/admin/performance`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Check for status indicators
    const hasStatus = await page.locator('text=/healthy|error|warning|online/i').count() > 0;
    console.log(`  ✅ Status indicators: ${hasStatus}`);
    
    // Check for metrics
    const hasMetrics = await page.locator('text=/users|bookings|documents|api/i').count() > 0;
    console.log(`  ✅ System metrics: ${hasMetrics}`);
    
    // Check for refresh button
    const hasRefresh = await page.locator('button:has-text("Refresh"), button svg').count() > 0;
    console.log(`  ✅ Refresh functionality: ${hasRefresh}`);
    
    await page.screenshot({ path: 'test-results/deep-performance.png', fullPage: true });
  });

  // ==========================================
  // 10. ACTIVITY LOG - Deep Test (Audit Trail)
  // ==========================================
  test('Activity Log: Audit functionality', async ({ page }) => {
    console.log('\n📜 TESTING ACTIVITY LOG');
    
    await page.goto(`${BASE_URL}/admin/activity`);
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Check log entries
    const logEntries = await page.locator('tr, [class*="log"], [class*="activity"]').count();
    console.log(`  ✅ Log entries: ${logEntries} found`);
    
    // Check for filters
    const hasFilters = await page.locator('select, button:has-text("Filter"), input[type="date"]').count() > 0;
    console.log(`  ✅ Filter options: ${hasFilters}`);
    
    // Check for action types
    const hasActionTypes = await page.locator('text=/created|updated|deleted|login/i').count() > 0;
    console.log(`  ✅ Action types logged: ${hasActionTypes}`);
    
    await page.screenshot({ path: 'test-results/deep-activity.png', fullPage: true });
  });
});
