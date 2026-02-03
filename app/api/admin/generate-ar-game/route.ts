import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const AR_GAME_GENERATION_PROMPT = `You are an AR game designer for a faith-based wellness app. Generate a simple AR game based on the theme: {theme} at {difficulty} difficulty level.

IMPORTANT: Only suggest games that are SIMPLE and can be implemented with basic AR interactions:
- balloon_pop: Tap balloons that appear in AR space
- target_tap: Tap targets that appear at different locations
- catch_game: Catch falling objects with device movement
- memory_match: Find and match AR objects in space
- reaction_time: Tap objects as quickly as possible
- spatial_puzzle: Simple position-based puzzles

If the requested theme is TOO COMPLEX for a simple AR game (e.g., requires complex 3D navigation, multiplayer, physics simulations, or detailed character animations), you MUST return isTooComplex: true and suggest 2-3 simpler alternatives.

Examples of TOO COMPLEX themes:
- "Racing game with cars"
- "3D adventure quest"
- "Fighting game"
- "Complex puzzle with physics"
- "Detailed storytelling game"

Examples of SUITABLE themes:
- "Pop gratitude balloons"
- "Catch blessings from heaven"
- "Find hidden stars of hope"
- "Match Bible verse pairs"
- "Tap away worries"

Return ONLY valid JSON in this EXACT format:

If the theme is TOO COMPLEX:
{
  "isTooComplex": true,
  "reason": "Explain why this is too complex for simple AR",
  "suggestions": [
    {
      "title": "Alternative game title",
      "description": "Brief description of the simpler alternative",
      "arType": "balloon_pop|target_tap|catch_game|memory_match|reaction_time|spatial_puzzle"
    }
  ]
}

If the theme is SUITABLE:
{
  "isTooComplex": false,
  "title": "Engaging game title (3-6 words)",
  "subtitle": "Brief description of the game experience",
  "instructions": "Clear instructions on how to play (2-3 sentences)",
  "arType": "balloon_pop|target_tap|catch_game|memory_match|reaction_time|spatial_puzzle",
  "arConfig": {
    "objectType": "balloon|target|coin|star|gift|heart",
    "objectColor": "#hex_color (choose based on theme)",
    "spawnRate": 1-10 (1=slow, 10=very fast),
    "gameTime": 30-120 (seconds),
    "targetScore": 50-1000 (points needed to win),
    "difficulty": "{difficulty}",
    "soundEnabled": true,
    "hapticEnabled": true,
    "theme": "colorful|minimal|nature|spiritual",
    "specialEffects": ["particles", "trails", "glow"] (array of effects)
  },
  "pointsReward": 10-50 (based on difficulty),
  "maxScore": 100-2000
}

Guidelines:
- Keep games SIMPLE and quick to play (30-120 seconds)
- Use spiritual/positive themes appropriate for a faith-based app
- Match difficulty: easy (slow, low target), medium (moderate), hard (fast, high target)
- Colors should be uplifting and match the theme
- Object types should match the theme (e.g., "blessings" = star/gift, "worries" = balloon)
- Be honest about complexity - if unsure, mark as too complex

Return ONLY the JSON object, no additional text or formatting.`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { theme, difficulty = "medium" } = await request.json();

    if (!theme || theme.trim().length < 3) {
      return NextResponse.json(
        { error: "Theme is required (minimum 3 characters)" },
        { status: 400 }
      );
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json(
        { error: "Difficulty must be easy, medium, or hard" },
        { status: 400 }
      );
    }

    // Get the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // Generate AR game
    const prompt = AR_GAME_GENERATION_PROMPT
      .replace("{theme}", theme)
      .replace("{difficulty}", difficulty)
      .replace("{difficulty}", difficulty); // Replace second occurrence too

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    // Parse the JSON response
    let gameData;
    try {
      gameData = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "AI generated invalid content. Please try again." },
        { status: 500 }
      );
    }

    // Check if the game is too complex
    if (gameData.isTooComplex) {
      return NextResponse.json({
        success: true,
        tooComplex: true,
        reason: gameData.reason,
        suggestions: gameData.suggestions || [],
      });
    }

    // Validate the game data
    if (!gameData.title || !gameData.arType || !gameData.arConfig) {
      return NextResponse.json(
        { error: "Invalid game format generated. Please try again." },
        { status: 500 }
      );
    }

    // Validate AR config
    const validArTypes = [
      "balloon_pop",
      "target_tap",
      "catch_game",
      "memory_match",
      "reaction_time",
      "spatial_puzzle",
    ];

    if (!validArTypes.includes(gameData.arType)) {
      return NextResponse.json(
        { error: "Invalid AR game type generated" },
        { status: 500 }
      );
    }

    // Ensure config has required fields with defaults
    const arConfig = {
      objectType: gameData.arConfig.objectType || "star",
      objectColor: gameData.arConfig.objectColor || "#fbbf24",
      spawnRate: Math.max(1, Math.min(10, gameData.arConfig.spawnRate || 5)),
      gameTime: Math.max(30, Math.min(120, gameData.arConfig.gameTime || 60)),
      targetScore: Math.max(50, Math.min(1000, gameData.arConfig.targetScore || 100)),
      difficulty: difficulty,
      soundEnabled: gameData.arConfig.soundEnabled !== false,
      hapticEnabled: gameData.arConfig.hapticEnabled !== false,
      theme: gameData.arConfig.theme || "colorful",
      specialEffects: Array.isArray(gameData.arConfig.specialEffects)
        ? gameData.arConfig.specialEffects
        : ["particles"],
    };

    return NextResponse.json({
      success: true,
      tooComplex: false,
      data: {
        title: gameData.title,
        subtitle: gameData.subtitle || `A ${difficulty} AR game about ${theme}`,
        instructions: gameData.instructions || "Tap objects to score points!",
        arType: gameData.arType,
        arConfig: arConfig,
        pointsReward: gameData.pointsReward || (difficulty === "hard" ? 30 : difficulty === "medium" ? 20 : 10),
        maxScore: gameData.maxScore || arConfig.targetScore * 2,
        difficulty: difficulty,
      },
    });
  } catch (error: any) {
    console.error("AR game generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate AR game" },
      { status: 500 }
    );
  }
}
