import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding data...');

  const adminId = '33333333-3333-3333-3333-333333333333';
  const lawyerUserId = '22222222-2222-2222-2222-222222222222';
  const lawyerProfileId = '44444444-4444-4444-4444-444444444444';
  const categoryId = '55555555-5555-5555-5555-555555555555';

  // 1. Ensure Profiles exist (Admin)
  // We can't insert into auth.users via client, but we can insert into public.profiles
  // Assuming auth.users already has these users from previous seeds or we can't do it.
  // If auth.users doesn't have them, we can't easily create them with just anon key, need service role.
  // Using SERVICE_ROLE_KEY if available.

  const { error: adminError } = await supabase.from('profiles').upsert({
    id: adminId,
    email: 'admin@visabuild.local',
    role: 'admin',
    full_name: 'Admin User',
    is_active: true,
    is_verified: true,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });

  if (adminError) console.error('Admin Profile Error:', adminError);

  const { error: lawyerError } = await supabase.from('profiles').upsert({
    id: lawyerUserId,
    email: 'lawyer@visabuild.local',
    role: 'lawyer',
    full_name: 'Sarah Lawyer',
    is_active: true,
    is_verified: true,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });

  if (lawyerError) console.error('Lawyer Profile Error:', lawyerError);

  // 2. Lawyer Profile (public or lawyer schema?)
  // Try public first
  const { error: lpError } = await supabase.from('lawyer_profiles').upsert({
    id: lawyerProfileId,
    user_id: lawyerUserId,
    verification_status: 'approved',
    bio: 'Expert immigration lawyer.',
    languages: ['English'],
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });

  if (lpError) {
      console.error('Public Lawyer Profile Error:', lpError);
      // Try lawyer schema
      const { error: lpError2 } = await supabase.schema('lawyer').from('profiles').upsert({
        id: lawyerProfileId,
        user_id: lawyerUserId, // Assuming column name
        verification_status: 'approved',
        bio: 'Expert immigration lawyer.',
        languages: ['English'],
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
      if (lpError2) console.error('Lawyer Schema Profile Error:', lpError2);
  }

  // 3. News Articles
  const { error: newsError } = await supabase.from('news_articles').upsert([
    {
        title: 'New Visa Rules 2026',
        slug: 'new-visa-rules-2026',
        body: 'Complete details about the new visa rules coming into effect...',
        excerpt: 'Major changes to skilled migration visas announced.',
        category: 'policy',
        author_id: adminId,
        is_published: true,
        published_at: new Date().toISOString(),
    },
    {
        title: 'Processing Times Update',
        slug: 'processing-times-update-feb',
        body: 'Processing times have improved for 189 and 190 visas...',
        excerpt: 'Faster processing for skilled visas observed.',
        category: 'processing',
        author_id: adminId,
        is_published: true,
        published_at: new Date().toISOString(),
    }
  ], { onConflict: 'slug' });

  if (newsError) console.error('News Error:', newsError);

  // 4. Marketplace Categories
  const { error: catError } = await supabase.from('marketplace_categories').upsert({
      id: categoryId,
      name: 'Consultation',
      icon: 'video'
  }, { onConflict: 'name' });

  if (catError) console.error('Category Error:', catError);

  // 5. Marketplace Listings (Lawyer Schema)
  const { error: mpError } = await supabase.schema('lawyer').from('marketplace_listings').upsert([
      {
        lawyer_id: lawyerProfileId, // Needs to reference lawyer profile ID
        title: 'Initial Consultation',
        description: '30 minute video consultation to discuss your visa options.',
        category_id: categoryId,
        price_cents: 15000,
        listing_type: 'service',
        duration_minutes: 30,
        is_active: true
      },
      {
        lawyer_id: lawyerProfileId,
        title: 'Document Review',
        description: 'Detailed review of your prepared application documents.',
        category_id: categoryId,
        price_cents: 30000,
        listing_type: 'service',
        duration_minutes: 60,
        is_active: true
      }
  ]); // No ID provided, insert new. Or use ID if we want upsert.

  if (mpError) console.error('Marketplace Error:', mpError);

  console.log('Seeding complete.');
}

seed();
