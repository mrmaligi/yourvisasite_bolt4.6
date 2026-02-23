
import { createClient } from '@supabase/supabase-js'
import fs from 'fs';
import path from 'path';

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'zogfvzzizbbmmmnlzxdg';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const USER_ID = process.env.USER_ID || '588f4a9a-85af-4684-abe8-8c414992cf6c';
const VISA_ID = process.env.VISA_ID || '9287e029-9cf6-4f3f-befd-c1fb68b7f39b'; // Dummy default
const DOCS_PATH = process.env.DOCS_PATH || path.join(process.cwd(), 'p_visa');

if (!SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function getVisaId() {
  const { data, error } = await supabase
    .from('visas')
    .select('id')
    .eq('subclass_number', '820')
    .single();
  if (data) return data.id;
  return VISA_ID;
}

async function main() {
  console.log(`Starting document upload from ${DOCS_PATH}...`);

  const visaId = await getVisaId();
  console.log(`Using Visa ID: ${visaId}`);

  const filesToUpload = [
    { name: 'passport.pdf', path: 'Identity evidence/passport.pdf', category: 'identity' },
    { name: 'pr_visa.pdf', path: 'Identity evidence/pr_visa.pdf', category: 'identity' },
    { name: 'marriage_certificate.pdf', path: 'Marriage Documents/marriage_certificate.pdf', category: 'marriage' },
    { name: 'bank_statement.pdf', path: 'Financial Aspects/bank_statement.pdf', category: 'financial' },
    { name: 'home_loan.pdf', path: 'Financial Aspects/home_loan.pdf', category: 'financial' },
    { name: 'form_888_1.pdf', path: 'Social Aspects/form_888_1.pdf', category: 'social' },
    { name: 'form_888_2.pdf', path: 'Social Aspects/form_888_2.pdf', category: 'social' },
    { name: 'travel_itinerary.pdf', path: 'Nature of Commitment/travel_itinerary.pdf', category: 'commitment' }
  ];

  for (const file of filesToUpload) {
    const filePath = path.join(DOCS_PATH, file.path);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}. Creating empty file for testing...`);
      // Ensure directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, '');
    }

    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `${USER_ID}/${file.category}/${file.name}`;

    console.log(`Uploading ${file.name} to ${storagePath}...`);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error(`Upload failed for ${file.name}:`, uploadError.message);
    } else {
      console.log(`Upload successful: ${uploadData.path}`);

      const record = {
        user_id: USER_ID,
        visa_id: visaId,
        document_category: file.category, // Assuming schema uses 'document_category'
        file_name: file.name,
        storage_path: storagePath,
        status: 'pending',
        uploaded_at: new Date().toISOString()
      };

      const { error: dbError } = await supabase
        .from('user_documents')
        .insert(record);

      if (dbError) {
        console.error(`Database insert failed for ${file.name}:`, dbError.message);
        if (dbError.code === '42P01') {
             console.error('Table user_documents does not exist. Please run migrations first.');
        }
      } else {
        console.log(`Database record created for ${file.name}`);
      }
    }
  }
}

main();
