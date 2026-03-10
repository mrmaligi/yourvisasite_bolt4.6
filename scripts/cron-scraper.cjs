#!/usr/bin/env node
/**
 * Visa Timeline Data Scraper - Cron Job
 * Run daily to scrape Reddit for new timeline entries
 */

const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ANZSCO occupation mappings
const occupationMap = {
  'developer programmer': '261312',
  'software engineer': '261313',
  'software developer': '261312',
  'ict business analyst': '261111',
  'business analyst': '261111',
  'mechanical engineer': '233512',
  'civil engineer': '233211',
  'electrical engineer': '233311',
  'electronics engineer': '233411',
  'engineering technologist': '233914',
  'accountant': '221111',
  'cpa': '221111',
  'chef': '351311',
  'cook': '351411',
  'registered nurse': '254499',
  'nurse': '254499',
  'early childhood teacher': '241111',
  'primary teacher': '241213',
  'secondary teacher': '241411',
  'electrician': '341111',
  'plumber': '334111',
  'carpenter': '331212',
  'motor mechanic': '321211',
  'gp': '253111',
  'general practitioner': '253111',
  'web developer': '261212',
  'database admin': '261411',
  'systems admin': '261413',
  'network engineer': '263111',
  'security specialist': '261412',
};

function extractANZSCO(text) {
  const lower = text.toLowerCase();
  
  // Direct code match
  const codeMatch = text.match(/\b(\d{6})\b/);
  if (codeMatch) return codeMatch[1];
  
  // Occupation name match
  for (const [name, code] of Object.entries(occupationMap)) {
    if (lower.includes(name)) return code;
  }
  
  return 'N/A';
}

function extractVisa(text) {
  const lower = text.toLowerCase();
  const match = text.match(/\b(189|190|491|482|186|820|801|309|500|485|887|600|417)\b/);
  if (match) return match[1];
  
  if (lower.includes('partner') || lower.includes('spouse') || lower.includes('820')) return '820';
  if (lower.includes('student') || lower.includes('500')) return '500';
  if (lower.includes('graduate') || lower.includes('485')) return '485';
  if (lower.includes('independent') || lower.includes('189')) return '189';
  if (lower.includes('nominated') || lower.includes('190')) return '190';
  if (lower.includes('regional') || lower.includes('491')) return '491';
  if (lower.includes('employer') || lower.includes('sponsor') || lower.includes('482')) return '482';
  
  return 'Unknown';
}

function extractDays(text) {
  const daysMatch = text.match(/(\d{1,3})\s*days?/i);
  if (daysMatch) return parseInt(daysMatch[1]);
  
  const monthsMatch = text.match(/(\d{1,2})\s*months?/i);
  if (monthsMatch) return parseInt(monthsMatch[1]) * 30;
  
  return null;
}

async function scrapeReddit() {
  console.log(`[${new Date().toISOString()}] Starting Reddit scrape...`);
  
  const entries = [];
  let browser;
  
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Try multiple search queries
    const queries = ['grant timeline', '189 grant', '190 grant', 'partner visa grant'];
    
    for (const query of queries) {
      try {
        await page.goto(`https://www.reddit.com/r/Ausvisa/search/?q=${encodeURIComponent(query)}&type=posts&sort=new`, {
          waitUntil: 'domcontentloaded',
          timeout: 20000
        });
        
        await page.waitForTimeout(3000);
        
        // Get posts
        const posts = await page.locator('a[data-testid="post-title-text"]').all();
        
        for (const post of posts.slice(0, 10)) {
          try {
            const title = await post.textContent() || '';
            
            if (!/grant|timeline|processed/i.test(title)) continue;
            
            // Click for content
            await post.click();
            await page.waitForTimeout(2000);
            
            const content = await page.locator('[data-testid="post-content"]').textContent() || '';
            const fullText = title + ' ' + content;
            
            const visa = extractVisa(fullText);
            const anzsco = extractANZSCO(fullText);
            const days = extractDays(fullText);
            
            if (visa !== 'Unknown' && days && days > 10 && days < 1500) {
              entries.push({
                visa_subclass: visa,
                anzsco_code: anzsco,
                location: /offshore/i.test(fullText) ? 'offshore' : 'onshore',
                processing_days: days,
                had_medicals: /medical/i.test(fullText),
                had_s56: /s56|rfi/i.test(fullText),
                source: 'reddit_cron',
                notes: title.substring(0, 150),
                url: page.url(),
                verified: false
              });
            }
            
            await page.goBack();
            await page.waitForTimeout(1000);
            
          } catch (e) {}
        }
        
      } catch (e) {
        console.log(`Query "${query}" failed:`, e.message);
      }
    }
    
  } catch (error) {
    console.error('Scrape error:', error.message);
  } finally {
    if (browser) await browser.close();
  }
  
  return entries;
}

async function loadToDatabase(entries) {
  let success = 0;
  
  for (const entry of entries) {
    try {
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
      
      if (!error) success++;
    } catch (e) {}
  }
  
  return success;
}

async function main() {
  const entries = await scrapeReddit();
  
  if (entries.length > 0) {
    const loaded = await loadToDatabase(entries);
    console.log(`[${new Date().toISOString()}] Scraped ${entries.length}, loaded ${loaded}`);
    
    // Refresh stats
    await supabase.rpc('refresh_timeline_stats');
  } else {
    console.log(`[${new Date().toISOString()}] No new entries found`);
  }
}

main().catch(console.error);
