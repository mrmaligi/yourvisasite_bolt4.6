import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://zogfvzzizbbmmmnlzxdg.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZ2Z2enppemJibW1tbmx6eGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ1ODc5MiwiZXhwIjoyMDg3MDM0NzkyfQ.igBGIh5h82uoVA-EEjKmlLdYrLs1lnExf37pgQI5Ckw';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function executeSQL() {
  console.log('🔧 Enabling RLS on database tables...\n');

  const statements = [
    // 1. Enable RLS on core tables
    "ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.saved_visas ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY",
    
    // 2. Enable RLS on lawyer tables
    "ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.consultation_slots ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.lawyer_reviews ENABLE ROW LEVEL SECURITY",
    
    // 3. Enable RLS on marketplace tables
    "ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.marketplace_purchases ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY",
    
    // 4. Enable RLS on forum tables
    "ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY",
    
    // 5. Enable RLS on other tables
    "ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.user_visa_purchases ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.youtube_feeds ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.products ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.tracker_stats ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY",
  ];

  // Drop existing policies first
  const dropPolicies = [
    "DROP POLICY IF EXISTS \"Visas are viewable by everyone\" ON public.visas",
    "DROP POLICY IF EXISTS \"Profiles are viewable by everyone\" ON public.profiles",
    "DROP POLICY IF EXISTS \"Users can manage own saved visas\" ON public.saved_visas",
    "DROP POLICY IF EXISTS \"Tracker entries are viewable by everyone\" ON public.tracker_entries",
    "DROP POLICY IF EXISTS \"Bookings viewable by participants\" ON public.bookings",
  ];

  // Create new policies
  const createPolicies = [
    // Public tables - read only
    `CREATE POLICY "Visas are viewable by everyone" ON public.visas FOR SELECT USING (true)`,
    `CREATE POLICY "Document categories are viewable by everyone" ON public.document_categories FOR SELECT USING (true)`,
    `CREATE POLICY "Marketplace categories are viewable by everyone" ON public.marketplace_categories FOR SELECT USING (true)`,
    `CREATE POLICY "Forum categories are viewable by everyone" ON public.forum_categories FOR SELECT USING (true)`,
    `CREATE POLICY "Published news articles are viewable by everyone" ON public.news_articles FOR SELECT USING (is_published = true)`,
    `CREATE POLICY "YouTube feeds are viewable by everyone" ON public.youtube_feeds FOR SELECT USING (true)`,
    `CREATE POLICY "Platform settings are viewable by everyone" ON public.platform_settings FOR SELECT USING (true)`,
    `CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true)`,
    
    // Profiles
    `CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true)`,
    `CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id)`,
    `CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)`,
    
    // Saved visas
    `CREATE POLICY "Users can view own saved visas" ON public.saved_visas FOR SELECT USING (auth.uid() = user_id)`,
    `CREATE POLICY "Users can insert own saved visas" ON public.saved_visas FOR INSERT WITH CHECK (auth.uid() = user_id)`,
    `CREATE POLICY "Users can delete own saved visas" ON public.saved_visas FOR DELETE USING (auth.uid() = user_id)`,
    
    // Bookings
    `CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id)`,
    `CREATE POLICY "Users can insert own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id)`,
    `CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id)`,
    
    // Tracker entries
    `CREATE POLICY "Tracker entries are viewable by everyone" ON public.tracker_entries FOR SELECT USING (true)`,
    `CREATE POLICY "Authenticated users can create tracker entries" ON public.tracker_entries FOR INSERT WITH CHECK (auth.role() = 'authenticated')`,
    
    // Notifications
    `CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id)`,
    `CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id)`,
    
    // User documents
    `CREATE POLICY "Users can view own documents" ON public.user_documents FOR SELECT USING (auth.uid() = user_id)`,
    `CREATE POLICY "Users can insert own documents" ON public.user_documents FOR INSERT WITH CHECK (auth.uid() = user_id)`,
    
    // Lawyer profiles
    `CREATE POLICY "Lawyer profiles are viewable by everyone" ON public.lawyer_profiles FOR SELECT USING (true)`,
    `CREATE POLICY "Lawyers can update own profile" ON public.lawyer_profiles FOR UPDATE USING (auth.uid() = user_id)`,
    
    // Forum
    `CREATE POLICY "Forum topics are viewable by everyone" ON public.forum_topics FOR SELECT USING (true)`,
    `CREATE POLICY "Forum replies are viewable by everyone" ON public.forum_replies FOR SELECT USING (true)`,
    
    // Marketplace listings
    `CREATE POLICY "Active marketplace listings are viewable by everyone" ON public.marketplace_listings FOR SELECT USING (is_active = true)`,
    
    // Lawyer reviews
    `CREATE POLICY "Lawyer reviews are viewable by everyone" ON public.lawyer_reviews FOR SELECT USING (true)`,
    
    // Marketplace reviews
    `CREATE POLICY "Marketplace reviews are viewable by everyone" ON public.marketplace_reviews FOR SELECT USING (true)`,
  ];

  const allStatements = [...statements, ...dropPolicies, ...createPolicies];
  
  let success = 0;
  let failed = 0;
  const errors = [];

  for (const sql of allStatements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        // Try alternative method - direct query
        const { error: queryError } = await supabase.from('_temp_query').select('*').limit(0);
        
        // If exec_sql doesn't exist, we'll need to use the SQL Editor
        console.log(`⚠️  Could not execute via API: ${sql.substring(0, 50)}...`);
        failed++;
        errors.push({ sql: sql.substring(0, 80), error: error.message });
      } else {
        console.log(`✅ ${sql.substring(0, 60)}...`);
        success++;
      }
    } catch (err) {
      console.log(`⚠️  ${sql.substring(0, 60)}... - ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${success} succeeded, ${failed} failed`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors (showing first 5):');
    errors.slice(0, 5).forEach((e, i) => {
      console.log(`  ${i + 1}. ${e.sql}... - ${e.error}`);
    });
  }
  
  console.log('\n⚠️  Note: Direct SQL execution requires the exec_sql function.');
  console.log('   Please run the SQL in the Supabase Dashboard SQL Editor instead.');
}

executeSQL();
