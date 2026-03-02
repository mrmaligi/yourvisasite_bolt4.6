import { supabase } from './src/lib/supabase';

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
  
  // Test 1: Check auth
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  console.log('Auth test:', authError ? 'FAILED' : 'OK');
  
  // Test 2: Check profiles table
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('count')
    .limit(1);
  console.log('Profiles table:', profileError ? 'FAILED - ' + profileError.message : 'OK');
  
  // Test 3: Check visas table
  const { data: visas, error: visaError } = await supabase
    .from('visas')
    .select('count')
    .limit(1);
  console.log('Visas table:', visaError ? 'FAILED - ' + visaError.message : 'OK');
}

testConnection();
