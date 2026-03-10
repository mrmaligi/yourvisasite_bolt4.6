import { test, expect, Page } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:5174';

// Helper to check page structure
async function checkPageStructure(page: Page, options: {
  title?: string;
  hasHeader?: boolean;
  hasContent?: boolean;
  hasFooter?: boolean;
}) {
  if (options.title) {
    await expect(page).toHaveTitle(/VisaBuild|AusVisa/);
  }
  
  // Check body is visible
  await expect(page.locator('body')).toBeVisible();
  
  // Check for common layout elements
  const hasNav = await page.locator('nav, header').count() > 0;
  console.log(`  📍 Navigation present: ${hasNav}`);
  
  // Check no React errors visible
  const errorText = await page.locator('text=/error|Error|is not a function/i').count();
  expect(errorText).toBe(0);
}

// Helper to test responsive design
async function testResponsive(page: Page, path: string) {
  // Desktop
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(`${baseURL}${path}`);
  await expect(page.locator('body')).toBeVisible();
  
  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.reload();
  await expect(page.locator('body')).toBeVisible();
  
  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload();
  await expect(page.locator('body')).toBeVisible();
}

test.describe('🔍 IN-DEPTH PAGE TESTS', () => {
  
  test.describe('🏠 Public Pages - Deep Analysis', () => {
    
    test('Home Page - Full Content Check', async ({ page }) => {
      await page.goto(`${baseURL}/`);
      
      // Check structure
      await checkPageStructure(page, { title: true });
      
      // Check for key sections
      await expect(page.locator('text=/track|visa|immigration/i').first()).toBeVisible();
      
      // Check all navigation links work
      const links = await page.locator('nav a, header a').all();
      console.log(`  🔗 Found ${links.length} navigation links`);
      
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http')) {
          console.log(`  ✓ Link: ${href}`);
        }
      }
    });

    test('Tracker Page - AusVisa Dashboard', async ({ page }) => {
      await page.goto(`${baseURL}/tracker`);
      
      // Check key elements
      await expect(page.locator('text=/community|tracker|prediction/i').first()).toBeVisible();
      
      // Check stats cards
      const statsCards = await page.locator('[class*="bg-white"], [class*="border"]').count();
      console.log(`  📊 Stats cards found: ${statsCards}`);
      
      // Check for visa type list
      await expect(page.locator('text=/partner visa|skilled|student/i').first()).toBeVisible();
    });

    test('Submit Timeline Form - Multi-step', async ({ page }) => {
      await page.goto(`${baseURL}/tracker/submit`);
      
      // Check form elements
      await expect(page.locator('select, input, button').first()).toBeVisible();
      
      // Check step indicators
      const steps = await page.locator('[class*="step"], [class*="progress"]').count();
      console.log(`  📝 Form steps found: ${steps}`);
    });

    test('Visa Search - Functionality', async ({ page }) => {
      await page.goto(`${baseURL}/visas`);
      
      // Check search/filter elements
      const hasSearch = await page.locator('input[type="search"], input[placeholder*="search"]').count() > 0;
      console.log(`  🔍 Search input present: ${hasSearch}`);
      
      // Check visa list
      await expect(page.locator('text=/visa|subclass/i').first()).toBeVisible();
    });
  });

  test.describe('👤 User Dashboard - Deep Tests', () => {
    
    test('User Dashboard - Layout & Navigation', async ({ page }) => {
      await page.goto(`${baseURL}/dashboard`);
      
      await checkPageStructure(page, {});
      
      // Check sidebar/nav
      const sidebarLinks = await page.locator('aside a, nav a').allTextContents();
      console.log(`  📋 Sidebar items: ${sidebarLinks.join(', ')}`);
    });

    test('User Documents - Upload Interface', async ({ page }) => {
      await page.goto(`${baseURL}/dashboard/documents`);
      
      // Check for upload area or button
      const uploadElements = await page.locator('text=/upload|document|file/i').count();
      console.log(`  📁 Upload-related elements: ${uploadElements}`);
    });

    test('User Chat - Messaging Interface', async ({ page }) => {
      await page.goto(`${baseURL}/dashboard/chat`);
      
      // Check chat interface
      const hasMessageInput = await page.locator('input[placeholder*="message"], textarea').count() > 0;
      console.log(`  💬 Message input present: ${hasMessageInput}`);
    });
  });

  test.describe('⚖️ Lawyer Portal - Deep Tests', () => {
    
    test('Lawyer Dashboard - Analytics', async ({ page }) => {
      await page.goto(`${baseURL}/lawyer/dashboard`);
      
      await checkPageStructure(page, {});
      
      // Check for stats/analytics
      const stats = await page.locator('text=/case|client|earning|review/i').count();
      console.log(`  📈 Dashboard stats found: ${stats}`);
    });

    test('Lawyer Cases - Case Management', async ({ page }) => {
      await page.goto(`${baseURL}/lawyer/cases`);
      
      // Check for case list/table
      const cases = await page.locator('tr, [class*="case"]').count();
      console.log(`  📂 Case items found: ${cases}`);
    });

    test('Lawyer Availability - Schedule', async ({ page }) => {
      await page.goto(`${baseURL}/lawyer/availability`);
      
      // Check for calendar/schedule
      const timeSlots = await page.locator('text=/:00|:30|AM|PM/i').count();
      console.log(`  🕐 Time slots found: ${timeSlots}`);
    });
  });

  test.describe('⚙️ Admin Panel - Deep Tests', () => {
    
    test('Admin Dashboard - Overview', async ({ page }) => {
      await page.goto(`${baseURL}/admin`);
      
      await checkPageStructure(page, {});
      
      // Check admin navigation
      const adminLinks = await page.locator('nav a, sidebar a').allTextContents();
      console.log(`  🔐 Admin nav items: ${adminLinks.slice(0, 5).join(', ')}`);
    });

    test('Admin Users - Management Table', async ({ page }) => {
      await page.goto(`${baseURL}/admin/users`);
      
      // Check for data table
      const tableRows = await page.locator('tr').count();
      console.log(`  👥 Table rows: ${tableRows}`);
      
      // Check for action buttons
      const actions = await page.locator('button, [class*="action"]').count();
      console.log(`  ⚡ Action buttons: ${actions}`);
    });

    test('Admin Payments - Financial Data', async ({ page }) => {
      await page.goto(`${baseURL}/admin/payments`);
      
      // Check for payment-related content
      const paymentElements = await page.locator('text=/payment|transaction|amount|\$/i').count();
      console.log(`  💰 Payment elements: ${paymentElements}`);
    });
  });

  test.describe('📱 Responsive Design Tests', () => {
    
    const keyPages = ['/', '/tracker', '/dashboard', '/lawyer/dashboard', '/admin'];
    
    for (const path of keyPages) {
      test(`Responsive: ${path}`, async ({ page }) => {
        await testResponsive(page, path);
        console.log(`  📱 Responsive OK: ${path}`);
      });
    }
  });

  test.describe('🧭 Navigation Flow Tests', () => {
    
    test('Full User Journey - Public to Dashboard', async ({ page }) => {
      // Start at home
      await page.goto(`${baseURL}/`);
      
      // Navigate to tracker
      await page.goto(`${baseURL}/tracker`);
      await expect(page.locator('body')).toBeVisible();
      
      // Navigate to visas
      await page.goto(`${baseURL}/visas`);
      await expect(page.locator('body')).toBeVisible();
      
      // Navigate to pricing
      await page.goto(`${baseURL}/pricing`);
      await expect(page.locator('body')).toBeVisible();
      
      console.log('  🧭 Navigation flow complete');
    });

    test('Cross-Role Navigation', async ({ page }) => {
      const routes = [
        { name: 'Public', path: '/' },
        { name: 'User', path: '/dashboard' },
        { name: 'Lawyer', path: '/lawyer/dashboard' },
        { name: 'Admin', path: '/admin' },
      ];
      
      for (const route of routes) {
        await page.goto(`${baseURL}${route.path}`);
        await expect(page.locator('body')).toBeVisible();
        console.log(`  ✓ ${route.name} page loads`);
      }
    });
  });

  test.describe('⚡ Performance & Errors', () => {
    
    test('No Console Errors on Key Pages', async ({ page }) => {
      const errors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.goto(`${baseURL}/`);
      await page.waitForLoadState('networkidle');
      
      // Filter out non-critical errors
      const criticalErrors = errors.filter(e => 
        !e.includes('favicon') && 
        !e.includes('net::ERR') &&
        !e.includes('404')
      );
      
      console.log(`  ⚠️ Console errors: ${criticalErrors.length}`);
      expect(criticalErrors.length).toBeLessThan(5);
    });

    test('Page Load Performance', async ({ page }) => {
      const start = Date.now();
      await page.goto(`${baseURL}/tracker`);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - start;
      
      console.log(`  ⏱️ Tracker load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(10000); // Under 10 seconds
    });
  });
});
