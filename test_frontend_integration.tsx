/**
 * Frontend Integration Test for VisaBuild
 * 
 * This file tests the key frontend components and their database integration.
 * Run with: npx tsx test_frontend_integration.tsx
 */

import { createClient, User } from '@supabase/supabase-js';

const supabaseUrl = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test user credentials (use a test account)
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';

async function testFrontendIntegration() {
  console.log('🧪 Frontend Integration Tests\n');
  console.log('═'.repeat(70));

  let testUser: User | null = null;

  // Test 1: Anonymous User Flow
  console.log('\n👤 Test 1: Anonymous User Flow');
  
  // 1.1 View visas (public)
  try {
    const { data: visas, error } = await supabase
      .from('visas')
      .select('*')
      .eq('is_active', true)
      .limit(5);
    
    if (error) {
      console.log('   ❌ View visas failed:', error.message);
    } else {
      console.log(`   ✅ View visas: ${visas?.length} visas found`);
    }
  } catch (err: any) {
    console.log('   ❌ View visas error:', err.message);
  }

  // 1.2 View tracker entries (public)
  try {
    const { data: entries, error } = await supabase
      .from('tracker_entries')
      .select('*')
      .limit(5);
    
    if (error) {
      console.log('   ❌ View tracker failed:', error.message);
    } else {
      console.log(`   ✅ View tracker: ${entries?.length} entries found`);
    }
  } catch (err: any) {
    console.log('   ❌ View tracker error:', err.message);
  }

  // Test 2: User Registration
  console.log('\n📝 Test 2: User Registration');
  try {
    const { data, error } = await supabase.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      options: {
        data: {
          full_name: 'Test User',
        },
      },
    });

    if (error) {
      console.log('   ❌ Registration failed:', error.message);
    } else {
      testUser = data.user;
      console.log('   ✅ User registered:', testUser?.id);
      console.log('   ℹ️  Check email for confirmation (if enabled)');
    }
  } catch (err: any) {
    console.log('   ❌ Registration error:', err.message);
  }

  // Test 3: User Sign In
  console.log('\n🔑 Test 3: User Sign In');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (error) {
      console.log('   ❌ Sign in failed:', error.message);
      console.log('   ℹ️  May need email confirmation');
    } else {
      testUser = data.user;
      console.log('   ✅ User signed in:', testUser?.id);
    }
  } catch (err: any) {
    console.log('   ❌ Sign in error:', err.message);
  }

  // Test 4: Authenticated User Operations
  if (testUser) {
    console.log('\n🔐 Test 4: Authenticated User Operations');

    // 4.1 Fetch profile (mimics AuthContext)
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*, lawyer_profiles(*)')
        .eq('id', testUser.id)
        .single();

      if (error) {
        console.log('   ❌ Fetch profile failed:', error.code, '-', error.message);
        console.log('   💡 This is the AuthContext issue!');
      } else {
        console.log('   ✅ Profile fetched:', profile?.id);
      }
    } catch (err: any) {
      console.log('   ❌ Fetch profile error:', err.message);
    }

    // 4.2 Fetch profile without join (workaround)
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', testUser.id)
        .single();

      if (error) {
        console.log('   ❌ Simple profile fetch failed:', error.message);
      } else {
        console.log('   ✅ Simple profile fetch works:', profile?.id);
      }
    } catch (err: any) {
      console.log('   ❌ Simple profile fetch error:', err.message);
    }

    // 4.3 Create tracker entry
    try {
      // First get a visa ID
      const { data: visa } = await supabase
        .from('visas')
        .select('id')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (visa) {
        const { error } = await supabase
          .from('tracker_entries')
          .insert({
            visa_id: visa.id,
            status: 'pending',
            user_id: testUser.id,
          });

        if (error) {
          console.log('   ❌ Create tracker entry failed:', error.message);
        } else {
          console.log('   ✅ Tracker entry created');
        }
      }
    } catch (err: any) {
      console.log('   ❌ Create tracker entry error:', err.message);
    }

    // 4.4 Check user purchases
    try {
      const { data: purchases, error } = await supabase
        .from('user_visa_purchases')
        .select('*')
        .eq('user_id', testUser.id);

      if (error) {
        console.log('   ❌ Fetch purchases failed:', error.message);
      } else {
        console.log(`   ✅ Purchases fetched: ${purchases?.length || 0} items`);
      }
    } catch (err: any) {
      console.log('   ❌ Fetch purchases error:', err.message);
    }

    // Sign out
    await supabase.auth.signOut();
    console.log('   ℹ️  User signed out');
  }

  // Test 5: Edge Cases
  console.log('\n🧪 Test 5: Edge Cases');

  // 5.1 Invalid login
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'nonexistent@example.com',
      password: 'wrongpassword',
    });

    if (error) {
      console.log('   ✅ Invalid login correctly rejected:', error.message);
    } else {
      console.log('   ⚠️  Invalid login was accepted (unexpected)');
    }
  } catch (err: any) {
    console.log('   ❌ Invalid login error:', err.message);
  }

  // 5.2 Access protected table without auth
  try {
    await supabase.auth.signOut();
    const { data, error } = await supabase
      .from('user_visa_purchases')
      .select('*')
      .limit(5);

    if (error) {
      console.log('   🔒 Protected table blocked:', error.code);
    } else {
      console.log('   ⚠️  Protected table accessible without auth');
    }
  } catch (err: any) {
    console.log('   ❌ Protected table error:', err.message);
  }

  // Cleanup: Delete test user
  console.log('\n🧹 Cleanup');
  if (testUser) {
    try {
      // Note: Deleting users requires service role key
      console.log('   ℹ️  Test user created:', testUser.id);
      console.log('   ℹ️  Clean up manually via Supabase Dashboard if needed');
    } catch (err: any) {
      console.log('   ⚠️  Cleanup error:', err.message);
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log('🏁 Frontend Integration Tests Complete\n');
  
  console.log('📋 Summary:');
  console.log('   - Check for ❌ marks to identify issues');
  console.log('   - Profile fetch with join is likely to fail (known issue)');
  console.log('   - Run FIX_DATABASE_RLS.sql to fix permission issues');
}

testFrontendIntegration();
