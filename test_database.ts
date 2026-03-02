import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  console.log('🧪 Testing VisaBuild Database Connection\n');
  console.log('═'.repeat(60));

  // Test 1: Basic Connection
  console.log('\n📡 Test 1: Basic Connection');
  try {
    const { data, error } = await supabase.from('profiles').select('count').single();
    if (error && error.code !== 'PGRST116') {
      console.log('   ⚠️  Warning:', error.message);
    } else {
      console.log('   ✅ Connection successful');
    }
  } catch (err) {
    console.log('   ❌ Connection failed:', err);
  }

  // Test 2: Check if tables exist
  console.log('\n📊 Test 2: Core Tables Existence');
  const tables = [
    'profiles',
    'visas',
    'user_visa_purchases',
    'tracker_entries',
    'lawyer_profiles',
    'consultation_slots',
    'bookings',
    'news',
    'forum_posts',
    'document_templates'
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        if (error.code === '42P01') {
          console.log(`   ❌ ${table}: Table does not exist`);
        } else {
          console.log(`   ⚠️  ${table}: ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${table}: Exists`);
      }
    } catch (err) {
      console.log(`   ❌ ${table}: Error - ${err}`);
    }
  }

  // Test 3: RLS Policy Check (anonymous access)
  console.log('\n🔒 Test 3: RLS Policies (Anonymous Access)');
  
  // Test profiles table RLS
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(5);
    if (error) {
      console.log(`   🔒 profiles: ${error.code} - ${error.message}`);
    } else {
      console.log(`   ⚠️  profiles: Accessible without auth (${data?.length || 0} rows)`);
    }
  } catch (err) {
    console.log(`   ❌ profiles: Error - ${err}`);
  }

  // Test visas table RLS
  try {
    const { data, error } = await supabase.from('visas').select('*').limit(5);
    if (error) {
      console.log(`   🔒 visas: ${error.code} - ${error.message}`);
    } else {
      console.log(`   ✅ visas: Accessible (${data?.length || 0} rows)`);
    }
  } catch (err) {
    console.log(`   ❌ visas: Error - ${err}`);
  }

  // Test lawyer_profiles table RLS
  try {
    const { data, error } = await supabase.from('lawyer_profiles').select('*').limit(5);
    if (error) {
      if (error.code === '42P01') {
        console.log(`   ❌ lawyer_profiles: Table does not exist`);
      } else {
        console.log(`   🔒 lawyer_profiles: ${error.code} - ${error.message}`);
      }
    } else {
      console.log(`   ✅ lawyer_profiles: Accessible (${data?.length || 0} rows)`);
    }
  } catch (err) {
    console.log(`   ❌ lawyer_profiles: Error - ${err}`);
  }

  // Test 4: Auth Configuration
  console.log('\n👤 Test 4: Auth Configuration');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.log('   ⚠️  Auth check failed:', error.message);
    } else if (session) {
      console.log('   ✅ Active session found');
      console.log(`      User: ${session.user.email}`);
      console.log(`      Role: ${session.user.user_metadata?.role || 'N/A'}`);
    } else {
      console.log('   ℹ️  No active session (expected for anonymous user)');
    }
  } catch (err) {
    console.log('   ❌ Auth error:', err);
  }

  // Test 5: Edge Functions
  console.log('\n⚡ Test 5: Edge Functions');
  const functions = [
    'process-payment',
    'stripe-webhook',
    'consultation-checkout',
    'send-email'
  ];

  for (const fn of functions) {
    try {
      const { error } = await supabase.functions.invoke(fn, { 
        body: { test: true },
        method: 'POST'
      });
      if (error) {
        if (error.message?.includes('404') || error.message?.includes('Not Found')) {
          console.log(`   ❌ ${fn}: Function not found`);
        } else if (error.message?.includes('401') || error.message?.includes('403')) {
          console.log(`   🔒 ${fn}: Requires authentication`);
        } else {
          console.log(`   ⚠️  ${fn}: ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${fn}: Accessible`);
      }
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch')) {
        console.log(`   ❌ ${fn}: Network/Connection error`);
      } else {
        console.log(`   ⚠️  ${fn}: ${err.message || err}`);
      }
    }
  }

  // Test 6: Bucket/Storage Check
  console.log('\n📁 Test 6: Storage Buckets');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log('   🔒 Storage:', error.message);
    } else if (buckets && buckets.length > 0) {
      console.log(`   ✅ ${buckets.length} bucket(s) found:`);
      buckets.forEach(b => console.log(`      - ${b.name} (${b.public ? 'public' : 'private'})`));
    } else {
      console.log('   ℹ️  No buckets found');
    }
  } catch (err) {
    console.log('   ❌ Storage error:', err);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('🏁 Database Testing Complete\n');
}

testDatabase();
