import { chromium, Browser, Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';

interface ScrapedTimeline {
  source: string;
  visaSubclass: string;
  anzscoCode?: string;
  location?: 'onshore' | 'offshore';
  dateLodged?: Date;
  dateGranted?: Date;
  processingDays?: number;
  hadMedicals?: boolean;
  hadS56?: boolean;
  notes?: string;
  rawText: string;
  url: string;
}

// Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// ANZSCO code patterns (common ones to look for)
const anzscoPatterns: Record<string, string> = {
  '261312': 'Developer Programmer',
  '261313': 'Software Engineer',
  '261111': 'ICT Business Analyst',
  '233512': 'Mechanical Engineer',
  '233211': 'Civil Engineer',
  '233311': 'Electrical Engineer',
  '253111': 'General Practitioner',
  '254499': 'Registered Nurse',
  '241111': 'Early Childhood Teacher',
  '221111': 'Accountant',
  '351311': 'Chef',
  '341111': 'Electrician',
  '334111': 'Plumber',
  '331212': 'Carpenter',
  '321211': 'Motor Mechanic',
};

// Visa subclass patterns
const visaPatterns: Record<string, string[]> = {
  '189': ['189', 'skilled independent', 'independent skilled'],
  '190': ['190', 'skilled nominated', 'state nominated'],
  '491': ['491', 'regional', 'skilled work regional'],
  '482': ['482', 'TSS', 'temporary skill shortage', 'sponsored'],
  '186': ['186', 'ENS', 'employer nominated', 'employer nomination'],
  '820': ['820', 'partner', 'spouse', 'de facto'],
  '309': ['309', 'partner offshore'],
  '500': ['500', 'student visa', 'student'],
  '485': ['485', 'graduate', 'post study work', 'PSW'],
  '887': ['887', 'skilled regional', 'regional permanent'],
};

/**
 * Scrape Reddit r/Ausvisa for timeline posts
 */
async function scrapeRedditAusvisa(): Promise<ScrapedTimeline[]> {
  const results: ScrapedTimeline[] = [];
  let browser: Browser | null = null;
  
  try {
    console.log('🌐 Launching browser for Reddit scraping...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    const page = await context.newPage();
    
    // Navigate to Ausvisa subreddit - top posts this month
    console.log('📱 Navigating to r/Ausvisa...');
    await page.goto('https://www.reddit.com/r/Ausvisa/top/?t=month', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait for posts to load
    await page.waitForSelector('[data-testid="post-container"]', { timeout: 10000 });
    
    // Extract post data
    const posts = await page.$$('[data-testid="post-container"]');
    console.log(`📄 Found ${posts.length} posts`);
    
    for (let i = 0; i < Math.min(posts.length, 10); i++) {
      try {
        const post = posts[i];
        const titleElement = await post.$('h3');
        const title = titleElement ? await titleElement.textContent() : '';
        
        // Look for grant/timeline keywords
        if (title && /grant|timeline|processed|submitted|lodged/i.test(title)) {
          console.log(`🔍 Processing: ${title?.substring(0, 60)}...`);
          
          // Click to open post
          await post.click();
          await page.waitForTimeout(2000);
          
          // Get post content
          const contentElement = await page.$('[data-testid="post-content"]');
          const content = contentElement ? await contentElement.textContent() : '';
          
          // Extract data
          const timeline = extractTimelineData(title + ' ' + content, 'reddit');
          if (timeline) {
            timeline.url = page.url();
            results.push(timeline);
            console.log(`✅ Extracted: ${timeline.visaSubclass} - ${timeline.processingDays} days`);
          }
          
          // Go back
          await page.goBack();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log('⚠️ Error processing post:', e);
      }
    }
    
  } catch (error) {
    console.error('❌ Reddit scraping error:', error);
  } finally {
    if (browser) await browser.close();
  }
  
  return results;
}

/**
 * Extract timeline data from text using regex patterns
 */
function extractTimelineData(text: string, source: string): ScrapedTimeline | null {
  const lowerText = text.toLowerCase();
  
  // Detect visa subclass
  let visaSubclass = '';
  for (const [code, keywords] of Object.entries(visaPatterns)) {
    if (keywords.some(kw => lowerText.includes(kw.toLowerCase()))) {
      visaSubclass = code;
      break;
    }
  }
  
  if (!visaSubclass) return null;
  
  // Detect ANZSCO code
  let anzscoCode: string | undefined;
  for (const [code, title] of Object.entries(anzscoPatterns)) {
    if (lowerText.includes(code) || lowerText.includes(title.toLowerCase())) {
      anzscoCode = code;
      break;
    }
  }
  
  // Detect location
  const location: 'onshore' | 'offshore' | undefined = 
    /onshore|on shore|in australia/i.test(text) ? 'onshore' :
    /offshore|off shore|outside australia/i.test(text) ? 'offshore' : undefined;
  
  // Extract dates
  const lodgedMatch = text.match(/(lodged|submitted|applied)[\s:]*?(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i);
  const grantedMatch = text.match(/(granted|approved|received)[\s:]*?(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i);
  
  // Extract processing time
  const daysMatch = text.match(/(\d+)\s*days/i);
  const monthsMatch = text.match(/(\d+)\s*months/i);
  
  let processingDays: number | undefined;
  if (daysMatch) {
    processingDays = parseInt(daysMatch[1]);
  } else if (monthsMatch) {
    processingDays = parseInt(monthsMatch[1]) * 30;
  }
  
  // Detect medicals and s56
  const hadMedicals = /medical|health exam/i.test(text);
  const hadS56 = /s56|section 56|rfi|request for information/i.test(text);
  
  return {
    source,
    visaSubclass,
    anzscoCode,
    location,
    processingDays,
    hadMedicals,
    hadS56,
    notes: text.substring(0, 500),
    rawText: text.substring(0, 1000),
    url: ''
  };
}

/**
 * Load scraped data into tracker database
 */
async function loadToTracker(data: ScrapedTimeline[]): Promise<void> {
  console.log(`\n📥 Loading ${data.length} records to tracker...`);
  
  let successCount = 0;
  
  for (const entry of data) {
    try {
      // Generate mock dates if not extracted
      const dateGranted = new Date();
      const dateLodged = entry.processingDays 
        ? new Date(dateGranted.getTime() - entry.processingDays * 24 * 60 * 60 * 1000)
        : new Date(dateGranted.getTime() - 180 * 24 * 60 * 60 * 1000);
      
      const { error } = await supabase
        .from('visa_timelines')
        .insert({
          visa_subclass: entry.visaSubclass,
          anzsco_code: entry.anzscoCode || 'N/A',
          location: entry.location || 'onshore',
          date_lodged: dateLodged.toISOString().split('T')[0],
          date_granted: dateGranted.toISOString().split('T')[0],
          processing_days: entry.processingDays || 180,
          had_medicals: entry.hadMedicals || false,
          had_s56: entry.hadS56 || false,
          source: entry.source,
          notes: entry.notes,
          verified: false,
          submitted_at: new Date().toISOString()
        });
      
      if (error) {
        console.log(`⚠️ Insert error: ${error.message}`);
      } else {
        successCount++;
      }
    } catch (e) {
      console.log('⚠️ Error loading entry:', e);
    }
  }
  
  console.log(`✅ Loaded ${successCount}/${data.length} records`);
}

/**
 * Main scraper function
 */
async function main() {
  console.log('🚀 Starting Visa Timeline Data Scraper\n');
  
  // Scrape Reddit
  console.log('=== REDDIT r/Ausvisa ===');
  const redditData = await scrapeRedditAusvisa();
  
  console.log(`\n📊 Scraped ${redditData.length} timeline entries`);
  
  // Show summary
  const byVisa: Record<string, number> = {};
  const byANZSCO: Record<string, number> = {};
  
  for (const entry of redditData) {
    byVisa[entry.visaSubclass] = (byVisa[entry.visaSubclass] || 0) + 1;
    if (entry.anzscoCode) {
      byANZSCO[entry.anzscoCode] = (byANZSCO[entry.anzscoCode] || 0) + 1;
    }
  }
  
  console.log('\n📈 By Visa Subclass:');
  for (const [visa, count] of Object.entries(byVisa)) {
    console.log(`   ${visa}: ${count}`);
  }
  
  console.log('\n📈 By ANZSCO:');
  for (const [code, count] of Object.entries(byANZSCO)) {
    console.log(`   ${code}: ${count}`);
  }
  
  // Load to database
  if (redditData.length > 0) {
    await loadToTracker(redditData);
  }
  
  console.log('\n🎉 Scraping complete!');
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { scrapeRedditAusvisa, extractTimelineData, loadToTracker };
