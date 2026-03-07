const https = require('https');

const CONFIG = {
  supabaseUrl: 'https://zogfvzzizbbmmmnlzxdg.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1ODc5MiwiZXhwIjoyMDg3MDM0NzkyfQ.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw'
};

// Get all visas
https.get(`${CONFIG.supabaseUrl}/rest/v1/visas?select=id,name,is_active`, {
  headers: { 'apikey': CONFIG.serviceKey, 'Authorization': `Bearer ${CONFIG.serviceKey}` }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const visas = JSON.parse(data);
    const partnerVisas = visas.filter(v => v.name.toLowerCase().includes('partner'));
    
    console.log(`Found ${partnerVisas.length} Partner visas:`);
    partnerVisas.forEach(v => console.log(`  - ${v.name} (${v.is_active ? 'ON' : 'OFF'})`));
    
    // Turn on each partner visa
    let activated = 0;
    partnerVisas.forEach((visa, index) => {
      setTimeout(() => {
        const postData = JSON.stringify({ is_active: true });
        const options = {
          hostname: 'zogfvzzizbbmmmnlzxdg.supabase.co',
          port: 443,
          path: `/rest/v1/visas?id=eq.${visa.id}`,
          method: 'PATCH',
          headers: {
            'apikey': CONFIG.serviceKey,
            'Authorization': `Bearer ${CONFIG.serviceKey}`,
            'Content-Type': 'application/json'
          }
        };
        
        const req = https.request(options, (res) => {
          if (res.statusCode === 200 || res.statusCode === 204) {
            console.log(`✅ Activated: ${visa.name}`);
            activated++;
          } else {
            console.log(`❌ Failed: ${visa.name}`);
          }
        });
        
        req.on('error', () => console.log(`❌ Error: ${visa.name}`));
        req.write(postData);
        req.end();
      }, index * 500);
    });
    
    setTimeout(() => {
      console.log(`\n✅ Done! Activated ${activated} Partner visas`);
    }, partnerVisas.length * 500 + 1000);
  });
}).on('error', console.error);
