const { Client } = require('pg');

const connectionString = 'postgresql://postgres.zogfvzzizbbmmmnlzxdg:Mrmaligi@2007@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

async function setupDatabase() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to Supabase...\n');
    await client.connect();

    console.log('📦 Creating visa_timelines table...\n');

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.visa_timelines (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        visa_subclass VARCHAR(10) NOT NULL,
        anzsco_code VARCHAR(10) DEFAULT 'N/A',
        location VARCHAR(20) CHECK (location IN ('onshore', 'offshore')),
        date_lodged DATE NOT NULL,
        date_granted DATE,
        processing_days INTEGER,
        had_medicals BOOLEAN DEFAULT FALSE,
        had_s56 BOOLEAN DEFAULT FALSE,
        points INTEGER,
        source VARCHAR(50) DEFAULT 'user',
        notes TEXT,
        url TEXT,
        verified BOOLEAN DEFAULT FALSE,
        flagged BOOLEAN DEFAULT FALSE,
        outlier_flag BOOLEAN DEFAULT FALSE,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Table created');

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_timelines_visa ON public.visa_timelines(visa_subclass);
      CREATE INDEX IF NOT EXISTS idx_timelines_anzsco ON public.visa_timelines(anzsco_code);
      CREATE INDEX IF NOT EXISTS idx_timelines_location ON public.visa_timelines(location);
      CREATE INDEX IF NOT EXISTS idx_timelines_submitted ON public.visa_timelines(submitted_at);
      CREATE INDEX IF NOT EXISTS idx_timelines_verified ON public.visa_timelines(verified);
    `);
    console.log('✓ Indexes created');

    // Enable RLS
    await client.query(`
      ALTER TABLE public.visa_timelines ENABLE ROW LEVEL SECURITY;
    `);
    console.log('✓ RLS enabled');

    // Drop existing policies
    await client.query(`
      DROP POLICY IF EXISTS "Allow read access to visa_timelines" ON public.visa_timelines;
      DROP POLICY IF EXISTS "Allow insert to visa_timelines" ON public.visa_timelines;
      DROP POLICY IF EXISTS "Allow anonymous insert to visa_timelines" ON public.visa_timelines;
      DROP POLICY IF EXISTS "Allow admin update to visa_timelines" ON public.visa_timelines;
    `);

    // Create read policy (everyone can read)
    await client.query(`
      CREATE POLICY "Allow read access to visa_timelines" 
        ON public.visa_timelines 
        FOR SELECT 
        TO anon, authenticated 
        USING (true);
    `);
    console.log('✓ Read policy created');

    // Create anonymous insert policy
    await client.query(`
      CREATE POLICY "Allow anonymous insert to visa_timelines" 
        ON public.visa_timelines 
        FOR INSERT 
        TO anon, authenticated 
        WITH CHECK (true);
    `);
    console.log('✓ Anonymous insert policy created');

    // Create admin update policy
    await client.query(`
      CREATE POLICY "Allow admin update to visa_timelines" 
        ON public.visa_timelines 
        FOR ALL 
        TO authenticated 
        USING (auth.jwt() ->> 'role' = 'admin')
        WITH CHECK (auth.jwt() ->> 'role' = 'admin');
    `);
    console.log('✓ Admin policy created');

    // Create materialized view for stats
    await client.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS public.timeline_stats AS
      SELECT 
        visa_subclass,
        anzsco_code,
        location,
        COUNT(*) as total_entries,
        AVG(processing_days) as avg_days,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY processing_days) as median_days,
        MIN(processing_days) as min_days,
        MAX(processing_days) as max_days,
        STDDEV(processing_days) as std_dev_days
      FROM public.visa_timelines
      WHERE outlier_flag = FALSE AND flagged = FALSE
      GROUP BY visa_subclass, anzsco_code, location;
    `);
    console.log('✓ Stats view created');

    // Insert sample data
    console.log('\n📊 Inserting sample data...');
    
    const sampleData = [
      { visa: '189', anzsco: '261312', location: 'offshore', days: 219, source: 'reddit' },
      { visa: '189', anzsco: '261312', location: 'offshore', days: 210, source: 'reddit' },
      { visa: '189', anzsco: '261312', location: 'onshore', days: 198, source: 'user' },
      { visa: '190', anzsco: '233512', location: 'onshore', days: 204, source: 'reddit' },
      { visa: '190', anzsco: '233512', location: 'offshore', days: 196, source: 'reddit' },
      { visa: '820', anzsco: 'N/A', location: 'onshore', days: 406, source: 'reddit' },
      { visa: '820', anzsco: 'N/A', location: 'onshore', days: 350, source: 'reddit' },
      { visa: '500', anzsco: 'N/A', location: 'offshore', days: 27, source: 'user' },
    ];

    for (const d of sampleData) {
      const granted = new Date();
      const lodged = new Date(granted.getTime() - d.days * 24 * 60 * 60 * 1000);
      
      await client.query(`
        INSERT INTO public.visa_timelines 
          (visa_subclass, anzsco_code, location, date_lodged, date_granted, processing_days, source, verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
        ON CONFLICT DO NOTHING
      `, [d.visa, d.anzsco, d.location, lodged.toISOString().split('T')[0], granted.toISOString().split('T')[0], d.days, d.source]);
    }
    console.log(`✓ ${sampleData.length} sample entries added`);

    // Refresh stats
    await client.query(`REFRESH MATERIALIZED VIEW public.timeline_stats`);
    console.log('✓ Stats view refreshed');

    console.log('\n✅ Database setup complete!');
    console.log('Anonymous submissions are now enabled.');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

setupDatabase();
