// TEST FEED API
// Run this in your browser console to test what the API returns

// Test 1: Fetch feed without mood
async function testFeedWithoutMood() {
  console.log("=== Testing Feed API (No Mood) ===");
  const response = await fetch('/api/feed');
  const data = await response.json();
  console.log(`Received ${data.cards?.length || 0} cards:`, data.cards);
  return data;
}

// Test 2: Fetch feed with mood
async function testFeedWithMood(moodId) {
  console.log(`=== Testing Feed API (Mood: ${moodId}) ===`);
  const response = await fetch(`/api/feed?mood_id=${moodId}`);
  const data = await response.json();
  console.log(`Received ${data.cards?.length || 0} cards:`, data.cards);
  return data;
}

// Test 3: Clear cache and re-fetch
async function clearCacheAndTest() {
  console.log("=== Clearing Cache ===");
  const clearResponse = await fetch('/api/feed/clear-cache', { method: 'POST' });
  const clearData = await clearResponse.json();
  console.log("Cache cleared:", clearData);

  console.log("=== Re-fetching Feed ===");
  const response = await fetch('/api/feed');
  const data = await response.json();
  console.log(`Received ${data.cards?.length || 0} cards:`, data.cards);
  return data;
}

// Run all tests
async function runAllTests() {
  console.log("Starting Feed API Tests...\n");

  await testFeedWithoutMood();
  console.log("\n");

  await clearCacheAndTest();
  console.log("\n");

  console.log("Tests complete. Check the logs above.");
  console.log("If you only see 3 cards, run the COMPLETE_FEED_FIX.sql script in Supabase.");
}

// Instructions
console.log(`
INSTRUCTIONS:
1. Open your browser console (F12)
2. Run one of these commands:

   runAllTests()          - Run all feed tests
   testFeedWithoutMood()  - Test feed without mood
   clearCacheAndTest()    - Clear cache and test

3. Check the console output to see how many cards are returned
4. If you only see 3 cards, run COMPLETE_FEED_FIX.sql in Supabase
`);

// Auto-export for easy use
window.testFeed = {
  all: runAllTests,
  noMood: testFeedWithoutMood,
  withMood: testFeedWithMood,
  clearAndTest: clearCacheAndTest
};

console.log("Quick access: window.testFeed.all()");
