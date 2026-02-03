# AR Games Feature Guide

## Overview

The AR Games feature allows admins to generate simple, faith-based AR games using AI. Games are displayed as cards in the user feed and can be played directly in the browser using WebGL-based 3D graphics.

## Features

### AI-Powered Game Generation
- Uses Gemini AI to generate game configurations based on themes
- Automatically detects if a game idea is too complex
- Suggests simpler alternatives when needed
- Supports 6 different AR game types

### Simple AR Game Types

1. **Balloon Pop** - Tap balloons that float upward
2. **Target Tap** - Hit targets that appear at different locations
3. **Catch Game** - Catch objects falling from above
4. **Memory Match** - Find and match pairs of AR objects
5. **Reaction Time** - Tap objects as quickly as possible
6. **Spatial Puzzle** - Simple position-based puzzles

### Game Configuration

Each AR game has customizable settings:
- **Object Type**: balloon, target, coin, star, gift, heart
- **Object Color**: Any hex color
- **Spawn Rate**: 1-10 (controls difficulty)
- **Game Time**: 30-120 seconds
- **Target Score**: Points needed to win
- **Sound Effects**: Enable/disable game sounds
- **Haptic Feedback**: Vibration on object hits
- **Theme**: colorful, minimal, nature, spiritual
- **Special Effects**: particles, trails, glow

## Admin Usage

### Creating an AR Game

1. Go to **Admin Panel → Cards**
2. Click **"AR Game Generator"** button
3. Enter a game theme (e.g., "Pop gratitude balloons")
4. Select difficulty: Easy, Medium, or Hard
5. Click **"Generate AR Game with AI"**

### Reviewing Generated Games

If the AI determines the game is suitable:
- Review the generated title, instructions, and configuration
- Adjust settings as needed (colors, spawn rate, time, etc.)
- Preview the AR config
- Click **"Create AR Game"** to publish

If the game is too complex:
- AI will explain why it's too complex
- View 2-3 simpler alternative suggestions
- Click any suggestion to try generating it instead

### Examples

**Good Themes** (Simple, suitable for AR):
- "Pop gratitude balloons"
- "Catch blessings from heaven"
- "Tap away worries"
- "Find hidden stars of hope"
- "Collect hearts of kindness"

**Too Complex** (Will be flagged):
- "Racing game with cars"
- "3D adventure quest"
- "Fighting game with characters"
- "Puzzle game with physics"
- "Multiplayer battle arena"

## User Experience

### Playing AR Games

1. Users see AR game cards in their daily feed
2. Tap to open the AR game viewer
3. Read instructions on the ready screen
4. Press **"Start Game"** to begin
5. Tap/touch objects to score points
6. Try to reach the target score before time runs out
7. Earn points rewards upon completion

### Game HUD

- **Top Left**: Close button
- **Top Right**: Timer, Score, Sound toggle
- **Progress Bar**: Shows progress toward target score
- **Start Screen**: Instructions and game info
- **End Screen**: Final score and replay option

### Gameplay Features

- **Touch/Click Controls**: Tap objects to interact
- **Sound Effects**: Audio feedback on hits (can be toggled)
- **Haptic Feedback**: Vibration on mobile devices
- **Particle Effects**: Visual feedback when objects are hit
- **Score Tracking**: Real-time score updates
- **Victory Detection**: Celebration when target is reached

## Technical Details

### Database Structure

AR games extend the existing `games` table:

```sql
ALTER TABLE games ADD COLUMN:
  - is_ar_game BOOLEAN (identifies AR games)
  - ar_type TEXT (game type: balloon_pop, target_tap, etc.)
  - ar_config JSONB (game configuration object)
```

### TypeScript Interfaces

```typescript
export type ARGameType =
  | "balloon_pop"
  | "target_tap"
  | "catch_game"
  | "memory_match"
  | "reaction_time"
  | "spatial_puzzle";

export interface ARGameConfig {
  objectType: "balloon" | "target" | "coin" | "star" | "gift" | "heart";
  objectColor: string;
  spawnRate: number; // 1-10
  gameTime: number; // seconds
  targetScore: number;
  difficulty: "easy" | "medium" | "hard";
  soundEnabled: boolean;
  hapticEnabled: boolean;
  theme: "colorful" | "minimal" | "nature" | "spiritual";
  specialEffects: string[];
}
```

### API Endpoints

**POST /api/admin/generate-ar-game**
- Generates AR game configuration using Gemini AI
- Input: `{ theme: string, difficulty: string }`
- Output: Game data or complexity warning with suggestions

### Components

1. **ARGameGeneratorModal** - Admin interface for creating games
2. **ARGameViewer** - User interface for playing games
3. Three.js integration for 3D rendering

## Migration

To enable AR games in your database:

```bash
# Run the migration
psql your_database < supabase/migrations/20260203_add_ar_games.sql
```

Or execute in Supabase SQL Editor:
```sql
-- See supabase/migrations/20260203_add_ar_games.sql
```

## Best Practices

### For Admins

1. **Keep Games Simple**: Focus on tap-based interactions
2. **Test Difficulty**: Easy = slow, Medium = moderate, Hard = fast
3. **Match Theme to Audience**: Faith-based, uplifting themes
4. **Set Reasonable Targets**: Easy (50-100pts), Medium (100-200pts), Hard (200-500pts)
5. **Use Meaningful Themes**: Tie games to spiritual/wellness concepts

### For Developers

1. **Performance**: Games use Three.js with optimized rendering
2. **Mobile Support**: Touch events and haptic feedback included
3. **Browser Compatibility**: WebGL required (modern browsers)
4. **Responsiveness**: Games adapt to screen size
5. **Accessibility**: Consider adding audio cues and color contrast

## Troubleshooting

### Game Won't Generate
- Check API key is set: `process.env.GEMINI_API_KEY`
- Simplify the theme
- Try a different difficulty level

### Game Marked as Too Complex
- This is by design - try the suggested alternatives
- Simplify your theme to tap-based interactions
- Avoid themes requiring complex animations or navigation

### Game Doesn't Display
- Ensure migration was run
- Check if `is_ar_game` flag is set correctly
- Verify `ar_type` and `ar_config` are not null

### Performance Issues
- Reduce `spawnRate` in game config
- Disable special effects for slower devices
- Lower `maxScore` to create shorter games

## Future Enhancements

Potential improvements:
- AR.js integration for marker-based AR
- WebXR API for immersive AR experiences
- More game types (puzzle, maze, rhythm)
- Multiplayer/leaderboard features
- Custom 3D model uploads
- Advanced particle systems
- Power-ups and bonuses

## Support

For issues or questions:
1. Check this documentation
2. Review `app/api/admin/generate-ar-game/route.ts` for API logic
3. Check browser console for errors
4. Ensure Three.js is properly installed
5. Verify database migration was applied

---

**Version**: 1.0
**Last Updated**: February 3, 2026
**Dependencies**: Three.js, Gemini AI, Supabase
