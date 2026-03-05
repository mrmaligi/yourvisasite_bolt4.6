import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const SUPABASE_URL = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

test('Debug Lawyer Registration - Trace Status', async ({ page }) => {
  console.log('═══════════════════════════════════════════');
  console.log('  DEBUGGING LAWYER REGISTRATION STATUS');
  console.log('═══════════════════════════════════════════\n');
  
  const testEmail = `debuglawyer${Date.now()}@test.com`;
  const testBar = `DEBUG-${Date.now().toString().slice(-6)}`;
  
  const supabase = createClient(SUPABASE_URL, ANON_KEY);
  
  // Step 1: Register as lawyer
  console.log('1. Registering lawyer...');
  console.log(`   Email: ${testEmail}`);
  console.log(`   Bar: ${testBar}`);
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'TestPass123!',
    options: {
      data: {
        full_name: 'Debug Test Lawyer',
        role: 'lawyer',
      },
    },
  });
  
  if (authError) {
    console.log(`   ❌ Auth error: ${authError.message}`);
    return;
  }
  
  console.log(`   ✅ User created: ${authData.user?.id}`);
  
  // Wait a moment for trigger to run
  await page.waitForTimeout(2000);
  
  // Step 2: Check initial profile status
  console.log('\n2. Checking initial profile status...');
  
  const { data: profileData } = await supabase
    .from('profiles')
    .select('id, role, verification_status, is_verified')
    .eq('id', authData.user!.id)
    .single();
  
  console.log(`   Profile: ${JSON.stringify(profileData)}`);
  
  // Step 3: Insert lawyer profile with pending status
  console.log('\n3. Inserting lawyer profile...');
  
  const { data: lawyerData, error: lawyerError } = await supabase
    .from('lawyer_profiles')
    .insert({
      user_id: authData.user!.id,
      bar_number: testBar,
      jurisdiction: 'New South Wales',
      verification_status: 'pending',
      is_verified: false,
      is_available: true,
    })
    .select()
    .single();
  
  if (lawyerError) {
    console.log(`   ❌ Insert error: ${lawyerError.message}`);
  } else {
    console.log(`   ✅ Lawyer profile inserted:`);
    console.log(`      ID: ${lawyerData.id}`);
    console.log(`      Status: ${lawyerData.verification_status}`);
    console.log(`      Verified: ${lawyerData.is_verified}`);
  }
  
  // Step 4: Update profile with lawyer info
  console.log('\n4. Updating profile...');
  
  const { data: updateData, error: updateError } = await supabase
    .from('profiles')
    .update({
      full_name: 'Debug Test Lawyer',
      role: 'lawyer',
      bar_number: testBar,
      jurisdiction: 'New South Wales',
      verification_status: 'pending',
    })
    .eq('id', authData.user!.id)
    .select()
    .single();
  
  if (updateError) {
    console.log(`   ❌ Update error: ${updateError.message}`);
  } else {
    console.log(`   ✅ Profile updated:`);
    console.log(`      Status: ${updateData.verification_status}`);
    console.log(`      Verified: ${updateData.is_verified}`);
  }
  
  // Step 5: Re-check lawyer profile after all operations
  console.log('\n5. Final check of lawyer profile...');
  
  await page.waitForTimeout(1000);
  
  const { data: finalLawyer } = await supabase
    .from('lawyer_profiles')
    .select('verification_status, is_verified, updated_at')
    .eq('bar_number', testBar)
    .single();
  
  console.log(`   Final status: ${JSON.stringify(finalLawyer)}`);
  
  if (finalLawyer?.verification_status === 'approved') {
    console.log('\n   ❌❌❌ AUTO APPROVED! ❌❌❌');
  } else {
    console.log('\n   ✅ Correctly pending');
  }
  
  console.log('\n═══════════════════════════════════════════');
});
