import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    // Rate limiting - simple in-memory check
    // In production, use Redis or database-based rate limiting

    // Get the model (using Gemini 2.5 Flash - fast and efficient)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Start chat with history
    const chat = model.startChat({
      history,
    });

    // Send the latest message
    const latestMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(latestMessage.content);
    const response = await result.response;
    const text = response.text();

    // Save conversation to database if user is logged in
    if (user) {
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
    }

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
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
        { error: "Failed to fetch chat history" },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: messages?.reverse() || [] });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
