// TEST LIKE FEATURE
// Run this in your browser console to test the like functionality

// Test 1: Like a card
async function testLikeCard(cardId) {
  console.log(`=== Testing Like Card (${cardId}) ===`);
  const response = await fetch('/api/interactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ card_id: cardId, type: 'like' })
  });
  const data = await response.json();
  console.log('Like response:', data);
  return data;
}

// Test 2: Unlike a card
async function testUnlikeCard(cardId) {
  console.log(`=== Testing Unlike Card (${cardId}) ===`);
  const response = await fetch('/api/interactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ card_id: cardId, type: 'like' })
  });
  const data = await response.json();
  console.log('Unlike response:', data);
  return data;
}

// Test 3: Get all liked cards
async function testGetLikedCards() {
  console.log('=== Testing Get Liked Cards ===');
  const response = await fetch('/api/interactions?type=like');
  const data = await response.json();
  console.log(`Found ${data.cards?.length || 0} liked cards:`, data.cards);
  return data;
}

// Test 4: Toggle like (like then unlike)
async function testToggleLike(cardId) {
  console.log(`=== Testing Toggle Like (${cardId}) ===`);

  console.log('Step 1: Like the card');
  const likeResponse = await testLikeCard(cardId);

  console.log('\nStep 2: Check liked cards');
  await testGetLikedCards();

  console.log('\nStep 3: Unlike the card');
  const unlikeResponse = await testUnlikeCard(cardId);

  console.log('\nStep 4: Check liked cards again');
  await testGetLikedCards();

  return { likeResponse, unlikeResponse };
}

// Run all tests
async function runAllLikeTests() {
  console.log("Starting Like Feature Tests...\n");

  console.log("First, get a card ID from the feed...");
  const feedResponse = await fetch('/api/feed');
  const feedData = await feedResponse.json();

  if (!feedData.cards || feedData.cards.length === 0) {
    console.error("No cards in feed to test with!");
    return;
  }

  const testCardId = feedData.cards[0].id;
  console.log(`Using card ID: ${testCardId}\n`);

  // Run toggle test
  await testToggleLike(testCardId);

  console.log("\n=== Tests Complete ===");
  console.log("Check the logs above to verify:");
  console.log("1. Like response shows 'liked: true'");
  console.log("2. Liked cards list includes the card");
  console.log("3. Unlike response shows 'liked: false'");
  console.log("4. Liked cards list no longer includes the card");
}

// Instructions
console.log(`
LIKE FEATURE TEST INSTRUCTIONS:
================================

1. Make sure you're logged in
2. Run one of these commands:

   runAllLikeTests()              - Run complete test suite
   testLikeCard("card-id-here")   - Like a specific card
   testUnlikeCard("card-id-here") - Unlike a specific card
   testGetLikedCards()            - View all liked cards
   testToggleLike("card-id-here") - Test like then unlike

3. Check console logs and server logs for debugging
4. Visit /likes page to see the liked content UI
`);

// Export for easy access
window.testLikes = {
  all: runAllLikeTests,
  like: testLikeCard,
  unlike: testUnlikeCard,
  getLiked: testGetLikedCards,
  toggle: testToggleLike
};

console.log("Quick access: window.testLikes.all()");
