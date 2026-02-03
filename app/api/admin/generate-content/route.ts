import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Content generation prompts for each type
const GENERATION_PROMPTS = {
  verse: `Generate meaningful inspirational text with the following structure:
{
  "verse_text": "The complete text - can be a Bible verse, wisdom quote, philosophical saying, or inspirational passage (50-150 words)",
  "verse_reference": "Source attribution (e.g., 'John 3:16', 'Rumi', 'Ancient Wisdom', 'Marcus Aurelius', or 'Unknown')",
  "title": "A short, engaging title (2-5 words)",
  "subtitle": "Optional brief description of the theme"
}

Theme: {theme}
Content can be:
- Bible verses (NIV or NLT style)
- Quotes from philosophers, poets, or thinkers
- Wisdom from various spiritual or philosophical traditions
- Original inspirational passages

Make it uplifting, relevant, and easy to understand. Return only valid JSON.`,

  devotional: `Generate an inspirational reflection or message with the following structure:
{
  "title": "A compelling title (3-7 words)",
  "subtitle": "A brief subtitle describing the theme",
  "body": "A 150-250 word inspirational message that is encouraging, practical, and relatable. Can be a reflection, meditation, life lesson, or motivational message. Include a reflection question or actionable takeaway.",
  "author": "Soul Sync Team"
}

Theme: {theme}
Content can be:
- Personal reflections on life and growth
- Philosophical insights and wisdom
- Motivational messages for daily challenges
- Mindfulness and self-improvement guidance
- Universal spiritual principles

Make it warm, personal, authentic, and universally relatable without being preachy. Return only valid JSON.`,

  prayer: `Generate a heartfelt prayer, affirmation, or intention with the following structure:
{
  "title": "A meaningful title (2-5 words, e.g., 'Morning Prayer', 'Peace Affirmation', 'Daily Intention', 'Meditation for Strength')",
  "subtitle": null,
  "prayer_text": "A 100-150 word prayer, affirmation, meditation, or intention that is sincere, hopeful, and accessible. Use conversational, inclusive language."
}

Theme: {theme}
Content can be:
- Traditional prayers from various faiths
- Positive affirmations
- Mindfulness meditations
- Gratitude expressions
- Intention-setting statements
- Universal spiritual messages

Make it inclusive, comforting, and accessible to all beliefs. Return only valid JSON.`,

  motivational: `Generate an inspirational motivational quote with the following structure:
{
  "title": "A catchy, theme-related title (2-5 words, e.g., 'Rise and Shine', 'Stay Strong', 'Keep Moving Forward')",
  "subtitle": "Optional context or category (e.g., 'Words of wisdom', 'Daily motivation', or null)",
  "quote": "A powerful, memorable quote (15-40 words)",
  "quote_author": "The author's name (can be a famous person, thinker, or 'Unknown' if creating an original quote)"
}

Theme: {theme}
The quote can be:
- Famous quotes from well-known figures
- Original inspirational sayings
- Wisdom from various sources (not limited to religious texts)
- Motivational affirmations or positive messages

Make it uplifting, actionable, and universally relatable. Return only valid JSON.`,

  article: `Generate an informative article with the following structure:
{
  "title": "An engaging article title (4-8 words)",
  "subtitle": "A compelling subtitle",
  "body": "A 200-300 word article that is informative, practical, and encouraging. Include 3-5 actionable tips or insights. Use short paragraphs for readability.",
  "author": "Soul Sync Team",
  "read_time": 3
}

Topic: {theme}
Make it practical and relatable. Return only valid JSON.`,

  task: `Generate a meaningful daily task with the following structure:
{
  "title": "A clear, actionable task title (3-6 words)",
  "subtitle": "A brief description of what the user should do (10-20 words)",
  "description": "A motivating explanation of why this task matters (20-40 words)"
}

Theme: {theme}
Make it achievable and meaningful. Return only valid JSON.`,

  quiz: `Generate an educational quiz with the following structure:
{
  "title": "An engaging quiz title (4-7 words)",
  "subtitle": "What the quiz is about",
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}

Topic: {theme}
Create 3-5 questions. Make them educational but fun. Return only valid JSON.`,
};

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

    const { type, theme } = await request.json();

    if (!type || !GENERATION_PROMPTS[type as keyof typeof GENERATION_PROMPTS]) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    if (!theme || theme.trim().length < 3) {
      return NextResponse.json(
        { error: "Theme is required (minimum 3 characters)" },
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

    // Generate content
    const prompt = GENERATION_PROMPTS[type as keyof typeof GENERATION_PROMPTS].replace(
      "{theme}",
      theme
    );

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    // Parse the JSON response
    let generatedContent;
    try {
      generatedContent = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "AI generated invalid content. Please try again." },
        { status: 500 }
      );
    }

    // Build the final card content structure
    let content: any = {};
    let cardData: any = {
      type,
      title: generatedContent.title || `Generated ${type}`,
      subtitle: generatedContent.subtitle || null,
    };

    // Map generated content to card content structure
    switch (type) {
      case "verse":
        content = {
          verse_text: generatedContent.verse_text,
          verse_reference: generatedContent.verse_reference,
        };
        break;

      case "devotional":
      case "article":
        content = {
          body: generatedContent.body,
          author: generatedContent.author || "Soul Sync Team",
          read_time: generatedContent.read_time || 2,
        };
        break;

      case "prayer":
        content = {
          prayer_text: generatedContent.prayer_text,
        };
        break;

      case "motivational":
        content = {
          quote: generatedContent.quote,
          quote_author: generatedContent.quote_author || "Unknown",
        };
        break;

      case "task":
        content = {
          description: generatedContent.description || generatedContent.subtitle,
        };
        break;

      case "quiz":
        cardData.quiz_data = generatedContent.questions;
        content = {};
        break;

      default:
        content = generatedContent;
    }

    cardData.content = content;

    return NextResponse.json({
      success: true,
      data: cardData,
    });
  } catch (error: any) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate content" },
      { status: 500 }
    );
  }
}
