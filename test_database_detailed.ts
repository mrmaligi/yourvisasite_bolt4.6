import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDetailed() {
  console.log('🔍 Detailed Database Analysis\n');
  console.log('═'.repeat(70));

  // Check all schemas
  console.log('\n📋 Checking Schemas...');
  try {
    const { data, error } = await supabase.rpc('get_schema_list');
    if (error) {
      console.log('   Could not get schema list:', error.message);
    } else {
      console.log('   Available schemas:', data);
    }
  } catch (err) {
    console.log('   Schema check error:', err);
  }

  // Check lawyer schema specifically
  console.log('\n⚖️  Checking lawyer schema tables...');
  const lawyerTables = [
    'lawyer.profiles',
    'lawyer.consultation_slots',
    'lawyer.reviews',
    'lawyer.documents'
  ];

  for (const table of lawyerTables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        if (error.code === '42P01') {
          console.log(`   ❌ ${table}: Table does not exist`);
        } else {
          console.log(`   ⚠️  ${table}: ${error.code} - ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${table}: Exists and accessible`);
      }
    } catch (err: any) {
      console.log(`   ❌ ${table}: ${err.message || err}`);
    }
  }

  // Check auth.users accessibility (this is a common RLS issue)
  console.log('\n🔐 Checking auth schema access...');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, is_active')
      .limit(3);
    
    if (error) {
      console.log('   ❌ Cannot read profiles:', error.code, '-', error.message);
      if (error.message.includes('users')) {
        console.log('   💡 Issue: The profiles table RLS policy references auth.users');
        console.log('      but the is_admin/is_lawyer functions cannot access it.');
      }
    } else {
      console.log('   ✅ Profiles accessible');
      console.log('   Sample data:', data);
    }
  } catch (err: any) {
    console.log('   ❌ Error:', err.message || err);
  }

  // Try to check the actual RLS error
  console.log('\n🧪 Testing RLS with different approaches...');
  
  // Test 1: Direct count
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log('   Count query failed:', error.code, '-', error.message);
    } else {
      console.log('   ✅ Count query works:', count, 'profiles');
    }
  } catch (err: any) {
    console.log('   Count error:', err.message || err);
  }

  // Test 2: Check visas (should work based on RLS)
  console.log('\n📊 Testing visas table (should be public read)...');
  try {
    const { data, error, count } = await supabase
      .from('visas')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .limit(5);
    
    if (error) {
      console.log('   ❌ Visas query failed:', error.code, '-', error.message);
    } else {
      console.log(`   ✅ Visas accessible: ${count} total active visas`);
      console.log('   Sample:', data?.map(v => ({ id: v.id, name: v.name, country: v.country_code })));
    }
  } catch (err: any) {
    console.log('   ❌ Error:', err.message || err);
  }

  // Test 3: Check user_visa_purchases (should be restricted)
  console.log('\n💳 Testing user_visa_purchases (should be restricted)...');
  try {
    const { data, error } = await supabase
      .from('user_visa_purchases')
      .select('*')
      .limit(5);
    
    if (error) {
      console.log('   🔒 Purchases restricted:', error.code, '-', error.message);
    } else {
      console.log('   ⚠️  Purchases accessible (unexpected):', data?.length, 'rows');
    }
  } catch (err: any) {
    console.log('   ❌ Error:', err.message || err);
  }

  // Test 4: Check if we can create a test entry (should fail for anon)
  console.log('\n📝 Testing INSERT permissions (should fail for anon)...');
  try {
    const { error } = await supabase
      .from('tracker_entries')
      .insert({ 
        visa_id: '00000000-0000-0000-0000-000000000000',
        status: 'pending'
      });
    
    if (error) {
      console.log('   🔒 Insert blocked:', error.code, '-', error.message);
    } else {
      console.log('   ⚠️  Insert succeeded (unexpected for anon)');
    }
  } catch (err: any) {
    console.log('   ❌ Error:', err.message || err);
  }

  // Check for specific tables mentioned in errors
  console.log('\n📋 Checking specific missing tables...');
  const missingTables = ['news', 'forum_posts', 'document_templates'];
  for (const table of missingTables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (error?.code === '42P01') {
        console.log(`   ❌ ${table}: Does not exist in public schema`);
        
        // Try news_articles instead of news
        if (table === 'news') {
          const { error: err2 } = await supabase.from('news_articles').select('count').limit(1);
          if (!err2 || err2.code !== '42P01') {
            console.log(`      💡 Try 'news_articles' instead of 'news'`);
          }
        }
      } else if (error) {
        console.log(`   ⚠️  ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: Exists`);
      }
    } catch (err: any) {
      console.log(`   ❌ ${table}: ${err.message || err}`);
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log('🔍 Detailed Analysis Complete\n');
}

testDetailed();
