/**
 * ANZSCO Database Loader
 * Loads all ANZSCO occupations into Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { anzscoOccupations } from '../src/data/anzsco-codes.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function loadANZSCOData() {
  console.log('🔄 Loading ANZSCO data into database...');
  console.log(`📊 Total occupations to load: ${anzscoOccupations.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  // Process in batches of 50
  const batchSize = 50;
  
  for (let i = 0; i < anzscoOccupations.length; i += batchSize) {
    const batch = anzscoOccupations.slice(i, i + batchSize);
    
    const records = batch.map(occ => ({
      code: occ.code,
      title: occ.title,
      skill_level: occ.skillLevel,
      major_group: occ.majorGroup,
      minor_group: occ.minorGroup,
      unit_group: occ.unitGroup,
      assessing_authority: occ.assessingAuthority || null,
      mltssl: occ.mltssl || false,
      stsol: occ.stsol || false,
      regional: occ.regional || false,
      pmsol: occ.pmsol || false,
    }));
    
    const { error } = await supabase
      .from('anzsco_occupations')
      .upsert(records, { onConflict: 'code' });
    
    if (error) {
      console.error(`❌ Error loading batch ${i / batchSize + 1}:`, error.message);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      process.stdout.write(`✓ Loaded ${successCount}/${anzscoOccupations.length}\r`);
    }
  }
  
  console.log('\n');
  console.log('✅ ANZSCO Data Load Complete!');
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  
  // Show stats
  const { data: stats } = await supabase
    .from('anzsco_occupations')
    .select('major_group, skill_level, mltssl, stsol, pmsol');
    
  if (stats) {
    console.log('\n📈 Database Statistics:');
    console.log(`   Total records: ${stats.length}`);
    console.log(`   MLTSSL occupations: ${stats.filter(s => s.mltssl).length}`);
    console.log(`   STSOL occupations: ${stats.filter(s => s.stsol).length}`);
    console.log(`   PMSOL occupations: ${stats.filter(s => s.pmsol).length}`);
  }
}

// State demand data (approximate for demonstration)
const stateDemandData = [
  // NSW
  { code: '261312', state: 'NSW', demand_level: 'high', avg_salary_min: 95000, avg_salary_max: 150000 },
  { code: '233512', state: 'NSW', demand_level: 'high', avg_salary_min: 90000, avg_salary_max: 140000 },
  { code: '253111', state: 'NSW', demand_level: 'high', avg_salary_min: 180000, avg_salary_max: 350000 },
  { code: '254499', state: 'NSW', demand_level: 'high', avg_salary_min: 75000, avg_salary_max: 110000 },
  { code: '241111', state: 'NSW', demand_level: 'high', avg_salary_min: 70000, avg_salary_max: 95000 },
  // VIC
  { code: '261312', state: 'VIC', demand_level: 'high', avg_salary_min: 92000, avg_salary_max: 145000 },
  { code: '233512', state: 'VIC', demand_level: 'medium', avg_salary_min: 85000, avg_salary_max: 130000 },
  { code: '253111', state: 'VIC', demand_level: 'high', avg_salary_min: 175000, avg_salary_max: 340000 },
  { code: '351311', state: 'VIC', demand_level: 'high', avg_salary_min: 65000, avg_salary_max: 85000 },
  // QLD
  { code: '261312', state: 'QLD', demand_level: 'medium', avg_salary_min: 88000, avg_salary_max: 135000 },
  { code: '233512', state: 'QLD', demand_level: 'high', avg_salary_min: 90000, avg_salary_max: 140000 },
  { code: '341111', state: 'QLD', demand_level: 'high', avg_salary_min: 75000, avg_salary_max: 95000 },
  // WA
  { code: '233512', state: 'WA', demand_level: 'high', avg_salary_min: 95000, avg_salary_max: 150000 },
  { code: '233611', state: 'WA', demand_level: 'high', avg_salary_min: 110000, avg_salary_max: 180000 },
  { code: '321211', state: 'WA', demand_level: 'high', avg_salary_min: 70000, avg_salary_max: 90000 },
  // SA
  { code: '261312', state: 'SA', demand_level: 'medium', avg_salary_min: 82000, avg_salary_max: 125000 },
  { code: '254499', state: 'SA', demand_level: 'high', avg_salary_min: 72000, avg_salary_max: 105000 },
  // TAS
  { code: '241111', state: 'TAS', demand_level: 'high', avg_salary_min: 68000, avg_salary_max: 90000 },
  { code: '254499', state: 'TAS', demand_level: 'high', avg_salary_min: 70000, avg_salary_max: 95000 },
  // ACT
  { code: '261312', state: 'ACT', demand_level: 'high', avg_salary_min: 95000, avg_salary_max: 145000 },
  { code: '221111', state: 'ACT', demand_level: 'medium', avg_salary_min: 70000, avg_salary_max: 100000 },
  // NT
  { code: '254499', state: 'NT', demand_level: 'high', avg_salary_min: 85000, avg_salary_max: 120000 },
  { code: '241111', state: 'NT', demand_level: 'high', avg_salary_min: 75000, avg_salary_max: 98000 },
];

async function loadStateDemandData() {
  console.log('\n🔄 Loading state demand data...');
  
  const { error } = await supabase
    .from('anzsco_state_demand')
    .upsert(stateDemandData, { onConflict: 'anzsco_code,state' });
  
  if (error) {
    console.error('❌ Error loading state demand:', error.message);
  } else {
    console.log(`✅ Loaded ${stateDemandData.length} state demand records`);
  }
}

async function main() {
  console.log('🏁 Starting ANZSCO Database Loader\n');
  
  await loadANZSCOData();
  await loadStateDemandData();
  
  console.log('\n🎉 All data loaded successfully!');
}

main().catch(console.error);
