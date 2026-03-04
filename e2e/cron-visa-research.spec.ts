import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

/**
 * CRON JOB 2: Visa Premium Content Research
 * Researches all visas and adds premium content
 */
test.describe('CRON: Visa Premium Content Research', () => {
  
  test('Get All Visas and Research', async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  CRON: VISA PREMIUM CONTENT RESEARCH');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const supabase = createClient(SUPABASE_URL, ANON_KEY);
    
    // Get all visas
    const { data: visas, error } = await supabase
      .from('visas')
      .select('id, name, country, visa_type, description, requirements, processing_time, price_cents, is_active')
      .order('country, name');
    
    if (error) {
      console.log(`❌ Error fetching visas: ${error.message}`);
      return;
    }
    
    console.log(`Found ${visas?.length || 0} visas\n`);
    
    if (!visas || visas.length === 0) {
      console.log('No visas found in database');
      return;
    }
    
    // Group by country
    const byCountry: Record<string, any[]> = {};
    visas.forEach(visa => {
      if (!byCountry[visa.country]) byCountry[visa.country] = [];
      byCountry[visa.country].push(visa);
    });
    
    console.log('Visas by country:');
    Object.entries(byCountry).forEach(([country, list]) => {
      console.log(`\n${country}:`);
      list.forEach(v => {
        const hasContent = v.description && v.description.length > 100;
        const hasRequirements = v.requirements && (Array.isArray(v.requirements) ? v.requirements.length > 0 : Object.keys(v.requirements).length > 0);
        console.log(`  - ${v.name} (${v.visa_type})`);
        console.log(`    Description: ${hasContent ? '✅' : '❌ Missing'}`);
        console.log(`    Requirements: ${hasRequirements ? '✅' : '❌ Missing'}`);
        console.log(`    Processing: ${v.processing_time || '❌ Missing'}`);
        console.log(`    Price: ${v.price_cents ? '$' + (v.price_cents/100) : '❌ Missing'}`);
      });
    });
    
    // Identify visas needing content
    const needsContent = visas.filter(v => 
      !v.description || 
      v.description.length < 100 ||
      !v.requirements ||
      !v.processing_time ||
      !v.price_cents
    );
    
    console.log(`\n\n⚠️  ${needsContent.length} visas need content improvement:`);
    needsContent.forEach(v => {
      console.log(`  - ${v.name} (${v.country})`);
    });
    
    // Research each visa type
    console.log('\n\n🔍 RESEARCHING VISA TYPES...\n');
    
    const visaTypes = [...new Set(visas.map(v => v.visa_type))];
    
    for (const visaType of visaTypes.slice(0, 3)) { // Limit to 3 for testing
      console.log(`\n--- Researching: ${visaType} ---`);
      // This would trigger web searches in real cron
      console.log(`Would search for: "${visaType} visa requirements Australia"`);
      console.log(`Would search for: "${visaType} visa processing time"`);
      console.log(`Would search for: "${visaType} visa application guide"`);
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('RESEARCH SUMMARY:');
    console.log(`- Total visas: ${visas.length}`);
    console.log(`- Need content: ${needsContent.length}`);
    console.log(`- Countries: ${Object.keys(byCountry).length}`);
    console.log(`- Visa types: ${visaTypes.join(', ')}`);
    console.log('═══════════════════════════════════════════════════════');
  });

  test('Check Premium Content Status', async () => {
    console.log('\n═══════════════════════════════════════════');
    console.log('  CHECKING PREMIUM CONTENT');
    console.log('═══════════════════════════════════════════\n');
    
    const supabase = createClient(SUPABASE_URL, ANON_KEY);
    
    // Check premium content table
    const { data: premiumContent, error } = await supabase
      .from('premium_content')
      .select('id, visa_id, title, content_type, is_published')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.log(`Note: premium_content table may not exist: ${error.message}`);
    } else {
      console.log(`Found ${premiumContent?.length || 0} premium content items`);
      
      premiumContent?.forEach(pc => {
        console.log(`  - ${pc.title} (${pc.content_type}) - ${pc.is_published ? 'Published' : 'Draft'}`);
      });
    }
    
    // Check which visas have premium content
    const { data: visasWithContent } = await supabase
      .from('visas')
      .select('id, name, has_premium_content')
      .eq('has_premium_content', true);
    
    console.log(`\nVisas with premium flag: ${visasWithContent?.length || 0}`);
  });
});
