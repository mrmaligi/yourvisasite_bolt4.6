import { chromium, Browser, Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { anzscoOccupations } from '../src/data/anzsco-codes.js';

// Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface ScrapedEntry {
  visa_subclass: string;
  anzsco_code: string;
  location: 'onshore' | 'offshore';
  date_lodged?: string;
  date_granted?: string;
  processing_days: number;
  had_medicals: boolean;
  had_s56: boolean;
  points?: number;
  source: string;
  notes: string;
  url: string;
  verified: boolean;
}

// Build occupation name to code mapping
const occupationNameToCode: Map<string, string> = new Map();
const occupationKeywords: Map<string, string> = new Map();

// Initialize mappings from ANZSCO data
anzscoOccupations.forEach(occ => {
  // Direct title match
  occupationNameToCode.set(occ.title.toLowerCase(), occ.code);
  
  // Add keywords
  const words = occ.title.toLowerCase().split(/[\s\(\),\/]+/);
  words.forEach(word => {
    if (word.length > 3) {
      occupationKeywords.set(word, occ.code);
    }
  });
});

// Manual mappings for common variations
const manualMappings: Record<string, string> = {
  'engineering technologist': '233914',
  'developer': '261312',
  'software developer': '261312',
  'programmer': '261312',
  'software dev': '261312',
  'business analyst': '261111',
  'ba': '261111',
  'mechanical': '233512',
  'civil engineer': '233211',
  'electrical engineer': '233311',
  'electronics engineer': '233411',
  'accountant': '221111',
  'cpa': '221111',
  'chartered accountant': '221111',
  'chef': '351311',
  'cook': '351411',
  'nurse': '254499',
  'registered nurse': '254499',
  'teacher': '241411',
  'electrician': '341111',
  'plumber': '334111',
  'carpenter': '331212',
  'motor mechanic': '321211',
  'mechanic': '321211',
  'gp': '253111',
  'general practitioner': '253111',
  'doctor': '253111',
  'ict': '262100',
  'it': '262100',
  'software': '261313',
  'web developer': '261212',
  'network engineer': '263111',
  'systems admin': '261413',
  'database admin': '261411',
  'security specialist': '261412',
  'tester': '261314',
  'qa': '261314',
};

Object.entries(manualMappings).forEach(([name, code]) => {
  occupationNameToCode.set(name.toLowerCase(), code);
});

/**
 * Clean and extract ANZSCO code from text
 */
function extractANZSCO(text: string): string {
  const lowerText = text.toLowerCase();
  
  // First, look for direct 6-digit code
  const codeMatch = text.match(/\b(\d{6})\b/);
  if (codeMatch) {
    return codeMatch[1];
  }
  
  // Look for full occupation name matches
  for (const [name, code] of occupationNameToCode.entries()) {
    if (lowerText.includes(name)) {
      return code;
    }
  }
  
  // Look for keyword matches
  for (const [keyword, code] of occupationKeywords.entries()) {
    if (lowerText.includes(keyword)) {
      return code;
    }
  }
  
  // Return N/A if no match found
  return 'N/A';
}

/**
 * Extract visa subclass from text
 */
function extractVisa(text: string): string {
  const lower = text.toLowerCase();
  
  // Check for explicit codes
  const visaMatch = text.match(/\b(189|190|491|482|186|820|801|309|100|500|485|887|300|461|476|417)\b/);
  if (visaMatch) return visaMatch[1];
  
  // Check for keywords
  if (/partner|spouse|de facto|relationship|820|801/.test(lower)) return '820';
  if (/student|study|500/.test(lower)) return '500';
  if (/graduate|485|post.?study|psw/.test(lower)) return '485';
  if (/independent|189/.test(lower)) return '189';
  if (/nominated|state|190/.test(lower)) return '190';
  if (/regional|491|489/.test(lower)) return '491';
  if (/employer|sponsor|482|457|186/.test(lower)) return '482';
  if (/visitor|tourist|600/.test(lower)) return '600';
  if (/working holiday|417|462/.test(lower)) return '417';
  
  return 'Unknown';
}

/**
 * Extract processing time in days
 */
function extractProcessingDays(text: string): number | null {
  // Look for "X days"
  const daysMatch = text.match(/(\d{1,3})\s*days?/i);
  if (daysMatch) {
    return parseInt(daysMatch[1]);
  }
  
  // Look for "X months"
  const monthsMatch = text.match(/(\d{1,2})\s*months?/i);
  if (monthsMatch) {
    return parseInt(monthsMatch[1]) * 30;
  }
  
  // Look for "X weeks"
  const weeksMatch = text.match(/(\d{1,2})\s*weeks?/i);
  if (weeksMatch) {
    return parseInt(weeksMatch[1]) * 7;
  }
  
  // Calculate from dates if present
  const lodgedMatch = text.match(/(lodged|applied|submitted)[\s:]*?(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i);
  const grantedMatch = text.match(/(granted|approved|received)[\s:]*?(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i);
  
  if (lodgedMatch && grantedMatch) {
    try {
      const lodged = new Date(lodgedMatch[2]);
      const granted = new Date(grantedMatch[2]);
      const diff = Math.round((granted.getTime() - lodged.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0 && diff < 2000) return diff;
    } catch {}
  }
  
  return null;
}

/**
 * Scrape Reddit for visa timelines
 */
async function scrapeRedditTarget(targetCount: number = 500): Promise<ScrapedEntry[]> {
  const entries: ScrapedEntry[] = [];
  let browser: Browser | null = null;
  
  console.log(`🎯 Target: ${targetCount} entries`);
  console.log('🌐 Launching browser...\n');
  
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    
    // Search variations to get more results
    const searchQueries = [
      'grant timeline',
      '189 grant',
      '190 grant',
      '491 grant',
      'visa granted',
      'partner visa grant',
      'processing time',
      'visa timeline 2024',
      'immigration grant',
      'subclass grant'
    ];
    
    for (const query of searchQueries) {
      if (entries.length >= targetCount) break;
      
      console.log(`\n🔍 Searching: "${query}"`);
      
      try {
        await page.goto(`https://www.reddit.com/r/Ausvisa/search/?q=${encodeURIComponent(query)}&type=posts&sort=new`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        await page.waitForTimeout(3000);
        
        // Get all posts on page
        const posts = await page.locator('[data-testid="post-container"]').all();
        console.log(`   Found ${posts.length} posts`);
        
        for (const post of posts.slice(0, 25)) {
          if (entries.length >= targetCount) break;
          
          try {
            const titleEl = post.locator('h3').first();
            const title = await titleEl.textContent() || '';
            
            // Skip if not grant-related
            if (!/grant|timeline|processed|approved|received/i.test(title)) continue;
            
            // Click to get full content
            await post.click();
            await page.waitForTimeout(2000);
            
            // Get content
            const contentEl = page.locator('[data-testid="post-content"]').first();
            const content = await contentEl.textContent() || '';
            const url = page.url();
            
            const fullText = title + ' ' + content;
            
            // Extract data
            const visa = extractVisa(fullText);
            const anzsco = extractANZSCO(fullText);
            const days = extractProcessingDays(fullText);
            
            if (visa !== 'Unknown' && days && days > 10 && days < 1500) {
              const location = /onshore|in australia/i.test(fullText) ? 'onshore' : 
                              /offshore|outside australia|overseas/i.test(fullText) ? 'offshore' : 'onshore';
              
              const entry: ScrapedEntry = {
                visa_subclass: visa,
                anzsco_code: anzsco,
                location,
                processing_days: days,
                had_medicals: /medical|health exam/i.test(fullText),
                had_s56: /s56|section 56|rfi|request for information/i.test(fullText),
                source: 'reddit',
                notes: `Title: ${title.substring(0, 100)}`,
                url,
                verified: false
              };
              
              entries.push(entry);
              process.stdout.write(`\r   ✓ Total: ${entries.length}/${targetCount} | Last: ${visa} | ${anzsco} | ${days}d`);
            }
            
            // Go back
            await page.goBack();
            await page.waitForTimeout(1000);
            
          } catch (e) {
            // Continue to next post
          }
        }
        
      } catch (e) {
        console.log(`   ❌ Error with query "${query}":`, e.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Scraping error:', error);
  } finally {
    if (browser) await browser.close();
  }
  
  console.log('\n');
  return entries;
}

/**
 * Load entries to database
 */
async function loadToDatabase(entries: ScrapedEntry[]): Promise<void> {
  console.log(`\n📥 Loading ${entries.length} entries to database...`);
  
  let success = 0;
  let errors = 0;
  
  for (const entry of entries) {
    try {
      // Generate dates from processing_days
      const granted = new Date();
      const lodged = new Date(granted.getTime() - entry.processing_days * 24 * 60 * 60 * 1000);
      
      const { error } = await supabase
        .from('visa_timelines')
        .insert({
          ...entry,
          date_lodged: lodged.toISOString().split('T')[0],
          date_granted: granted.toISOString().split('T')[0],
          submitted_at: new Date().toISOString()
        });
      
      if (error) {
        errors++;
      } else {
        success++;
      }
      
      if (success % 50 === 0) {
        process.stdout.write(`\r   Progress: ${success}/${entries.length}`);
      }
      
    } catch (e) {
      errors++;
    }
  }
  
  console.log(`\n   ✅ Loaded: ${success}`);
  console.log(`   ❌ Errors: ${errors}`);
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('  REDDIT VISA TIMELINE SCRAPER - 500+ TARGET');
  console.log('='.repeat(60));
  
  // Scrape
  const entries = await scrapeRedditTarget(500);
  
  // Summary
  console.log('\n📊 SCRAPING SUMMARY');
  console.log('='.repeat(40));
  console.log(`Total entries: ${entries.length}`);
  
  // Group by visa
  const byVisa: Record<string, number> = {};
  const byANZSCO: Record<string, number> = {};
  
  entries.forEach(e => {
    byVisa[e.visa_subclass] = (byVisa[e.visa_subclass] || 0) + 1;
    if (e.anzsco_code !== 'N/A') {
      byANZSCO[e.anzsco_code] = (byANZSCO[e.anzsco_code] || 0) + 1;
    }
  });
  
  console.log('\nBy Visa Subclass:');
  Object.entries(byVisa)
    .sort((a, b) => b[1] - a[1])
    .forEach(([visa, count]) => console.log(`  ${visa}: ${count}`));
  
  console.log('\nTop ANZSCO Codes:');
  Object.entries(byANZSCO)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([code, count]) => {
      const occ = anzscoOccupations.find(o => o.code === code);
      console.log(`  ${code}: ${count} (${occ?.title || 'Unknown'})`);
    });
  
  // Load to database
  if (entries.length > 0) {
    await loadToDatabase(entries);
    
    // Refresh stats
    console.log('\n🔄 Refreshing materialized views...');
    await supabase.rpc('refresh_timeline_stats');
  }
  
  console.log('\n🎉 Complete!');
}

// Run
main().catch(console.error);
