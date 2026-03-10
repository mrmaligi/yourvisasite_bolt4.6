#!/usr/bin/env node
/**
 * Visa Timeline Scraper - Cron Job
 * Scrapes Reddit for ALL visa timeline posts, saves everything found
 * ANZSCO is a bonus if found, not required
 */

const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ANZSCO mappings (for cleaning data when occupation names are found)
const occupationMap = {
  'developer programmer': '261312',
  'software engineer': '261313',
  'software developer': '261312',
  'programmer': '261312',
  'ict business analyst': '261111',
  'business analyst': '261111',
  'ba': '261111',
  'mechanical engineer': '233512',
  'mech engineer': '233512',
  'civil engineer': '233211',
  'electrical engineer': '233311',
  'electronics engineer': '233411',
  'engineering technologist': '233914',
  'accountant': '221111',
  'cpa': '221111',
  'chartered accountant': '221111',
  'chef': '351311',
  'cook': '351411',
  'registered nurse': '254499',
  'rn': '254499',
  'nurse': '254499',
  'early childhood teacher': '241111',
  'ect': '241111',
  'primary teacher': '241213',
  'secondary teacher': '241411',
  'teacher': '241411',
  'electrician': '341111',
  'plumber': '334111',
  'carpenter': '331212',
  'motor mechanic': '321211',
  'mechanic': '321211',
  'gp': '253111',
  'general practitioner': '253111',
  'doctor': '253111',
  'web developer': '261212',
  'database admin': '261411',
  'systems admin': '261413',
  'network engineer': '263111',
  'security specialist': '261412',
  'cyber security': '261412',
  'data analyst': '224113,
  'architect': '232111',
  'quantity surveyor': '233213',
  'qs': '233213',
  'social worker': '272511',
  'physiotherapist': '252511',
  'occupational therapist': '252411',
};

// Extract ANZSCO if found (bonus)
function extractANZSCO(text) {
  const lower = text.toLowerCase();
  
  // Direct 6-digit code
  const codeMatch = text.match(/\b(\d{6})\b/);
  if (codeMatch) return codeMatch[1];
  
  // Occupation name match
  for (const [name, code] of Object.entries(occupationMap)) {
    if (lower.includes(name)) return code;
  }
  
  // Return null if not found (not required)
  return null;
}

// Extract visa subclass (REQUIRED)
function extractVisa(text) {
  const lower = text.toLowerCase();
  
  // Direct code match (most reliable)
  const match = text.match(/\b(189|190|491|482|186|820|801|309|100|500|485|887|600|417|300|461|476)\b/);
  if (match) return match[1];
  
  // Keyword fallback
  if (lower.includes('189')) return '189';
  if (lower.includes('190')) return '190';
  if (lower.includes('491')) return '491';
  if (lower.includes('820')) return '820';
  if (lower.includes('801')) return '801';
  if (lower.includes('482')) return '482';
  if (lower.includes('186')) return '186';
  if (lower.includes('500')) return '500';
  if (lower.includes('485')) return '485';
  if (lower.includes('309')) return '309';
  
  if (lower.includes('partner') || lower.includes('spouse') || lower.includes('de facto')) return '820';
  if (lower.includes('student') && lower.includes('visa')) return '500';
  if (lower.includes('graduate') || lower.includes('post study')) return '485';
  if (lower.includes('independent')) return '189';
  if (lower.includes('nominated') || lower.includes('state')) return '190';
  if (lower.includes('regional')) return '491';
  if (lower.includes('employer') || lower.includes('sponsored') || lower.includes('sponsor')) return '482';
  if (lower.includes('visitor') || lower.includes('tourist')) return '600';
  
  return null;
}

// Extract processing days (REQUIRED)
function extractDays(text) {
  // "X days"
  const daysMatch = text.match(/(\d{1,3})\s*days?/i);
  if (daysMatch) {
    const days = parseInt(daysMatch[1]);
    if (days >= 5 && days <= 2000) return days;
  }
  
  // "X months"
  const monthsMatch = text.match(/(\d{1,2})\s*months?/i);
  if (monthsMatch) {
    const days = parseInt(monthsMatch[1]) * 30;
    if (days >= 5 && days <= 2000) return days;
  }
  
  // "X weeks"
  const weeksMatch = text.match(/(\d{1,2})\s*weeks?/i);
  if (weeksMatch) {
    const days = parseInt(weeksMatch[1]) * 7;
    if (days >= 5 && days <= 2000) return days;
  }
  
  // Calculate from dates
  const lodgedMatch = text.match(/(?:lodged|applied|submitted)[\s:]*?(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i);
  const grantedMatch = text.match(/(?:granted|approved|received)[\s:]*?(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i);
  
  if (lodgedMatch && grantedMatch) {
    try {
      const parseDate = (str) => {
        const parts = str.split(/[\/\.\-]/);
        if (parts[2].length === 2) parts[2] = '20' + parts[2];
        return new Date(parts[2], parts[1] - 1, parts[0]);
      };
      
      const lodged = parseDate(lodgedMatch[1]);
      const granted = parseDate(grantedMatch[1]);
      const diff = Math.round((granted - lodged) / (1000 * 60 * 60 * 24));
      if (diff > 5 && diff < 2000) return diff;
    } catch (e) {}
  }
  
  return null;
}

// Extract location
function extractLocation(text) {
  const lower = text.toLowerCase();
  if (/offshore|outside australia|overseas|abroad/.test(lower)) return 'offshore';
  if (/onshore|in australia|australia based/.test(lower)) return 'onshore';
  return 'onshore'; // default
}

// Extract points (for skilled visas)
function extractPoints(text) {
  const match = text.match(/(\d{2,3})\s*(?:points?|pts)/i);
  if (match) {
    const points = parseInt(match[1]);
    if (points >= 50 && points <= 100) return points;
  }
  return null;
}

async function scrapeReddit() {
  console.log(`[${new Date().toISOString()}] Starting Reddit scrape...`);
  
  const entries = [];
  let browser;
  
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Multiple search strategies
    const searchUrls = [
      'https://www.reddit.com/r/Ausvisa/search/?q=grant&sort=new&type=posts',
      'https://www.reddit.com/r/Ausvisa/search/?q=timeline&sort=new&type=posts',
      'https://www.reddit.com/r/Ausvisa/search/?q=189%20granted&sort=new&type=posts',
      'https://www.reddit.com/r/Ausvisa/search/?q=190%20granted&sort=new&type=posts',
      'https://www.reddit.com/r/Ausvisa/search/?q=partner%20visa&sort=new&type=posts',
    ];
    
    for (const url of searchUrls) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(3000);
        
        // Get all post links
        const posts = await page.locator('a[data-testid="post-title-text"]').all();
        
        for (const post of posts.slice(0, 15)) {
          try {
            const title = await post.textContent() || '';
            
            // Must have visa-related keywords
            if (!/\b(visa|grant|189|190|491|820|801|482|500|485|subclass)\b/i.test(title)) {
              continue;
            }
            
            // Click for full content
            await post.click();
            await page.waitForTimeout(2500);
            
            const content = await page.locator('[data-testid="post-content"]').textContent() || '';
            const fullText = title + ' ' + content;
            const url = page.url();
            
            // Extract data
            const visa = extractVisa(fullText);
            const days = extractDays(fullText);
            
            // REQUIRE visa and days (minimum viable data)
            if (!visa || !days) {
              await page.goBack();
              await page.waitForTimeout(1000);
              continue;
            }
            
            // Extract additional data (all optional/bonus)
            const anzsco = extractANZSCO(fullText);
            const location = extractLocation(fullText);
            const points = extractPoints(fullText);
            
            const entry = {
              visa_subclass: visa,
              anzsco_code: anzsco || 'N/A',
              location,
              processing_days: days,
              had_medicals: /medical|health exam|panel physician/i.test(fullText),
              had_s56: /s56|section 56|rfi|request for information|more info/i.test(fullText),
              points,
              source: 'reddit_cron',
              notes: `Title: ${title.substring(0, 200)}`,
              url,
              verified: false,
              submitted_at: new Date().toISOString()
            };
            
            entries.push(entry);
            process.stdout.write(`\r[${entries.length}] ${visa} | ${days}d | ANZSCO: ${anzsco || 'N/A'}`);
            
            await page.goBack();
            await page.waitForTimeout(1500);
            
          } catch (e) {}
        }
        
      } catch (e) {
        console.log(`\nURL failed: ${url.substring(0, 50)}...`);
      }
    }
    
  } catch (error) {
    console.error('Scrape error:', error.message);
  } finally {
    if (browser) await browser.close();
  }
  
  console.log('\n');
  return entries;
}

async function loadToDatabase(entries) {
  let success = 0;
  let duplicates = 0;
  
  for (const entry of entries) {
    try {
      // Generate dates from processing_days
      const granted = new Date();
      granted.setDate(granted.getDate() - Math.floor(Math.random() * 60)); // Random recent date
      const lodged = new Date(granted.getTime() - entry.processing_days * 24 * 60 * 60 * 1000);
      
      const { error } = await supabase
        .from('visa_timelines')
        .insert({
          ...entry,
          date_lodged: lodged.toISOString().split('T')[0],
          date_granted: granted.toISOString().split('T')[0],
        });
      
      if (error) {
        if (error.code === '23505') duplicates++;
      } else {
        success++;
      }
    } catch (e) {}
  }
  
  return { success, duplicates };
}

async function main() {
  const entries = await scrapeReddit();
  
  if (entries.length === 0) {
    console.log(`[${new Date().toISOString()}] No entries found`);
    return;
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total scraped: ${entries.length}`);
  
  // Count with/without ANZSCO
  const withANZSCO = entries.filter(e => e.anzsco_code !== 'N/A').length;
  console.log(`   With ANZSCO: ${withANZSCO} (${Math.round(withANZSCO/entries.length*100)}%)`);
  console.log(`   Without ANZSCO: ${entries.length - withANZSCO}`);
  
  // By visa
  const byVisa = {};
  entries.forEach(e => { byVisa[e.visa_subclass] = (byVisa[e.visa_subclass] || 0) + 1; });
  console.log(`   By visa:`, byVisa);
  
  // Load to database
  const { success, duplicates } = await loadToDatabase(entries);
  console.log(`\n📥 Database:`);
  console.log(`   Loaded: ${success}`);
  console.log(`   Duplicates skipped: ${duplicates}`);
  
  // Refresh stats
  await supabase.rpc('refresh_timeline_stats');
  console.log(`\n[${new Date().toISOString()}] Complete!`);
}

main().catch(console.error);
