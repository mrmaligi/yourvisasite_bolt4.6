import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfilesInsert() {
    console.log("Attempting direct profile insert...");
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const { data, error } = await supabase.from('profiles').insert({
        // We cannot use a fake auth.users ID if there's an FK constraint, but let's see the error
        id: fakeId,
        full_name: 'Test Profile',
        role: 'user'
    });
    console.log("Result:", data, "Error:", error);
}

testProfilesInsert();
