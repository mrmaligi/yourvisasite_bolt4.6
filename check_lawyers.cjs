#!/usr/bin/env node
/**
 * CHECK AND FIX LAWYERS
 */

const https = require('https');

const CONFIG = {
  supabaseUrl: 'https://zogfvzzizbbmmmnlzxdg.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1ODc5MiwiZXhwIjoyMDg3MDM0NzkyfQ.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw'
};

async function checkLawyers() {
  console.log('🔍 Checking lawyers...\n');

  return new Promise((resolve) => {
    const options = {
      hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
      port: 443,
      path: '/rest/v1/lawyers?select=id,name,email,status,is_active',
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
          const lawyers = JSON.parse(data);
          console.log(`✅ Found ${lawyers.length} lawyers:\n`);
          
          const active = lawyers.filter(l => l.status === 'active' || l.is_active);
          const pending = lawyers.filter(l => l.status === 'pending');
          const inactive = lawyers.filter(l => !l.status && !l.is_active);
          
          console.log(`  Active: ${active.length}`);
          console.log(`  Pending: ${pending.length}`);
          console.log(`  Inactive: ${inactive.length}`);
          
          if (active.length > 0) {
            console.log('\n  Active Lawyers:');
            active.slice(0, 5).forEach(l => {
              console.log(`    - ${l.name || l.email}`);
            });
          }
          
          resolve({ success: true, lawyers, active: active.length });
        } catch (e) {
          console.error('Error:', e.message);
          resolve({ success: false, error: e.message });
        }
      });
    });

    req.on('error', (err) => {
      console.error('Request error:', err);
      resolve({ success: false, error: err.message });
    });
    req.end();
  });
}

checkLawyers();
