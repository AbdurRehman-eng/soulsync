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
  // Check DB health - can we write to tables?
  console.log('=== Test 1: Can we write to profiles (update existing)? ===');
  const now = new Date().toISOString();
  const updateRes = await fetch(SUPABASE_URL + '/rest/v1/profiles?id=eq.8e606c93-60f5-4c11-9594-6c1b75ce360c', {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ updated_at: now })
  });
  console.log('Profile update:', updateRes.status, updateRes.status === 204 ? 'OK' : 'FAILED');

  // Check DB read-only mode
  console.log('\n=== Test 2: Can we insert into share_tracking? ===');
  const insertRes = await fetch(SUPABASE_URL + '/rest/v1/share_tracking', {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify({
      user_id: '8e606c93-60f5-4c11-9594-6c1b75ce360c',
      card_id: '00000000-0000-0000-0000-000000000000', 
      platform: 'other'
    })
  });
  const insertBody = await insertRes.text();
  console.log('Share tracking insert:', insertRes.status, insertBody.substring(0, 300));
  
  // Clean up test share
  if (insertRes.status === 201) {
    const data = JSON.parse(insertBody);
    if (data[0]?.id) {
      await fetch(SUPABASE_URL + '/rest/v1/share_tracking?id=eq.' + data[0].id, {
        method: 'DELETE', headers
      });
      console.log('Cleaned up test share');
    }
  }

  // Check if user_achievements insert works directly
  console.log('\n=== Test 3: Can we insert into user_achievements? ===');
  // Get one achievement ID
  const achRes = await fetch(SUPABASE_URL + '/rest/v1/achievements?select=id&is_active=eq.true&limit=1', { headers });
  const achievements = await achRes.json();
  if (achievements[0]) {
    const testAchRes = await fetch(SUPABASE_URL + '/rest/v1/user_achievements', {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({
        user_id: '8e606c93-60f5-4c11-9594-6c1b75ce360c',
        achievement_id: achievements[0].id,
        progress: 0,
        completed: false,
      })
    });
    const testAchBody = await testAchRes.text();
    console.log('User achievement insert:', testAchRes.status, testAchBody.substring(0, 300));
    
    // Clean up
    if (testAchRes.status === 201) {
      const data = JSON.parse(testAchBody);
      if (data[0]?.id) {
        await fetch(SUPABASE_URL + '/rest/v1/user_achievements?id=eq.' + data[0].id, {
          method: 'DELETE', headers
        });
        console.log('Cleaned up test achievement');
      }
    }
  }

  // Check if user_badges insert works
  console.log('\n=== Test 4: Can we insert into user_badges? ===');
  const newcomerBadge = await fetch(SUPABASE_URL + '/rest/v1/badges?select=id&name=eq.Newcomer', { headers });
  const badges = await newcomerBadge.json();
  if (badges[0]) {
    const testBadgeRes = await fetch(SUPABASE_URL + '/rest/v1/user_badges', {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({
        user_id: '8e606c93-60f5-4c11-9594-6c1b75ce360c',
        badge_id: badges[0].id,
      })
    });
    const testBadgeBody = await testBadgeRes.text();
    console.log('User badge insert:', testBadgeRes.status, testBadgeBody.substring(0, 300));
    
    // Clean up
    if (testBadgeRes.status === 201) {
      const data = JSON.parse(testBadgeBody);
      if (data[0]?.id) {
        await fetch(SUPABASE_URL + '/rest/v1/user_badges?id=eq.' + data[0].id, {
          method: 'DELETE', headers
        });
        console.log('Cleaned up test badge');
      }
    }
  }
  
  // Check database size / quota
  console.log('\n=== Test 5: Check for quota/size issues ===');
  const healthRes = await fetch(SUPABASE_URL + '/rest/v1/', { headers });
  console.log('REST API health:', healthRes.status);
  
  // Check auth health
  const authHealthRes = await fetch(SUPABASE_URL + '/auth/v1/health', {
    headers: { 'apikey': SERVICE_KEY }
  });
  console.log('Auth health:', authHealthRes.status, await authHealthRes.text());
}

run().catch(console.error);
