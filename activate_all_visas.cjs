#!/usr/bin/env node
/**
 * ACTIVATE ALL VISAS
 * This script activates all inactive visas in the database
 */

const https = require('https');

const CONFIG = {
  supabaseUrl: 'https://zogfvzzizbbmmmnlzxdg.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1ODc5MiwiZXhwIjoyMDg3MDM0NzkyfQ.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw'
};

async function activateAllVisas() {
  console.log('🔧 Activating all visas...\n');

  // Step 1: Get all inactive visas
  const getInactiveVisas = () => {
    return new Promise((resolve) => {
      const options = {
        hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
        port: 443,
        path: '/rest/v1/visas?is_active=eq.false&select=id,name,subclass,is_active',
        method: 'GET',
        headers: {
          'apikey': CONFIG.serviceKey,
          'Authorization': `Bearer ${CONFIG.serviceKey}`
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const visas = JSON.parse(data);
            resolve(visas);
          } catch (e) {
            console.error('Error parsing response:', e);
            resolve([]);
          }
        });
      });

      req.on('error', (err) => {
        console.error('Request error:', err);
        resolve([]);
      });
      req.end();
    });
  };

  // Step 2: Activate all visas
  const activateVisas = (visaIds) => {
    return new Promise((resolve) => {
      if (visaIds.length === 0) {
        resolve({ success: true, count: 0 });
        return;
      }

      // Update all visas to active
      const options = {
        hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
        port: 443,
        path: '/rest/v1/visas?is_active=eq.false',
        method: 'PATCH',
        headers: {
          'apikey': CONFIG.serviceKey,
          'Authorization': `Bearer ${CONFIG.serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, count: visaIds.length });
          } else {
            console.error('Update failed:', res.statusCode, data);
            resolve({ success: false, error: data });
          }
        });
      });

      req.on('error', (err) => {
        console.error('Update error:', err);
        resolve({ success: false, error: err.message });
      });

      req.write(JSON.stringify({ is_active: true }));
      req.end();
    });
  };

  // Get inactive visas
  console.log('📋 Fetching inactive visas...');
  const inactiveVisas = await getInactiveVisas();
  
  if (inactiveVisas.length === 0) {
    console.log('✅ All visas are already active!');
    return;
  }

  console.log(`Found ${inactiveVisas.length} inactive visas:`);
  inactiveVisas.forEach(v => {
    console.log(`  - ${v.name} (${v.subclass})`);
  });

  // Activate them
  console.log('\n🚀 Activating all visas...');
  const result = await activateVisas(inactiveVisas.map(v => v.id));

  if (result.success) {
    console.log(`\n✅ Successfully activated ${result.count} visas!`);
    console.log('\n📊 Summary:');
    console.log(`  - Total visas: ${inactiveVisas.length + 4} (approx)`);
    console.log(`  - Activated: ${result.count}`);
    console.log(`  - All visas should now be visible on the site`);
  } else {
    console.error('\n❌ Failed to activate visas:', result.error);
  }
}

// Run the script
activateAllVisas().catch(console.error);
