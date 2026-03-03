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
  // Query pg_graphql to get function definitions  
  console.log('=== Querying pg_graphql for function info ===');
  
  // pg_graphql exposes the public schema. Let's see if there's a way to get
  // function metadata through it
  const introspectionQuery = {
    query: `{
      __schema {
        types {
          name
        }
      }
    }`
  };
  
  const gqlRes = await fetch(SUPABASE_URL + '/graphql/v1', {
    method: 'POST',
    headers,
    body: JSON.stringify(introspectionQuery)
  });
  const gqlData = await gqlRes.json();
  
  // Look for types that might contain function info
  const types = gqlData?.data?.__schema?.types?.map(t => t.name).filter(n => 
    n.toLowerCase().includes('proc') || 
    n.toLowerCase().includes('func') ||
    n.toLowerCase().includes('trigger')
  );
  console.log('Relevant GraphQL types:', types);

  // Let's try a different approach - use the Supabase database through a webhook or edge function
  // Actually, let's just try to fix the trigger by creating a NEW function that works

  // The approach: create a wrapper function via PostgREST that we can use for signup
  // Since we can't CREATE FUNCTION via PostgREST, let's use the admin user creation API
  // but catch and handle the error differently

  console.log('\n=== Testing if we can create users by disabling trigger first ===');
  
  // Approach: Create user via admin API, catch the 500, then manually insert the profile
  // The problem is: if the trigger fails, the auth.user INSERT is rolled back too
  
  // Let's check what Supabase version/endpoint supports SQL execution
  console.log('\n=== Checking Supabase dashboard SQL API ===');
  
  // Try the newer /sql endpoint that some Supabase versions support
  const sqlEndpoints = [
    SUPABASE_URL + '/rest/v1/rpc/exec',
    SUPABASE_URL + '/sql',
    SUPABASE_URL + '/api/v1/sql',
  ];

  for (const ep of sqlEndpoints) {
    try {
      const res = await fetch(ep, { method: 'POST', headers, body: JSON.stringify({ query: 'SELECT 1' }) });
      console.log(`${ep}: ${res.status}`);
    } catch (e) {
      console.log(`${ep}: ERROR`);
    }
  }

  // Last resort: check if the user has the Supabase access token set somewhere
  console.log('\n=== Supabase Management API ===');
  console.log('The fix requires running SQL in the Supabase dashboard.');
  console.log('The handle_new_user trigger is broken and blocking ALL new signups.');
  console.log('');
  console.log('IMPORTANT: Go to Supabase Dashboard > SQL Editor and run:');
  console.log('');
  
  const fixSQL = `
-- First, check what the current trigger function looks like:
SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user';

-- Then fix it:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    CONCAT('SS', UPPER(SUBSTRING(MD5(NEW.id::text) FROM 1 FOR 8)))
  )
  ON CONFLICT (id) DO UPDATE SET
    username = COALESCE(EXCLUDED.username, profiles.username),
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    referral_code = COALESCE(profiles.referral_code, EXCLUDED.referral_code);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;
  console.log(fixSQL);
}

run().catch(console.error);
