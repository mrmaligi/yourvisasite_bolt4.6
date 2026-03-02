import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testWrite() {
    console.log("Testing write to check if DB is read-only...");
    const fakeId = '00000000-0000-0000-0000-000000000001';
    const { data, error } = await supabase.from('visas').insert({
        id: fakeId,
        subclass_number: '999_TEST',
        name: 'Test Visa',
        country: 'TestLand',
    });
    console.log("Result:", data, "Error:", error);

    if (!error) {
        console.log("Cleaning up test row...");
        await supabase.from('visas').delete().eq('id', fakeId);
    }
}

testWrite();
