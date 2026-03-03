import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) envVars[m[1].trim()] = m[2].trim();
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function run() {
  // Step 1: Check what triggers exist on profiles
  console.log('=== Step 1: Check trigger function source ===');
  const { data: fnData, error: fnError } = await supabase.rpc('pg_get_functiondef', { function_oid: 0 }).single();
  if (fnError) {
    console.log('Cannot use pg_get_functiondef (expected), trying alternative...');
  }

  // Step 2: Try to get function source by calling a query through supabase-js
  // Since we can't run raw SQL through supabase-js, let's try to use 
  // supabase edge functions or the SQL API

  // Step 3: Try fixing the trigger by creating a helper function first
  console.log('\n=== Step 2: Create diagnostic helper function ===');
  
  // Since we can't run raw SQL, let's try the database webhook/function approach
  // Let's check if there's a way to execute SQL through supabase-js
  
  // Actually, the best approach: use fetch to call the Supabase database API endpoint
  const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;
  const PROJECT_REF = 'kxgelcwkfpyjytwhocst';

  // Try the newer Supabase query endpoint
  const endpoints = [
    `${SUPABASE_URL}/rest/v1/rpc/exec_sql`,
    `${SUPABASE_URL}/pg/query`,
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
  ];

  const sql = `SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')`;
  
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': 'Bearer ' + SERVICE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql })
      });
      console.log(`${endpoint}: ${res.status}`);
      if (res.status === 200) {
        console.log('Response:', await res.text());
      }
    } catch (e) {
      console.log(`${endpoint}: ${e.message}`);
    }
  }

  // Step 3: Since we can't run SQL directly, let's try to fix it via a different approach
  // Create a profile manually to test what error we get
  console.log('\n=== Step 3: Test manual profile insert (simulating trigger) ===');
  
  // First, let's check what happens when we try to insert into profiles
  // with the existing user's ID (should conflict on PK)
  const { data: insertData, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: '00000000-0000-0000-0000-000000000099',
      username: 'test_manual_' + Date.now(),
      display_name: 'Test Manual'
    })
    .select()
    .single();
  
  if (insertError) {
    console.log('Insert error code:', insertError.code);
    console.log('Insert error message:', insertError.message);
    console.log('Insert error details:', insertError.details);
    console.log('Insert error hint:', insertError.hint);
  } else {
    console.log('Insert succeeded! Cleaning up...');
    await supabase.from('profiles').delete().eq('id', '00000000-0000-0000-0000-000000000099');
  }

  // Step 4: Check if the issue is with the initialize_user_gamification trigger
  // by checking if all required tables and data exist
  console.log('\n=== Step 4: Check gamification tables health ===');
  
  const { count: achCount } = await supabase
    .from('achievements')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  console.log('Active achievements count:', achCount);

  const { count: badgeCount } = await supabase
    .from('badges')
    .select('*', { count: 'exact', head: true });
  console.log('Total badges count:', badgeCount);

  const { data: newcomerBadge } = await supabase
    .from('badges')
    .select('*')
    .eq('name', 'Newcomer')
    .single();
  console.log('Newcomer badge:', newcomerBadge ? 'EXISTS (id: ' + newcomerBadge.id + ')' : 'MISSING');
}

run().catch(console.error);
