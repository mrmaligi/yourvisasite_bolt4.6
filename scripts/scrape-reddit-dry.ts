import { chromium, Browser } from 'playwright';

interface ScrapedEntry {
  visa_subclass: string;
  anzsco_code: string;
  location: 'onshore' | 'offshore';
  processing_days: number;
  had_medicals: boolean;
  had_s56: boolean;
  notes: string;
  url: string;
}

// ANZSCO occupation mappings
const occupationMappings: Record<string, string> = {
  'engineering technologist': '233914',
  'developer': '261312',
  'software developer': '261312',
  'programmer': '261312',
  'software engineer': '261313',
  'business analyst': '261111',
  'mechanical engineer': '233512',
  'civil engineer': '233211',
  'electrical engineer': '233311',
  'electronics engineer': '233411',
  'accountant': '221111',
  'cpa': '221111',
  'chartered accountant': '221111',
  'management accountant': '221112',
  'tax accountant': '221113',
  'chef': '351311',
  'cook': '351411',
  'registered nurse': '254499',
  'nurse': '254499',
  'early childhood teacher': '241111',
  'primary teacher': '241213',
  'secondary teacher': '241411',
  'teacher': '241411',
  'electrician': '341111',
  'plumber': '334111',
  'carpenter': '331212',
  'motor mechanic': '321211',
  'mechanic': '321211',
  'general practitioner': '253111',
  'gp': '253111',
  'web developer': '261212',
  'network engineer': '263111',
  'systems administrator': '261413',
  'database administrator': '261411',
  'ict security specialist': '261412',
  'software tester': '261314',
  'qa engineer': '261314',
  'analyst programmer': '261311',
  'ict business analyst': '261111',
  'quantity surveyor': '233213',
  'construction project manager': '133111',
  'social worker': '272511',
  'psychologist': '272311',
  'physiotherapist': '252511',
  'occupational therapist': '252411',
  'radiographer': '251211',
  'medical imaging': '251211',
  'pharmacist': '251513',
  'dentist': '252312',
  'architect': '232111',
  'landscape architect': '232112',
  'interior designer': '232511',
  'graphic designer': '232411',
  'marketing specialist': '225113',
  'public relations': '225311',
  'hr manager': '132311',
  'human resource': '132311',
  'financial manager': '132211',
  'management consultant': '224711',
  'auditor': '221213',
  'external auditor': '221213',
  'internal auditor': '221214',
  'company secretary': '221211',
  'corporate treasurer': '221212',
  'airconditioning mechanic': '342111',
  'refrigeration mechanic': '342111',
  'bricklayer': '331111',
  'stonemason': '331112',
  'painter': '332211',
  'wall tiler': '333411',
  'floor tiler': '333411',
  'roof tiler': '333311',
  'solid plasterer': '333212',
  'fibrous plasterer': '333211',
  'glazier': '333111',
  'roof plumber': '334115',
  'lift mechanic': '341113',
  'cabinetmaker': '394111',
  'pastrycook': '351112',
  'butcher': '351211',
  'hairdresser': '391111',
  'barber': '391111',
};

function extractANZSCO(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Look for direct 6-digit code
  const codeMatch = text.match(/\b(\d{6})\b/);
  if (codeMatch) return codeMatch[1];
  
  // Look for occupation names
  for (const [name, code] of Object.entries(occupationMappings)) {
    if (lowerText.includes(name)) return code;
  }
  
  return 'N/A';
}

function extractVisa(text: string): string {
  const lower = text.toLowerCase();
  
  const visaMatch = text.match(/\b(189|190|491|482|186|820|801|309|100|500|485|887|300|461|476|417|600)\b/);
  if (visaMatch) return visaMatch[1];
  
  if (/partner|spouse|de facto|820|801/.test(lower)) return '820';
  if (/student|study|500/.test(lower)) return '500';
  if (/graduate|485|post study/.test(lower)) return '485';
  if (/independent|189/.test(lower)) return '189';
  if (/nominated|state|190/.test(lower)) return '190';
  if (/regional|491/.test(lower)) return '491';
  if (/employer|sponsor|482/.test(lower)) return '482';
  if (/visitor|tourist|600/.test(lower)) return '600';
  
  return 'Unknown';
}

function extractProcessingDays(text: string): number | null {
  const daysMatch = text.match(/(\d{1,3})\s*days?/i);
  if (daysMatch) return parseInt(daysMatch[1]);
  
  const monthsMatch = text.match(/(\d{1,2})\s*months?/i);
  if (monthsMatch) return parseInt(monthsMatch[1]) * 30;
  
  const weeksMatch = text.match(/(\d{1,2})\s*weeks?/i);
  if (weeksMatch) return parseInt(weeksMatch[1]) * 7;
  
  return null;
}

async function scrapeReddit(targetCount: number = 500): Promise<ScrapedEntry[]> {
  const entries: ScrapedEntry[] = [];
  let browser: Browser | null = null;
  
  console.log(`🎯 Target: ${targetCount} entries\n`);
  
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    const page = await context.newPage();
    
    const searchQueries = [
      'grant timeline', '189 grant', '190 grant', '491 grant',
      'visa granted', 'partner visa grant', 'processing time',
      'visa timeline', 'immigration grant', 'subclass grant',
      '820 grant', '801 grant', '482 grant', '186 grant',
      '500 student grant', '485 graduate grant'
    ];
    
    for (const query of searchQueries) {
      if (entries.length >= targetCount) break;
      
      console.log(`🔍 "${query}" (${entries.length}/${targetCount})`);
      
      try {
        await page.goto(`https://www.reddit.com/r/Ausvisa/search/?q=${encodeURIComponent(query)}&type=posts&sort=new`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });
        
        await page.waitForTimeout(2500);
        
        const posts = await page.locator('[data-testid="post-container"]').all();
        
        for (const post of posts.slice(0, 20)) {
          if (entries.length >= targetCount) break;
          
          try {
            const title = await post.locator('h3').first().textContent() || '';
            
            if (!/grant|timeline|processed|approved/i.test(title)) continue;
            
            await post.click();
            await page.waitForTimeout(1500);
            
            const content = await page.locator('[data-testid="post-content"]').first().textContent() || '';
            const url = page.url();
            const fullText = title + ' ' + content;
            
            const visa = extractVisa(fullText);
            const anzsco = extractANZSCO(fullText);
            const days = extractProcessingDays(fullText);
            
            if (visa !== 'Unknown' && days && days > 5 && days < 1500) {
              entries.push({
                visa_subclass: visa,
                anzsco_code: anzsco,
                location: /onshore|in australia/i.test(fullText) ? 'onshore' : 
                         /offshore|outside/i.test(fullText) ? 'offshore' : 'onshore',
                processing_days: days,
                had_medicals: /medical|health exam/i.test(fullText),
                had_s56: /s56|section 56|rfi/i.test(fullText),
                notes: title.substring(0, 100),
                url
              });
              
              process.stdout.write(`\r   ✓ ${entries.length} | ${visa} | ${anzsco} | ${days}d`);
            }
            
            await page.goBack();
            await page.waitForTimeout(800);
          } catch {}
        }
      } catch {}
      
      console.log('');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (browser) await browser.close();
  }
  
  return entries;
}

async function main() {
  console.log('='.repeat(60));
  console.log('  REDDIT VISA SCRAPER - 500+ TARGET');
  console.log('='.repeat(60) + '\n');
  
  const entries = await scrapeReddit(500);
  
  console.log('\n' + '='.repeat(60));
  console.log(`  SCRAPED: ${entries.length} ENTRIES`);
  console.log('='.repeat(60));
  
  // Stats
  const byVisa: Record<string, number> = {};
  const byANZSCO: Record<string, number> = {};
  
  entries.forEach(e => {
    byVisa[e.visa_subclass] = (byVisa[e.visa_subclass] || 0) + 1;
    if (e.anzsco_code !== 'N/A') byANZSCO[e.anzsco_code] = (byANZSCO[e.anzsco_code] || 0) + 1;
  });
  
  console.log('\n📊 By Visa:');
  Object.entries(byVisa).sort((a,b) => b[1]-a[1]).forEach(([v,c]) => console.log(`  ${v}: ${c}`));
  
  console.log('\n📊 Top ANZSCO:');
  Object.entries(byANZSCO).sort((a,b) => b[1]-a[1]).slice(0,15).forEach(([c,n]) => console.log(`  ${c}: ${n}`));
  
  // Save to JSON
  const fs = await import('fs');
  fs.writeFileSync('scraped_entries.json', JSON.stringify(entries, null, 2));
  console.log('\n💾 Saved to scraped_entries.json');
}

main();
