import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkRPCs() {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { 'apikey': supabaseKey }
    });
    const data = await res.json();
    const paths = Object.keys(data.paths).filter(p => p.startsWith('/rpc/'));
    console.log("RPCs available:", paths);
}

checkRPCs();
