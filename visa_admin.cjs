#!/usr/bin/env node
/**
 * VISA ADMIN CONTROL SYSTEM
 * Turn visas on/off and test them
 */

const https = require('https');

const CONFIG = {
  supabaseUrl: 'https://zogfvzzizbbmmmnlzxdg.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1ODc5MiwiZXhwIjoyMDg3MDM0NzkyfQ.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw'
};

class VisaAdmin {
  async updateAllVisas(status) {
    return new Promise((resolve) => {
      const postData = JSON.stringify({ is_active: status });
      const options = {
        hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
        port: 443,
        path: '/rest/v1/visas?is_active=eq.' + !status, // Update opposite of current
        method: 'PATCH',
        headers: {
          'apikey': CONFIG.serviceKey,
          'Authorization': `Bearer ${CONFIG.serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`✅ Updated visas to is_active=${status}`);
          resolve({ success: res.statusCode === 200, count: data ? JSON.parse(data).length : 0 });
        });
      });

      req.on('error', (err) => {
        console.error('Error:', err.message);
        resolve({ success: false, error: err.message });
      });

      req.write(postData);
      req.end();
    });
  }

  async toggleVisa(visaId, status) {
    return new Promise((resolve) => {
      const postData = JSON.stringify({ is_active: status });
      const options = {
        hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
        port: 443,
        path: `/rest/v1/visas?id=eq.${visaId}`,
        method: 'PATCH',
        headers: {
          'apikey': CONFIG.serviceKey,
          'Authorization': `Bearer ${CONFIG.serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({ success: res.statusCode === 200, data: data ? JSON.parse(data) : null });
        });
      });

      req.on('error', (err) => resolve({ success: false, error: err.message }));
      req.write(postData);
      req.end();
    });
  }

  async getVisas(status = null) {
    let filter = status !== null ? `?is_active=eq.${status}` : '';
    return new Promise((resolve) => {
      const options = {
        hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
        port: 443,
        path: `/rest/v1/visas${filter}&select=id,name,is_active,subclass`,
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
            const active = visas.filter(v => v.is_active).length;
            const inactive = visas.filter(v => !v.is_active).length;
            resolve({ 
              success: true, 
              visas, 
              count: visas.length,
              active,
              inactive
            });
          } catch {
            resolve({ success: false, error: 'Invalid JSON' });
          }
        });
      });

      req.on('error', (err) => resolve({ success: false, error: err.message }));
      req.end();
    });
  }
}

// Execute based on command
async function main() {
  const admin = new VisaAdmin();
  const command = process.argv[2];

  switch(command) {
    case 'off':
      console.log('🚫 Turning ALL visas OFF...');
      const offResult = await admin.updateAllVisas(false);
      console.log(`✅ ${offResult.count} visas deactivated`);
      break;

    case 'on':
      console.log('✅ Turning ALL visas ON...');
      const onResult = await admin.updateAllVisas(true);
      console.log(`✅ ${onResult.count} visas activated`);
      break;

    case 'status':
      console.log('📊 Checking visa status...');
      const status = await admin.getVisas();
      console.log(`\nTotal Visas: ${status.count}`);
      console.log(`Active: ${status.active}`);
      console.log(`Inactive: ${status.inactive}`);
      break;

    case 'toggle':
      const visaId = process.argv[3];
      const newStatus = process.argv[4] === 'true';
      if (!visaId) {
        console.log('Usage: node visa_admin.js toggle <visa-id> <true|false>');
        return;
      }
      console.log(`🔄 Toggling visa ${visaId} to ${newStatus}...`);
      const toggleResult = await admin.toggleVisa(visaId, newStatus);
      console.log(toggleResult.success ? '✅ Success' : '❌ Failed');
      break;

    default:
      console.log('VISA ADMIN CONTROL SYSTEM');
      console.log('========================');
      console.log('Commands:');
      console.log('  node visa_admin.js off      - Turn all visas OFF');
      console.log('  node visa_admin.js on       - Turn all visas ON');
      console.log('  node visa_admin.js status   - Check visa status');
      console.log('  node visa_admin.js toggle <id> <true|false> - Toggle specific visa');
  }
}

main();
