import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyAnonymousPolicy() {
  console.log('🔧 Applying anonymous submission policy...\n');
  
  const sql = `
    -- Drop existing insert policy if exists
    DROP POLICY IF EXISTS "Allow insert to visa_timelines" ON public.visa_timelines;
    DROP POLICY IF EXISTS "Allow anonymous insert to visa_timelines" ON public.visa_timelines;
    
    -- Create policy for anonymous and authenticated inserts
    CREATE POLICY "Allow anonymous insert to visa_timelines" 
      ON public.visa_timelines 
      FOR INSERT 
      TO anon, authenticated 
      WITH CHECK (source IN ('anonymous_user', 'user', 'reddit', 'reddit_cron'));
    
    -- Verify the policy was created
    SELECT policyname FROM pg_policies WHERE tablename = 'visa_timelines';
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      // Try direct query approach
      console.log('Trying alternative method...');
      
      // Check if we can insert a test record
      const { error: testError } = await supabase
        .from('visa_timelines')
        .insert({
          visa_subclass: 'TEST',
          anzsco_code: 'N/A',
          location: 'onshore',
          date_lodged: '2024-01-01',
          date_granted: '2024-06-01',
          processing_days: 150,
          source: 'anonymous_user',
          verified: false,
          submitted_at: new Date().toISOString()
        })
        .select();
      
      if (testError && testError.code === '42501') {
        console.error('❌ Permission denied. RLS policy blocking inserts.');
        console.log('\n📋 Run this SQL manually in Supabase Dashboard:');
        console.log('----------------------------------------');
        console.log(sql);
        console.log('----------------------------------------');
      } else if (testError) {
        console.error('❌ Error:', testError.message);
      } else {
        console.log('✅ Test insert succeeded! Anonymous submissions should work.');
        
        // Clean up test record
        await supabase.from('visa_timelines').delete().eq('visa_subclass', 'TEST');
      }
    } else {
      console.log('✅ Anonymous submission policy applied successfully!');
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
    console.log('\n📋 Please run this SQL manually in Supabase Dashboard:');
    console.log('----------------------------------------');
    console.log(sql);
    console.log('----------------------------------------');
  }
}

applyAnonymousPolicy();
