
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const users = [
  {
    email: 'admin@visabuild.local',
    password: 'password123',
    role: 'admin',
    full_name: 'Admin User'
  },
  {
    email: 'lawyer@visabuild.local',
    password: 'password123',
    role: 'lawyer',
    full_name: 'Lawyer User'
  },
  {
    email: 'applicant@visabuild.local',
    password: 'password123',
    role: 'user',
    full_name: 'Applicant User'
  }
]

async function main() {
  console.log('Creating test users...')

  for (const user of users) {
    // 1. Create User
    let userId;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.full_name }
    })

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
        console.log(`User ${user.email} already exists. Fetching ID...`)
        const { data: listData, error: listError } = await supabase.auth.admin.listUsers()
        if (listError) {
            console.error('Error listing users:', listError)
            continue
        }
        const existingUser = listData.users.find(u => u.email === user.email)
        if (existingUser) {
          userId = existingUser.id
          console.log(`Found existing ID: ${userId}`)
        } else {
          console.error(`Could not find existing user ${user.email} in list`)
          continue
        }
      } else {
        console.error(`Error creating user ${user.email}:`, authError.message)
        continue
      }
    } else {
      userId = authData?.user?.id
      console.log(`User ${user.email} created. ID: ${userId}`)
    }

    if (!userId) continue

    // 2. Update/Insert Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (profile) {
      console.log(`Profile for ${user.email} exists. Updating role to ${user.role}...`)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: user.role, full_name: user.full_name })
        .eq('id', userId)

      if (updateError) console.error(`Error updating profile for ${user.email}:`, updateError.message)
      else console.log(`Profile updated for ${user.email}`)
    } else {
      console.log(`Profile for ${user.email} does not exist. Inserting...`)
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          role: user.role,
          full_name: user.full_name
        })

      if (insertError) {
           console.error(`Error inserting profile for ${user.email}:`, insertError.message)
      } else {
        console.log(`Profile inserted for ${user.email}`)
      }
    }
  }
}

main()
