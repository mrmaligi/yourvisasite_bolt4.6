import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg3OTIsImV4cCI6MjA4NzAzNDc5Mn0.oK6i_dnZmoAhACKt3bH7BCboODPi5v4xhDA4bJPa9DM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySync() {
  console.log('🔍 Verifying Backend-Frontend Sync...');
  console.log('');

  // 1. Test Lawyer Schema Access
  console.log('1. Checking lawyer.profiles view...');
  try {
    const { data: lawyers, error: lError } = await supabase.schema('lawyer').from('profiles').select('*').limit(1);
    if (lError) {
      console.log('   ❌ Error:', lError.message);
    } else {
      console.log('   ✅ Success: Lawyer view is accessible');
    }
  } catch (e: any) {
    console.log('   ❌ Crash:', e.message);
  }

  // 2. Test News View
  console.log('');
  console.log('2. Checking public.news compatibility view...');
  try {
    const { data: news, error: nError } = await supabase.from('news').select('*').limit(1);
    if (nError) {
      console.log('   ❌ Error:', nError.message);
    } else {
      console.log('   ✅ Success: news table/view exists');
    }
  } catch (e: any) {
    console.log('   ❌ Crash:', e.message);
  }

  // 3. Test Booking Date Column
  console.log('');
  console.log('3. Checking for booking_date column in bookings...');
  try {
    const { data: bookings, error: bError } = await supabase.from('bookings').select('booking_date').limit(1);
    if (bError) {
      console.log('   ❌ Error:', bError.message);
    } else {
      console.log('   ✅ Success: booking_date alias column found');
    }
  } catch (e: any) {
    console.log('   ❌ Crash:', e.message);
  }

  // 4. Test Visa Subclass Column
  console.log('');
  console.log('4. Checking for visa_subclass column in visas...');
  try {
    const { data: visas, error: vError } = await supabase.from('visas').select('visa_subclass').limit(1);
    if (vError) {
      console.log('   ❌ Error:', vError.message);
    } else {
      console.log('   ✅ Success: visa_subclass alias column found');
    }
  } catch (e: any) {
    console.log('   ❌ Crash:', e.message);
  }

  // 5. Test Profile Access (RLS Fix)
  console.log('');
  console.log('5. Checking public profile read access (RLS check)...');
  try {
    const { data: profiles, error: pError } = await supabase.from('profiles').select('id, full_name').limit(1);
    if (pError) {
      console.log('   ❌ Error:', pError.message);
    } else {
      console.log('   ✅ Success: Profiles are readable (RLS bug fixed)');
    }
  } catch (e: any) {
    console.log('   ❌ Crash:', e.message);
  }

  console.log('');
  console.log('🏁 Verification Complete');
}

verifySync();
