import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const QUIZ_GENERATION_PROMPT = `Generate an educational and engaging quiz about {theme} with {numQuestions} questions at {difficulty} difficulty level.

Return ONLY valid JSON in this EXACT format:
{
  "title": "An engaging quiz title (4-7 words)",
  "subtitle": "A brief description of what the quiz covers",
  "questions": [
    {
      "question": "The question text (clear and specific)",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Brief explanation of why this is the correct answer (1-2 sentences)"
    }
  ]
}

Guidelines:
- Make questions educational but engaging
- All 4 options should be plausible to avoid obvious answers
- Questions should test understanding, not just memorization
- Explanations should teach something new or reinforce the concept
- For {difficulty} difficulty:
  * easy: straightforward questions with clear answers
  * medium: requires some thought and knowledge
  * hard: complex questions that test deep understanding
- Questions should be appropriate for a faith-based audience
- Avoid controversial or divisive topics
- Use clear, simple language

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

    const { theme, numQuestions = 5, difficulty = "medium" } = await request.json();

    if (!theme || theme.trim().length < 3) {
      return NextResponse.json(
        { error: "Theme is required (minimum 3 characters)" },
        { status: 400 }
      );
    }

    if (numQuestions < 3 || numQuestions > 20) {
      return NextResponse.json(
        { error: "Number of questions must be between 3 and 20" },
        { status: 400 }
      );
    }

    // Get the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
    });

    // Generate quiz
    const prompt = QUIZ_GENERATION_PROMPT
      .replace("{theme}", theme)
      .replace("{numQuestions}", numQuestions.toString())
      .replace("{difficulty}", difficulty)
      .replace("{difficulty}", difficulty); // Replace second occurrence too

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    // Parse the JSON response
    let quizData;
    try {
      quizData = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "AI generated invalid content. Please try again." },
        { status: 500 }
      );
    }

    // Validate the quiz data
    if (!quizData.title || !quizData.questions || !Array.isArray(quizData.questions)) {
      return NextResponse.json(
        { error: "Invalid quiz format generated. Please try again." },
        { status: 500 }
      );
    }

    // Ensure each question has the required fields
    const validatedQuestions = quizData.questions.map((q: any, index: number) => ({
      question: q.question || `Question ${index + 1}`,
      options: Array.isArray(q.options) && q.options.length === 4
        ? q.options
        : ["Option A", "Option B", "Option C", "Option D"],
      correct_answer: typeof q.correct_answer === "number" && q.correct_answer >= 0 && q.correct_answer < 4
        ? q.correct_answer
        : 0,
      explanation: q.explanation || "Correct!",
    }));

    return NextResponse.json({
      success: true,
      data: {
        title: quizData.title,
        subtitle: quizData.subtitle || `A ${difficulty} quiz about ${theme}`,
        questions: validatedQuestions,
      },
    });
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
