import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `You are Soul Buddy, a warm, supportive AI companion in the Soul Sync app - a faith-based mental health and motivation platform powered by Google Gemini.

Your personality:
- Warm, empathetic, and encouraging
- Faith-positive but respectful of all beliefs
- Focused on mental wellness and positive mindset
- Never preachy or judgmental
- Uses simple, clear language
- Occasionally uses appropriate emojis to make responses friendly

Your capabilities:
- Share relevant Bible verses with book, chapter, and verse references (e.g., "Philippians 4:13")
- Provide the actual verse text when sharing scripture
- Answer questions about faith, spirituality, and Christian teachings
- Offer daily motivation and encouragement
- Share inspirational quotes and uplifting stories
- Help users process their emotions from a faith perspective
- Suggest positive, faith-based coping strategies
- Provide context and explanation for biblical passages when asked

Guidelines for Bible verses:
- When sharing a verse, always include the reference (Book Chapter:Verse) and the full text
- Choose verses that are relevant to the user's situation or question
- Briefly explain how the verse applies to their situation
- Use King James Version of the bible only

General guidelines:
- Keep responses concise but meaningful (2-5 sentences typically)
- Be supportive but don't provide medical or professional mental health advice
- For serious mental health concerns, gently suggest speaking with a professional counselor or therapist
- For spiritual guidance, encourage connecting with their local faith community
- Focus on hope, healing, and positive growth
- Remember: you're a supportive friend and spiritual companion, not a therapist or pastor

When users seem to be in distress, always prioritize their safety and well-being, and encourage professional help when appropriate.`;

// Model names to try in order of preference
const MODEL_CANDIDATES = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

async function getWorkingModel(genAI: GoogleGenerativeAI) {
  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
      });
      // Quick test to verify the model is accessible
      return { model, modelName };
    } catch (err) {
      console.warn(`Model ${modelName} not available, trying next...`);
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json(
        { error: "AI service is not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "A non-empty messages array is required" },
        { status: 400 }
      );
    }

    // Get a working model
    const modelResult = await getWorkingModel(genAI);
    if (!modelResult) {
      console.error("No Gemini model could be initialized");
      return NextResponse.json(
        { error: "AI service is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const { model, modelName } = modelResult;

    // Build history from all messages except the last one
    const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Ensure history alternates correctly (Gemini requires user/model alternation)
    // Filter out any consecutive same-role messages
    const cleanHistory: typeof history = [];
    for (const entry of history) {
      if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== entry.role) {
        cleanHistory.push(entry);
      }
    }

    // Gemini requires the first message in history to be from "user"
    // If it starts with "model", remove it
    if (cleanHistory.length > 0 && cleanHistory[0].role === "model") {
      cleanHistory.shift();
    }

    // Start chat with cleaned history
    const chat = model.startChat({
      history: cleanHistory,
    });

    // Send the latest message
    const latestMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(latestMessage.content);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      return NextResponse.json(
        { error: "AI returned an empty response. Please try rephrasing your message." },
        { status: 502 }
      );
    }

    // Save conversation to database if user is logged in
    if (user) {
      try {
        // Save user message
        await supabase.from("chat_messages").insert({
          user_id: user.id,
          role: "user",
          content: latestMessage.content,
        });

        // Save assistant response
        await supabase.from("chat_messages").insert({
          user_id: user.id,
          role: "assistant",
          content: text,
        });
      } catch (dbError) {
        // Don't fail the whole request if saving to DB fails
        console.error("Failed to save chat messages to database:", dbError);
      }
    }

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("Chat API error:", error);

    // Parse specific Gemini errors
    const errorMessage = error?.message || String(error);

    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key")) {
      return NextResponse.json(
        { error: "AI service authentication failed. Please contact the administrator." },
        { status: 503 }
      );
    }

    if (errorMessage.includes("SAFETY") || errorMessage.includes("blocked")) {
      return NextResponse.json(
        { error: "Your message couldn't be processed due to content safety filters. Please try rephrasing." },
        { status: 400 }
      );
    }

    if (errorMessage.includes("quota") || errorMessage.includes("RATE_LIMIT") || errorMessage.includes("429")) {
      return NextResponse.json(
        { error: "AI service is busy right now. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    if (errorMessage.includes("not found") || errorMessage.includes("404")) {
      return NextResponse.json(
        { error: "AI model is not available. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching chat history:", error);
      return NextResponse.json(
        { error: "Failed to load chat history" },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: messages?.reverse() || [] });
  } catch (error) {
    console.error("Chat history API error:", error);
    return NextResponse.json(
      { error: "Failed to load chat history" },
      { status: 500 }
    );
  }
}

// Delete chat history
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting chat history:", error);
      return NextResponse.json(
        { error: "Failed to delete chat history" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Chat history deleted" });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
