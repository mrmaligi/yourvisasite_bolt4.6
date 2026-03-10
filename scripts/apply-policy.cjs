const { Client } = require('pg');

const connectionString = 'postgresql://postgres.zogfvzzizbbmmmnlzxdg:Mrmaligi@2007@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

async function applyPolicy() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to Supabase...\n');
    await client.connect();

    console.log('🔧 Applying anonymous submission policy...\n');

    // Check existing policies
    const checkRes = await client.query(`
      SELECT policyname FROM pg_policies WHERE tablename = 'visa_timelines';
    `);
    console.log('Current policies:', checkRes.rows.map(r => r.policyname));

    // Drop existing insert policies
    await client.query(`
      DROP POLICY IF EXISTS "Allow insert to visa_timelines" ON public.visa_timelines;
      DROP POLICY IF EXISTS "Allow anonymous insert to visa_timelines" ON public.visa_timelines;
    `);
    console.log('✓ Dropped old policies');

    // Create new anonymous-friendly policy
    await client.query(`
      CREATE POLICY "Allow anonymous insert to visa_timelines" 
        ON public.visa_timelines 
        FOR INSERT 
        TO anon, authenticated 
        WITH CHECK (true);
    `);
    console.log('✓ Created anonymous insert policy');

    // Verify
    const verifyRes = await client.query(`
      SELECT policyname, permissive, roles FROM pg_policies WHERE tablename = 'visa_timelines';
    `);
    
    console.log('\n📋 Updated policies:');
    verifyRes.rows.forEach(row => {
      console.log(`  - ${row.policyname} (${row.permissive}) - roles: ${row.roles}`);
    });

    console.log('\n✅ Anonymous submission policy applied successfully!');
    console.log('Anyone can now submit visa timelines without logging in.');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

applyPolicy();
