import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    // Try to find if the user exists
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    const lawyer = users?.users.find(u => u.email === 'lawyer1@visabuild.test');

    if (lawyer) {
        console.log("Found existing lawyer1, deleting...", lawyer.id);
        await supabase.auth.admin.deleteUser(lawyer.id);
    }

    // Look directly in database for leftover profiles
    const { data: profiles } = await supabase.from('profiles').select('*');
    console.log("All profiles:", profiles);

    // Attempt creation
    console.log("Creating back...");
    const { data, error } = await supabase.auth.admin.createUser({
        email: 'lawyer1@visabuild.test',
        password: 'TestPass123!',
        email_confirm: true,
        user_metadata: { full_name: 'Dr Amanda Hayes' }
    });
    console.log("Create Result:", data, "Error:", error);
}

test();
