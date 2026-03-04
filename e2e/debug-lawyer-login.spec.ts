import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://www.yourvisasite.com';
const SUPABASE_URL = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

test('Debug Lawyer Login - Check Data Structure', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  DEBUGGING LAWYER LOGIN ISSUE');
  console.log('═══════════════════════════════════════════\n');
  
  const supabase = createClient(SUPABASE_URL, ANON_KEY);
  
  // Step 1: Login as an approved lawyer
  console.log('1. Logging in as approved lawyer...');
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'testlawyer1772618600@gmail.com',
    password: 'Lawyer123!',
  });
  
  if (authError) {
    console.log(`   ❌ Login error: ${authError.message}`);
    return;
  }
  
  console.log(`   ✅ Logged in: ${authData.user?.id}`);
  
  // Step 2: Check profile data (exact query used in UnifiedLogin)
  console.log('\n2. Checking profile with lawyer_profiles relation...');
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, is_active, lawyer_profiles(verification_status)')
    .eq('id', authData.user!.id)
    .maybeSingle();
  
  if (profileError) {
    console.log(`   ❌ Profile error: ${profileError.message}`);
  } else {
    console.log(`   Profile: ${JSON.stringify(profile, null, 2)}`);
    
    // Check the structure
    const lawyerProfile = profile?.lawyer_profiles?.[0];
    console.log(`   lawyerProfile: ${JSON.stringify(lawyerProfile)}`);
    console.log(`   verification_status: ${lawyerProfile?.verification_status}`);
    
    if (lawyerProfile?.verification_status === 'approved') {
      console.log('   ✅ Should redirect to /lawyer/dashboard');
    } else {
      console.log('   ❌ Would redirect to /lawyer/pending');
    }
  }
  
  // Step 3: Check lawyer_profiles directly
  console.log('\n3. Checking lawyer_profiles directly...');
  
  const { data: lawyerData, error: lawyerError } = await supabase
    .from('lawyer_profiles')
    .select('verification_status, is_verified')
    .eq('user_id', authData.user!.id)
    .single();
  
  if (lawyerError) {
    console.log(`   ❌ Error: ${lawyerError.message}`);
  } else {
    console.log(`   Direct query: ${JSON.stringify(lawyerData)}`);
  }
  
  // Step 4: Check ALL lawyer profiles for this user
  console.log('\n4. Checking ALL lawyer profiles for this user...');
  
  const { data: allLawyerProfiles } = await supabase
    .from('lawyer_profiles')
    .select('id, bar_number, verification_status, is_verified')
    .eq('user_id', authData.user!.id);
  
  console.log(`   Found ${allLawyerProfiles?.length || 0} lawyer profile(s):`);
  allLawyerProfiles?.forEach((lp, i) => {
    console.log(`   [${i}] Bar: ${lp.bar_number} | Status: ${lp.verification_status} | Verified: ${lp.is_verified}`);
  });
  
  console.log('\n═══════════════════════════════════════════');
});
