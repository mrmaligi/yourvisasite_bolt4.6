import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in environment");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function run() {
    console.log('Starting user reset...');

    // 1. Delete existing mock users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    const mockUsers = users.filter((u: any) => u.email && u.email.endsWith('@visabuild.test'));
    console.log(`Found ${mockUsers.length} existing mock users. Deleting...`);

    for (const user of mockUsers) {
        const { error } = await supabase.auth.admin.deleteUser(user.id);
        if (error) {
            console.error(`Failed to delete ${user.email}:`, error);
        }
    }
    console.log('Deleted existing mock users.');

    const password = 'TestPass123!';

    // 2. Create Regular Users
    const userNames = ['Sarah Chen', 'James Wilson', 'Priya Patel', 'Mohammed Al-Hassan', 'Emma Thompson', 'Carlos Rodriguez', 'Yuki Tanaka', 'Fatima Ahmed', 'Liam OBrien', 'Sofia Rossi', 'User Eleven'];
    for (let i = 0; i < userNames.length; i++) {
        const email = `user${i + 1}@visabuild.test`;
        console.log(`Creating user: ${email}`);
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: userNames[i] }
        });
        if (error) {
            console.error(error);
            continue;
        }

        await supabase.from('profiles').upsert({
            id: data.user.id,
            role: 'user',
            full_name: userNames[i],
            is_verified: true,
            verification_status: 'approved'
        });
    }

    // 3. Create Lawyers
    const lawyerNames = ['Dr Amanda Hayes', 'Barrister Raj Kapoor', 'Sarah Mitchell LLB', 'David Park', 'Maria Santos', 'Thomas Wright', 'Aisha Khan', 'Robert Chen', 'Jennifer Adams', 'Michael Brown'];
    const jurisdictions = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'NSW', 'VIC', 'QLD', 'WA', 'SA'];
    for (let i = 0; i < lawyerNames.length; i++) {
        const email = `lawyer${i + 1}@visabuild.test`;
        console.log(`Creating lawyer: ${email}`);
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: lawyerNames[i] }
        });

        if (error) {
            console.error(error);
            continue;
        }

        // Update profile
        const userId = data.user.id;
        const barNumber = 'AU-' + Math.floor(10000 + Math.random() * 90000);
        const yrsExp = 5 + Math.floor(Math.random() * 20);
        const rate = (150 + Math.floor(Math.random() * 200)) * 100; // in cents

        await supabase.from('profiles').upsert({
            id: userId,
            full_name: lawyerNames[i],
            role: 'lawyer',
            bar_number: barNumber,
            jurisdiction: jurisdictions[i],
            years_experience: yrsExp,
            hourly_rate_cents: rate,
            is_verified: true,
            verification_status: 'approved'
        });
    }

    // 4. Create Admins
    const adminNames = ['Alex Admin', 'System Moderator', 'Content Manager', 'Support Lead', 'Security Admin', 'Data Admin', 'User Admin', 'Finance Admin', 'Tech Admin', 'Super Admin'];
    for (let i = 0; i < adminNames.length; i++) {
        const email = `admin${i + 1}@visabuild.test`;
        console.log(`Creating admin: ${email}`);
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: adminNames[i] }
        });

        if (error) {
            console.error(error);
            continue;
        }

        // Update profile
        await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: adminNames[i],
            role: 'admin',
            is_verified: true,
            verification_status: 'approved'
        });
    }

    console.log('✅ Created all users, lawyers, and admins successfully.');
}

run();
