#!/usr/bin/env node
/**
 * CHECK RLS POLICIES
 */

const https = require('https');

const CONFIG = {
  supabaseUrl: 'https://zogfvzzizbbmmmnlzxdg.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1ODc5MiwiZXhwIjoyMDg3MDM0NzkyfQ.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw'
};

async function checkRLS() {
  console.log('🔍 Checking RLS policies for visas table...\n');

  // Try with anon key (what the frontend uses)
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw';

  const testAnon = () => {
    return new Promise((resolve) => {
      const options = {
        hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
        port: 443,
        path: '/rest/v1/visas?select=id,name&is_active=eq.true&limit=3',
        method: 'GET',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log('Anon Key Test:');
          console.log(`  Status: ${res.statusCode}`);
          if (res.statusCode === 200) {
            const visas = JSON.parse(data);
            console.log(`  ✅ SUCCESS - Found ${visas.length} visas`);
          } else {
            console.log(`  ❌ FAILED - ${data.substring(0, 200)}`);
          }
          resolve({ status: res.statusCode, data });
        });
      });

      req.on('error', (err) => {
        console.log(`  ❌ ERROR - ${err.message}`);
        resolve({ error: err.message });
      });
      req.end();
    });
  };

  const testService = () => {
    return new Promise((resolve) => {
      const options = {
        hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
        port: 443,
        path: '/rest/v1/visas?select=id,name&is_active=eq.true&limit=3',
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
          console.log('\nService Key Test:');
          console.log(`  Status: ${res.statusCode}`);
          if (res.statusCode === 200) {
            const visas = JSON.parse(data);
            console.log(`  ✅ SUCCESS - Found ${visas.length} visas`);
          } else {
            console.log(`  ❌ FAILED - ${data.substring(0, 200)}`);
          }
          resolve({ status: res.statusCode, data });
        });
      });

      req.on('error', (err) => {
        console.log(`  ❌ ERROR - ${err.message}`);
        resolve({ error: err.message });
      });
      req.end();
    });
  };

  await testAnon();
  await testService();

  console.log('\n📋 Summary:');
  console.log('If anon key fails but service key works, RLS is blocking access.');
  console.log('Solution: Disable RLS on visas table or add anon read policy.');
}

checkRLS();
