
import { createClient } from '@supabase/supabase-js'

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'zogfvzzizbbmmmnlzxdg';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const USER_ID = process.env.USER_ID || '588f4a9a-85af-4684-abe8-8c414992cf6c';
const VISA_SUBCLASS = process.env.VISA_SUBCLASS || '820';

if (!SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function getVisaId() {
  const { data, error } = await supabase
    .from('visas')
    .select('id')
    .eq('subclass_number', VISA_SUBCLASS)
    .single();
  if (data) return data.id;
  const { data: data2 } = await supabase
    .from('visas')
    .select('id')
    .eq('subclass', VISA_SUBCLASS)
    .single();
  if (data2) return data2.id;
  return null;
}

async function main() {
  console.log(`Unlocking premium content for user ${USER_ID} for visa ${VISA_SUBCLASS}...`);

  const visaId = await getVisaId();
  if (!visaId) {
      console.error(`Visa ID for ${VISA_SUBCLASS} not found.`);
      return;
  }
  console.log(`Using Visa ID: ${visaId}`);

  const record = {
    user_id: USER_ID,
    visa_id: visaId,
    amount_cents: 4900,
    purchased_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('user_visa_purchases')
    .insert(record);

  if (error) {
    console.error(`Purchase creation failed:`, error.message);
    if (error.code === '42P01') {
      console.error('Table user_visa_purchases does not exist. Please run migrations first.');
    }
  } else {
    console.log('Purchase record created successfully.');
  }
}

main();
