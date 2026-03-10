/**
 * Integrate scraped visa data with tracker
 * This loads scraped data into the visa_timelines table
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample scraped data (in production, this comes from scraper)
const scrapedData = [
  {
    visa_subclass: '189',
    anzsco_code: '261312',
    location: 'offshore',
    date_lodged: '2023-06-15',
    date_granted: '2024-01-20',
    processing_days: 219,
    had_medicals: true,
    had_s56: false,
    source: 'reddit',
    notes: 'Developer Programmer, offshore, no s56',
    verified: true
  },
  {
    visa_subclass: '189',
    anzsco_code: '261312',
    location: 'offshore',
    date_lodged: '2023-07-10',
    date_granted: '2024-02-05',
    processing_days: 210,
    had_medicals: true,
    had_s56: true,
    source: 'reddit',
    notes: 'Developer Programmer, offshore, had s56',
    verified: true
  },
  {
    visa_subclass: '189',
    anzsco_code: '261312',
    location: 'onshore',
    date_lodged: '2023-08-01',
    date_granted: '2024-02-15',
    processing_days: 198,
    had_medicals: false,
    had_s56: false,
    source: 'reddit',
    notes: 'Developer Programmer, onshore',
    verified: true
  },
  {
    visa_subclass: '190',
    anzsco_code: '233512',
    location: 'onshore',
    date_lodged: '2023-05-20',
    date_granted: '2023-12-10',
    processing_days: 204,
    had_medicals: true,
    had_s56: false,
    source: 'facebook',
    notes: 'Mechanical Engineer, VIC nomination',
    verified: true
  },
  {
    visa_subclass: '190',
    anzsco_code: '233512',
    location: 'offshore',
    date_lodged: '2023-09-01',
    date_granted: '2024-03-15',
    processing_days: 196,
    had_medicals: true,
    had_s56: true,
    source: 'reddit',
    notes: 'Mechanical Engineer, offshore',
    verified: true
  },
  {
    visa_subclass: '820',
    anzsco_code: 'N/A',
    location: 'onshore',
    date_lodged: '2022-12-01',
    date_granted: '2024-01-10',
    processing_days: 406,
    had_medicals: true,
    had_s56: false,
    source: 'facebook',
    notes: 'Partner visa, complex case',
    verified: true
  },
  {
    visa_subclass: '820',
    anzsco_code: 'N/A',
    location: 'onshore',
    date_lodged: '2023-03-15',
    date_granted: '2024-02-28',
    processing_days: 350,
    had_medicals: true,
    had_s56: true,
    source: 'reddit',
    notes: 'Partner visa, s56 request',
    verified: true
  },
  {
    visa_subclass: '189',
    anzsco_code: '261313',
    location: 'offshore',
    date_lodged: '2023-10-01',
    date_granted: '2024-04-01',
    processing_days: 183,
    had_medicals: false,
    had_s56: false,
    source: 'reddit',
    notes: 'Software Engineer, 95 points',
    verified: true
  },
  {
    visa_subclass: '189',
    anzsco_code: '261111',
    location: 'onshore',
    date_lodged: '2023-11-15',
    date_granted: '2024-05-01',
    processing_days: 168,
    had_medicals: true,
    had_s56: false,
    source: 'reddit',
    notes: 'ICT Business Analyst, 90 points',
    verified: true
  },
  {
    visa_subclass: '491',
    anzsco_code: '233211',
    location: 'offshore',
    date_lodged: '2023-04-10',
    date_granted: '2024-01-15',
    processing_days: 280,
    had_medicals: true,
    had_s56: false,
    source: 'facebook',
    notes: 'Civil Engineer, QLD regional',
    verified: true
  },
  {
    visa_subclass: '482',
    anzsco_code: '351311',
    location: 'offshore',
    date_lodged: '2023-08-20',
    date_granted: '2023-10-05',
    processing_days: 46,
    had_medicals: true,
    had_s56: false,
    source: 'reddit',
    notes: 'Chef, sponsored',
    verified: true
  },
  {
    visa_subclass: '186',
    anzsco_code: '253111',
    location: 'onshore',
    date_lodged: '2023-02-01',
    date_granted: '2024-02-20',
    processing_days: 385,
    had_medicals: true,
    had_s56: true,
    source: 'facebook',
    notes: 'GP, employer nomination',
    verified: true
  },
  {
    visa_subclass: '500',
    anzsco_code: 'N/A',
    location: 'offshore',
    date_lodged: '2024-01-05',
    date_granted: '2024-02-01',
    processing_days: 27,
    had_medicals: true,
    had_s56: false,
    source: 'reddit',
    notes: 'Student visa, Indian passport',
    verified: true
  },
  {
    visa_subclass: '485',
    anzsco_code: '261312',
    location: 'onshore',
    date_lodged: '2023-12-01',
    date_granted: '2024-01-10',
    processing_days: 40,
    had_medicals: false,
    had_s56: false,
    source: 'reddit',
    notes: 'Post study work, Masters graduate',
    verified: true
  },
  {
    visa_subclass: '189',
    anzsco_code: '221111',
    location: 'offshore',
    date_lodged: '2023-03-01',
    date_granted: '2023-11-20',
    processing_days: 264,
    had_medicals: true,
    had_s56: true,
    source: 'facebook',
    notes: 'Accountant, 85 points',
    verified: true
  }
];

async function loadScrapedData() {
  console.log('🔄 Loading scraped visa timeline data...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const entry of scrapedData) {
    try {
      const { error } = await supabase
        .from('visa_timelines')
        .upsert(entry, { 
          onConflict: undefined, // Always insert new
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.log(`❌ Error: ${error.message}`);
        errorCount++;
      } else {
        successCount++;
        process.stdout.write(`✓ Loaded ${successCount}/${scrapedData.length}\r`);
      }
    } catch (e) {
      console.log(`❌ Error: ${e}`);
      errorCount++;
    }
  }
  
  console.log('\n');
  console.log('='.repeat(50));
  console.log(`✅ Loaded: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('='.repeat(50));
  
  // Refresh stats
  console.log('\n🔄 Refreshing statistics...');
  await supabase.rpc('refresh_timeline_stats');
  
  // Show summary
  const { data: stats } = await supabase
    .from('timeline_stats')
    .select('*')
    .limit(10);
  
  if (stats) {
    console.log('\n📊 Updated Statistics:');
    for (const row of stats) {
      console.log(`\n   ${row.visa_subclass} | ${row.anzsco_code} | ${row.location}`);
      console.log(`      Entries: ${row.total_entries}`);
      console.log(`      Avg: ${Math.round(row.avg_days)} days`);
      console.log(`      Median: ${Math.round(row.median_days)} days`);
    }
  }
}

loadScrapedData().catch(console.error);
