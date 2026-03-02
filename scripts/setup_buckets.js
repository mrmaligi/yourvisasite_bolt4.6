
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function main() {
  console.log('Creating buckets...')

  const buckets = ['documents', 'lawyer-credentials', 'avatars']

  for (const bucket of buckets) {
    const { data, error } = await supabase.storage.createBucket(bucket, {
      public: false, // restrictive by default
      allowedMimeTypes: null, // allow all
      fileSizeLimit: null // allow all
    })

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`Bucket '${bucket}' already exists.`)
      } else {
        console.error(`Error creating bucket '${bucket}':`, error.message)
      }
    } else {
      console.log(`Bucket '${bucket}' created successfully.`)
    }
  }
}

main()
