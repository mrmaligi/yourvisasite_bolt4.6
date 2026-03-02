import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Use anon key for sign in

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase anon credentials in environment");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
    console.log("Testing lawyer login...");
    const { data: lawyerData, error: lawyerErr } = await supabase.auth.signInWithPassword({
        email: 'lawyer1@visabuild.test',
        password: 'TestPass123!'
    });

    if (lawyerErr) {
        console.error("Lawyer login failed:", lawyerErr.message);
    } else {
        console.log("Lawyer login success. User ID:", lawyerData.user.id);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', lawyerData.user.id).single();
        console.log("Lawyer profile role:", profile?.role);
    }

    console.log("\nTesting user login...");
    const { data: userData, error: userErr } = await supabase.auth.signInWithPassword({
        email: 'user1@visabuild.test',
        password: 'TestPass123!'
    });

    if (userErr) {
        console.error("User login failed:", userErr.message);
    } else {
        console.log("User login success. User ID:", userData.user.id);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', userData.user.id).single();
        console.log("User profile role:", profile?.role);
    }
}

testLogin();
