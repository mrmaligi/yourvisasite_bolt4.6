import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: users, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    console.log('Total auth users:', users?.users?.length);

    const { count: profilesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    console.log('Total profiles:', profilesCount);

    // Print their emails
    console.log(users?.users?.filter(u => u.email?.includes('@visabuild.test')).map(u => u.email));
}
check();
