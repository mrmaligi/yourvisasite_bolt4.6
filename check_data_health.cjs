#!/usr/bin/env node
/**
 * COMPLETE DATA HEALTH CHECK
 */

const https = require('https');

const CONFIG = {
  supabaseUrl: 'https://zogfvzzizbbmmmnlzxdg.supabase.co',
  serviceKey: process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eWRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1ODc5MiwiZXhwIjoyMDg3MDM0NzkyfQ.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw'
};

function makeRequest(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
      port: 443,
      path: path,
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
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: data.substring(0, 200) });
        }
      });
    });

    req.on('error', (err) => resolve({ error: err.message }));
    req.end();
  });
}

async function checkAllData() {
  console.log('🔍 COMPLETE DATA HEALTH CHECK\n');
  console.log('=' .repeat(50));

  // 1. Check Visas
  console.log('\n📋 VISAS:');
  const visas = await makeRequest('/rest/v1/visas?select=*');
  if (visas.data && Array.isArray(visas.data)) {
    const active = visas.data.filter(v => v.is_active);
    const inactive = visas.data.filter(v => !v.is_active);
    console.log(`  Total: ${visas.data.length}`);
    console.log(`  Active: ${active.length} ✅`);
    console.log(`  Inactive: ${inactive.length}`);
    console.log(`  Sample: ${active.slice(0, 3).map(v => v.name).join(', ')}`);
  } else {
    console.log('  ❌ ERROR:', visas.data);
  }

  // 2. Check Profiles (Lawyers)
  console.log('\n⚖️  LAWYERS (Profiles):');
  const profiles = await makeRequest('/rest/v1/profiles?select=id,email,role');
  if (profiles.data && Array.isArray(profiles.data)) {
    const lawyers = profiles.data.filter(p => p.role === 'lawyer');
    const users = profiles.data.filter(p => p.role === 'user');
    const admins = profiles.data.filter(p => p.role === 'admin');
    console.log(`  Total Profiles: ${profiles.data.length}`);
    console.log(`  Lawyers: ${lawyers.length} ✅`);
    console.log(`  Users: ${users.length}`);
    console.log(`  Admins: ${admins.length}`);
  } else {
    console.log('  ❌ ERROR:', profiles.data);
  }

  // 3. Check Consultations
  console.log('\n📅 CONSULTATIONS:');
  const consultations = await makeRequest('/rest/v1/consultations?select=id,status&limit=1');
  if (consultations.data && Array.isArray(consultations.data)) {
    console.log(`  Total: ${consultations.data.length} (sample)`);
    console.log('  ✅ Table exists');
  } else {
    console.log('  ⚠️  Table may be empty or error:', consultations.data);
  }

  // 4. Check Bookings
  console.log('\n📚 BOOKINGS:');
  const bookings = await makeRequest('/rest/v1/bookings?select=id,status&limit=1');
  if (bookings.data && Array.isArray(bookings.data)) {
    console.log(`  Total: ${bookings.data.length} (sample)`);
    console.log('  ✅ Table exists');
  } else {
    console.log('  ⚠️  Table may be empty or error');
  }

  // 5. Check Premium Purchases
  console.log('\n💎 PREMIUM PURCHASES:');
  const purchases = await makeRequest('/rest/v1/premium_purchases?select=id,status&limit=1');
  if (purchases.data && Array.isArray(purchases.data)) {
    console.log(`  Total: ${purchases.data.length} (sample)`);
    console.log('  ✅ Table exists');
  } else {
    console.log('  ⚠️  Table may be empty or error');
  }

  // 6. Check Countries
  console.log('\n🌍 COUNTRIES:');
  const countries = await makeRequest('/rest/v1/visas?select=country&distinct=true');
  if (countries.data && Array.isArray(countries.data)) {
    const uniqueCountries = [...new Set(countries.data.map(v => v.country))];
    console.log(`  Countries: ${uniqueCountries.join(', ')}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ DATA CHECK COMPLETE');
}

checkAllData().catch(console.error);
