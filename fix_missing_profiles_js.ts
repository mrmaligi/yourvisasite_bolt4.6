import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in environment");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProfiles() {
    console.log("Fetching all auth users...");
    const { data: { users }, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    console.log(`Found ${users.length} users. Checking profiles...`);

    const { data: profiles, error: profileErr } = await supabase.from('profiles').select('id');
    const existingIds = new Set(profiles?.map(p => p.id) || []);

    let fixedCount = 0;

    for (const user of users) {
        if (!existingIds.has(user.id)) {
            console.log(`Missing profile for user ${user.email} (${user.id}). Creating...`);
            const { error: insertErr } = await supabase.from('profiles').insert({
                id: user.id,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                role: 'user' // Default to user, create_mock_users.ts will update it
            });

            if (insertErr) {
                console.error(`Failed to create profile for ${user.id}:`, insertErr);
            } else {
                fixedCount++;
            }
        }
    }

    console.log(`Created ${fixedCount} missing profiles.`);
}

fixProfiles();
