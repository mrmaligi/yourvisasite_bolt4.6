#!/usr/bin/env node
/**
 * VISA ADMIN WORKFLOW - Added to continuous_agents_v3
 * This extends the existing system with visa management
 */

const https = require('https');

const CONFIG = {
  supabaseUrl: 'https://zogfvzzizbbmmmnlzxdg.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1ODc5MiwiZXhwIjoyMDg3MDM0NzkyfQ.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw',
  baseUrl: 'https://yourvisasite.vercel.app'
};

// VISA MANAGEMENT FUNCTIONS
class VisaManager {
  async getAllVisas() {
    return new Promise((resolve) => {
      const options = {
        hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
        port: 443,
        path: '/rest/v1/visas?select=id,name,is_active,subclass',
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
            resolve({
              success: true,
              visas,
              total: visas.length,
              active: visas.filter(v => v.is_active).length,
              inactive: visas.filter(v => !v.is_active).length
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

  async toggleVisa(visaId, isActive) {
    return new Promise((resolve) => {
      const postData = JSON.stringify({ is_active: isActive });
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

      req.on('error', () => resolve({ success: false }));
      req.write(postData);
      req.end();
    });
  }

  async bulkToggle(isActive) {
    return new Promise((resolve) => {
      const postData = JSON.stringify({ is_active: isActive });
      const options = {
        hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
        port: 443,
        path: '/rest/v1/visas',
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
          try {
            const result = JSON.parse(data);
            resolve({ success: res.statusCode === 200, count: result.length });
          } catch {
            resolve({ success: res.statusCode === 200, count: 0 });
          }
        });
      });

      req.on('error', () => resolve({ success: false }));
      req.write(postData);
      req.end();
    });
  }
}

// VISA TESTING FUNCTIONS
class VisaTester {
  async testVisaPage(visaId) {
    return new Promise((resolve) => {
      https.get(`${CONFIG.baseUrl}/visas/${visaId}`, (res) => {
        resolve({ status: res.statusCode, accessible: res.statusCode === 200 });
      }).on('error', () => resolve({ status: 0, accessible: false }));
    });
  }

  async testVisasList() {
    return new Promise((resolve) => {
      https.get(`${CONFIG.baseUrl}/visas`, (res) => {
        resolve({ status: res.statusCode, accessible: res.statusCode === 200 });
      }).on('error', () => resolve({ status: 0, accessible: false }));
    });
  }
}

// EXPORT FOR USE IN CONTINUOUS AGENTS
module.exports = { VisaManager, VisaTester };

// CLI MODE
if (require.main === module) {
  const manager = new VisaManager();
  const command = process.argv[2];

  (async () => {
    switch(command) {
      case 'list':
        console.log('📋 Listing all visas...');
        const list = await manager.getAllVisas();
        if (list.success) {
          console.log(`\nTotal: ${list.total}`);
          console.log(`Active: ${list.active}`);
          console.log(`Inactive: ${list.inactive}\n`);
          list.visas.slice(0, 10).forEach(v => {
            console.log(`${v.is_active ? '✅' : '❌'} ${v.name} (${v.subclass || 'N/A'})`);
          });
          if (list.visas.length > 10) console.log(`... and ${list.visas.length - 10} more`);
        }
        break;

      case 'on':
        console.log('✅ Activating all visas...');
        const onResult = await manager.bulkToggle(true);
        console.log(onResult.success ? `✅ ${onResult.count} visas activated` : '❌ Failed');
        break;

      case 'off':
        console.log('🚫 Deactivating all visas...');
        const offResult = await manager.bulkToggle(false);
        console.log(offResult.success ? `✅ ${offResult.count} visas deactivated` : '❌ Failed');
        break;

      case 'test':
        console.log('🧪 Testing visa pages...');
        const tester = new VisaTester();
        const listTest = await tester.testVisasList();
        console.log(`Visas list page: ${listTest.accessible ? '✅' : '❌'} (${listTest.status})`);
        
        const visas = await manager.getAllVisas();
        if (visas.success && visas.visas.length > 0) {
          const testVisa = visas.visas[0];
          const detailTest = await tester.testVisaPage(testVisa.id);
          console.log(`Visa detail page (${testVisa.name}): ${detailTest.accessible ? '✅' : '❌'} (${detailTest.status})`);
        }
        break;

      default:
        console.log('VISA ADMIN & TEST SYSTEM');
        console.log('========================');
        console.log('Commands:');
        console.log('  node visa_workflow.cjs list     - List all visas');
        console.log('  node visa_workflow.cjs on       - Turn ALL visas ON');
        console.log('  node visa_workflow.cjs off      - Turn ALL visas OFF');
        console.log('  node visa_workflow.cjs test     - Test visa pages');
    }
  })();
}
