import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) envVars[m[1].trim()] = m[2].trim();
});
const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': 'Bearer ' + SERVICE_KEY,
  'Content-Type': 'application/json',
};

async function run() {
  // 1. Try to get trigger function source via GraphQL introspection
  console.log('=== Checking function definition via GraphQL ===');
  try {
    const gqlRes = await fetch(SUPABASE_URL + '/graphql/v1', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: `{ __schema { queryType { name } } }`
      })
    });
    console.log('GraphQL status:', gqlRes.status);
  } catch (e) {
    console.log('GraphQL error:', e.message);
  }

  // 2. Check if there's a way to execute SQL - try the /pg endpoint
  console.log('\n=== Trying /pg endpoint ===');
  try {
    const pgRes = await fetch(SUPABASE_URL + '/pg', { headers });
    console.log('/pg status:', pgRes.status);
  } catch (e) {
    console.log('/pg error:', e.message);
  }

  // 3. Check the existing user's profile very carefully
  console.log('\n=== Existing profile details ===');
  const profileRes = await fetch(SUPABASE_URL + '/rest/v1/profiles?select=*', { headers });
  const profiles = await profileRes.json();
  console.log(JSON.stringify(profiles, null, 2));

  // 4. Check if there are any NOT NULL constraints that might cause issues
  // by checking information_schema.columns for the profiles table
  console.log('\n=== Checking profiles table constraints ===');
  // We can't query information_schema directly through PostgREST, but we can check
  // what the user_achievements and user_badges tables look like
  const badgesRes = await fetch(SUPABASE_URL + '/rest/v1/user_badges?select=*&limit=5', { headers });
  console.log('user_badges:', JSON.stringify(await badgesRes.json()));

  const achievRes = await fetch(SUPABASE_URL + '/rest/v1/user_achievements?select=*&limit=3', { headers });
  console.log('user_achievements:', JSON.stringify(await achievRes.json()));

  // 5. Try to check the Supabase project logs
  console.log('\n=== Checking Supabase logs ===');
  try {
    const logsRes = await fetch(`https://api.supabase.com/v1/projects/kxgelcwkfpyjytwhocst/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: "SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user'"
      })
    });
    console.log('Management API status:', logsRes.status);
    const logBody = await logsRes.text();
    console.log('Management API response:', logBody.substring(0, 500));
  } catch (e) {
    console.log('Management API error:', e.message);
  }
  
  // 6. Try the new Supabase SQL endpoint
  console.log('\n=== Trying SQL via /rest/v1/rpc ===');
  // Create a temp function to get function source
  const createDiagSql = `
    CREATE OR REPLACE FUNCTION public.debug_get_fn_src(fn_name text)
    RETURNS text AS $$
    DECLARE
      src text;
    BEGIN
      SELECT prosrc INTO src FROM pg_proc WHERE proname = fn_name LIMIT 1;
      RETURN src;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  // Can't create functions via PostgREST, so let's try a workaround
  // Try calling any existing function that might help
  const fnListRes = await fetch(SUPABASE_URL + '/rest/v1/rpc/get_setting', {
    method: 'POST',
    headers,
    body: JSON.stringify({ setting_name: 'server_version' })
  });
  console.log('get_setting status:', fnListRes.status);
  if (fnListRes.status === 200) {
    console.log('Postgres version:', await fnListRes.text());
  }
}

run().catch(console.error);
