import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkSchema() {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { 'apikey': supabaseKey }
    });
    const data = await res.json();
    const profiles = data.definitions ? data.definitions.profiles : data.components?.schemas?.profiles;
    console.log("Profiles schema:", JSON.stringify(profiles, null, 2));
}

checkSchema();
