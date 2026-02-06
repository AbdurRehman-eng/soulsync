// Check and display AR game data from the database
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkARGames() {
  console.log('\n=== Checking AR Games ===\n');

  // Get all game cards
  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('*')
    .eq('type', 'game')
    .order('created_at', { ascending: false });

  if (cardsError) {
    console.error('Error fetching cards:', cardsError);
    return;
  }

  console.log(`Found ${cards.length} game cards\n`);

  // Check each game card's data
  for (const card of cards) {
    console.log(`\n--- Card: "${card.title}" (ID: ${card.id}) ---`);

    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('card_id', card.id)
      .single();

    if (gameError) {
      console.log('  ❌ No game data found');
      console.log('  Error:', gameError.message);
      continue;
    }

    console.log('  Game ID:', game.id);
    console.log('  Is AR Game:', game.is_ar_game);
    console.log('  AR Type:', game.ar_type);
    console.log('  AR Config:', game.ar_config ? JSON.stringify(game.ar_config, null, 2) : 'NULL');
    console.log('  Difficulty:', game.difficulty);
    console.log('  Instructions:', game.instructions?.substring(0, 50) + '...');

    // Check if this would render as AR game
    const willRenderAsAR = game.is_ar_game && game.ar_type && game.ar_config;
    console.log(`  \n  Will render as AR Game: ${willRenderAsAR ? '✅ YES' : '❌ NO'}`);

    if (!willRenderAsAR) {
      console.log('  Issue: Missing required fields for AR game');
      if (!game.is_ar_game) console.log('    - is_ar_game is false or null');
      if (!game.ar_type) console.log('    - ar_type is missing');
      if (!game.ar_config) console.log('    - ar_config is missing');
    }
  }

  console.log('\n=== Check Complete ===\n');
}

checkARGames().catch(console.error);
