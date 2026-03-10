/**
 * Simple Reddit Visa Timeline Scraper
 * Run with: npx tsx scripts/scrape-reddit-simple.ts
 */

import { chromium } from 'playwright';

interface TimelineEntry {
  visaType: string;
  anzscoCode?: string;
  days?: number;
  location?: string;
  hasMedicals?: boolean;
  hasS56?: boolean;
  text: string;
}

const anzscoKeywords: Record<string, string> = {
  '261312': 'developer programmer',
  '261313': 'software engineer',
  '261111': 'ict business analyst',
  '261112': 'systems analyst',
  '233512': 'mechanical engineer',
  '233211': 'civil engineer',
  '233311': 'electrical engineer',
  '233411': 'electronics engineer',
  '253111': 'general practitioner',
  '253112': 'resident medical officer',
  '254499': 'registered nurse',
  '241111': 'early childhood teacher',
  '241213': 'primary school teacher',
  '241411': 'secondary school teacher',
  '221111': 'accountant',
  '221112': 'management accountant',
  '221113': 'taxation accountant',
  '351311': 'chef',
  '351411': 'cook',
  '341111': 'electrician',
  '334111': 'plumber',
  '331212': 'carpenter',
  '321211': 'motor mechanic',
};

async function scrapeReddit() {
  console.log('🌐 Starting Reddit Visa Scraper...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  
  const entries: TimelineEntry[] = [];
  
  try {
    // Navigate to Ausvisa
    console.log('📱 Going to r/Ausvisa...');
    await page.goto('https://www.reddit.com/r/Ausvisa/search/?q=grant%20timeline&type=posts&sort=new', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    // Wait for posts
    await page.waitForTimeout(3000);
    
    // Get all post titles
    const postElements = await page.$$('a[data-testid="post-title-text"]');
    console.log(`📄 Found ${postElements.length} posts\n`);
    
    for (let i = 0; i < Math.min(postElements.length, 15); i++) {
      const element = postElements[i];
      const title = await element.textContent() || '';
      const href = await element.getAttribute('href') || '';
      
      // Check if it's a grant/timeline post
      if (/grant|timeline|189|190|491|820|801/i.test(title)) {
        console.log(`🔍 [${i + 1}] ${title.substring(0, 70)}...`);
        
        // Click and get content
        try {
          const [newPage] = await Promise.all([
            context.waitForEvent('page', { timeout: 5000 }).catch(() => null),
            element.click()
          ]);
          
          await page.waitForTimeout(2000);
          
          // Get post text
          const contentDiv = await page.$('[data-testid="post-content"] .mb-sm');
          const content = contentDiv ? await contentDiv.textContent() || '' : '';
          
          // Extract data
          const data = extractData(title + ' ' + content);
          if (data) {
            entries.push(data);
            console.log(`   ✅ ${data.visaType} | ${data.days} days | ${data.anzscoCode || 'N/A'}`);
          } else {
            console.log(`   ⚠️ No data extracted`);
          }
          
          // Go back
          await page.goBack();
          await page.waitForTimeout(1500);
          
        } catch (e) {
          console.log(`   ❌ Error: ${e.message}`);
          await page.goto('https://www.reddit.com/r/Ausvisa/search/?q=grant%20timeline&type=posts&sort=new');
          await page.waitForTimeout(2000);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
  
  // Results
  console.log('\n' + '='.repeat(50));
  console.log(`📊 SCRAPED ${entries.length} ENTRIES`);
  console.log('='.repeat(50));
  
  // Group by visa
  const byVisa: Record<string, number> = {};
  const byANZSCO: Record<string, number> = {};
  
  for (const entry of entries) {
    byVisa[entry.visaType] = (byVisa[entry.visaType] || 0) + 1;
    if (entry.anzscoCode) {
      byANZSCO[entry.anzscoCode] = (byANZSCO[entry.anzscoCode] || 0) + 1;
    }
  }
  
  console.log('\n📈 By Visa Type:');
  for (const [visa, count] of Object.entries(byVisa)) {
    console.log(`   ${visa}: ${count}`);
  }
  
  console.log('\n📈 By ANZSCO:');
  for (const [code, count] of Object.entries(byANZSCO)) {
    console.log(`   ${code}: ${count}`);
  }
  
  // Sample entries
  console.log('\n📝 Sample Entries:');
  entries.slice(0, 5).forEach((e, i) => {
    console.log(`\n   ${i + 1}. ${e.visaType} | ${e.days || '?'} days`);
    console.log(`      ANZSCO: ${e.anzscoCode || 'Unknown'}`);
    console.log(`      Location: ${e.location || 'Unknown'}`);
    console.log(`      Text: ${e.text.substring(0, 80)}...`);
  });
  
  return entries;
}

function extractData(text: string): TimelineEntry | null {
  const lower = text.toLowerCase();
  
  // Detect visa
  let visaType = '';
  if (/\b189\b/.test(text)) visaType = '189';
  else if (/\b190\b/.test(text)) visaType = '190';
  else if (/\b491\b/.test(text)) visaType = '491';
  else if (/\b482\b/.test(text)) visaType = '482';
  else if (/\b186\b/.test(text)) visaType = '186';
  else if (/\b820\b/.test(text)) visaType = '820';
  else if (/\b500\b/.test(text)) visaType = '500';
  else if (/\b485\b/.test(text)) visaType = '485';
  
  if (!visaType) return null;
  
  // Detect ANZSCO
  let anzscoCode: string | undefined;
  for (const [code, keyword] of Object.entries(anzscoKeywords)) {
    if (lower.includes(keyword)) {
      anzscoCode = code;
      break;
    }
  }
  
  // Also check for direct code mentions
  const codeMatch = text.match(/\b(\d{6})\b/);
  if (codeMatch && !anzscoCode) {
    anzscoCode = codeMatch[1];
  }
  
  // Detect processing time
  let days: number | undefined;
  const daysMatch = text.match(/(\d+)\s*days?/i);
  const monthsMatch = text.match(/(\d+)\s*months?/i);
  
  if (daysMatch) {
    days = parseInt(daysMatch[1]);
  } else if (monthsMatch) {
    days = parseInt(monthsMatch[1]) * 30;
  }
  
  // Detect location
  let location: string | undefined;
  if (/onshore|on shore|in australia/i.test(text)) location = 'onshore';
  else if (/offshore|off shore|outside australia|overseas/i.test(text)) location = 'offshore';
  
  // Detect medicals/s56
  const hasMedicals = /medical|health exam/i.test(text);
  const hasS56 = /s56|section 56|rfi|request for/i.test(text);
  
  return {
    visaType,
    anzscoCode,
    days,
    location,
    hasMedicals,
    hasS56,
    text: text.substring(0, 300)
  };
}

// Run
scrapeReddit().catch(console.error);
