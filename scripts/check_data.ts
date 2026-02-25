import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking database counts...');

  // Check lawyer_profiles in public
  const { count: lawyerCount, error: lawyerError } = await supabase.from('lawyer_profiles').select('*', { count: 'exact', head: true });
  if (lawyerError) console.error('Lawyer Error (public):', JSON.stringify(lawyerError));
  else console.log('Lawyer Profiles (public):', lawyerCount);

  // Check marketplace_listings in lawyer schema
  const { count: mpCount, error: mpError } = await supabase.schema('lawyer').from('marketplace_listings').select('*', { count: 'exact', head: true });
  if (mpError) console.error('Marketplace Error (lawyer schema):', JSON.stringify(mpError));
  else console.log('Marketplace Listings (lawyer schema):', mpCount);

  // Check news_articles in public
  const { count: newsCount, error: newsError } = await supabase.from('news_articles').select('*', { count: 'exact', head: true });
  if (newsError) console.error('News Error (public):', JSON.stringify(newsError));
  else console.log('News Articles (public):', newsCount);
}

check();
