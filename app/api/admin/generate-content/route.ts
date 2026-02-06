import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ── GLOBAL RULES injected into every content generation prompt ──
const GLOBAL_RULES = `
IMPORTANT RULES (apply to ALL generated content):
1. BIBLE VERSION: If you include ANY Bible verse or scripture reference, you MUST use the King James Version (KJV) EXCLUSIVELY. Never use NIV, ESV, NLT, NASB, or any other translation. Quote the exact KJV wording.
2. CHILD-FRIENDLY: All content must be appropriate for ages 10+. Use simple, warm, encouraging language. No profanity, innuendo, graphic descriptions, scary imagery, or adult-only topics.
3. REFERENCES: When citing a Bible verse, always include the full reference (e.g., "John 3:16 KJV") and the complete verse text from the King James Version.
`;

// Content generation prompts for each type
const GENERATION_PROMPTS = {
  verse: `Generate a Bible verse card with the following structure:
{
  "verse_text": "The EXACT text of the Bible verse from the King James Version (KJV). Must be word-for-word KJV.",
  "verse_reference": "The Bible reference (e.g., 'John 3:16 KJV', 'Philippians 4:13 KJV')",
  "title": "A short, engaging title (2-5 words)",
  "subtitle": "Optional brief description of the theme"
}

${GLOBAL_RULES}

Theme: {theme}

Guidelines:
- The verse_text MUST be the exact King James Version wording — do NOT paraphrase or modernise
- Choose a verse that is uplifting, relevant to the theme, and easy for young people to understand
- If the KJV wording is archaic, that's fine — the app will display it as-is
- The title should be catchy and child-friendly

Return only valid JSON.`,

  devotional: `Generate a faith-based devotional reflection with the following structure:
{
  "title": "A compelling title (3-7 words)",
  "subtitle": "A brief subtitle describing the theme",
  "body": "A 150-250 word devotional message. If you reference any Bible verse, you MUST quote the exact King James Version (KJV) text and include the reference (e.g., Proverbs 3:5-6 KJV). The message should be encouraging, practical, and relatable for young people and families. Include a reflection question or actionable takeaway.",
  "author": "Soul Sync Team"
}

${GLOBAL_RULES}

Theme: {theme}

Guidelines:
- Include at least one KJV Bible verse reference with the full verse text
- Write in a warm, personal tone suitable for ages 10+
- Avoid complex theological jargon — keep it accessible
- End with an encouraging reflection question or practical action step

Return only valid JSON.`,

  prayer: `Generate a heartfelt Christian prayer with the following structure:
{
  "title": "A meaningful title (2-5 words, e.g., 'Morning Prayer', 'Prayer for Peace', 'Prayer for Guidance')",
  "subtitle": null,
  "prayer_text": "A 100-150 word prayer that is sincere, hopeful, and appropriate for young people and families. If you include any scripture, use the exact King James Version (KJV) wording."
}

${GLOBAL_RULES}

Theme: {theme}

Guidelines:
- Write in a conversational, reverent tone appropriate for all ages
- May optionally weave in KJV scripture naturally within the prayer
- Keep the language warm, comforting, and child-friendly
- Avoid heavy or frightening imagery

Return only valid JSON.`,

  motivational: `Generate an inspirational motivational quote with the following structure:
{
  "title": "A catchy, theme-related title (2-5 words, e.g., 'Rise and Shine', 'Stay Strong', 'Keep Moving Forward')",
  "subtitle": "Optional context or category (e.g., 'Words of wisdom', 'Daily motivation', or null)",
  "quote": "A powerful, memorable quote (15-40 words). If the quote is from or references the Bible, it MUST be the exact KJV wording.",
  "quote_author": "The author's name (can be a famous person, or 'Unknown' if creating an original quote)"
}

${GLOBAL_RULES}

Theme: {theme}

Guidelines:
- The quote should be uplifting, positive, and appropriate for young people
- If using a Bible verse as the quote, use the exact KJV text and set quote_author to the reference (e.g., "Proverbs 3:5 KJV")
- Make it actionable and universally encouraging

Return only valid JSON.`,

  article: `Generate an informative, faith-friendly article with the following structure:
{
  "title": "An engaging article title (4-8 words)",
  "subtitle": "A compelling subtitle",
  "body": "A 200-300 word article that is informative, practical, and encouraging. Include 3-5 actionable tips or insights. Use short paragraphs for readability. If you reference any Bible verse, you MUST quote the exact King James Version (KJV) text with the reference.",
  "author": "Soul Sync Team",
  "read_time": 3
}

${GLOBAL_RULES}

Topic: {theme}

Guidelines:
- Write in clear, simple language suitable for ages 10+
- Any Bible references must use KJV exclusively
- Include practical, actionable advice
- Keep paragraphs short for mobile readability

Return only valid JSON.`,

  task: `Generate a meaningful daily task with the following structure:
{
  "title": "A clear, actionable task title (3-6 words)",
  "subtitle": "A brief description of what the user should do (10-20 words)",
  "description": "A motivating explanation of why this task matters (20-40 words). If referencing scripture, use KJV."
}

${GLOBAL_RULES}

Theme: {theme}

Guidelines:
- Make the task achievable for young people and adults alike
- Keep language positive, warm, and encouraging
- The task should be something that can be done in a day

Return only valid JSON.`,

  quiz: `Generate an educational Bible/faith quiz with the following structure:
{
  "title": "An engaging quiz title (4-7 words)",
  "subtitle": "What the quiz is about",
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Brief explanation of the correct answer. If quoting scripture, use the exact KJV text."
    }
  ]
}

${GLOBAL_RULES}

Topic: {theme}

Guidelines:
- Create 3-5 questions suitable for young people and families
- All Bible references and quotes must use King James Version (KJV) exclusively
- Make questions educational but fun — test understanding, not just memorisation
- Explanations should teach something new in simple, child-friendly language
- Avoid trick questions or overly complex theology

Return only valid JSON.`,
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
