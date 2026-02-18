import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20MB for audio
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];

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

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    const name = formData.get("name") as string;
    const duration = parseFloat(formData.get("duration") as string) || null;

    // Validate required fields
    if (!audioFile || !name) {
      return NextResponse.json(
        { error: "Audio file and name are required" },
        { status: 400 }
      );
    }

    // Validate audio file
    if (!ALLOWED_AUDIO_TYPES.includes(audioFile.type)) {
      return NextResponse.json(
        { error: "Audio must be MP3, WAV, or OGG format" },
        { status: 400 }
      );
    }

    if (audioFile.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        { error: "Audio file size must be less than 20MB" },
        { status: 400 }
      );
    }

    // Upload audio to Supabase Storage
    const audioFileName = `ar-music/${Date.now()}-${audioFile.name}`;
    const audioBuffer = await audioFile.arrayBuffer();

    const { data: audioData, error: audioError } = await supabase.storage
      .from("ar-assets")
      .upload(audioFileName, audioBuffer, {
        contentType: audioFile.type,
        upsert: false,
      });

    if (audioError) {
      console.error("Audio upload error:", audioError);
      return NextResponse.json(
        { error: "Failed to upload audio file" },
        { status: 500 }
      );
    }

    // Get public URL for audio
    const { data: { publicUrl: audioUrl } } = supabase.storage
      .from("ar-assets")
      .getPublicUrl(audioFileName);

    // Insert AR music into database
    const { data: music, error: dbError } = await supabase
      .from("ar_world_music")
      .insert({
        name,
        audio_url: audioUrl,
        duration,
        is_active: true,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Clean up uploaded file
      await supabase.storage.from("ar-assets").remove([audioFileName]);
      return NextResponse.json(
        { error: "Failed to save AR music to database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      music,
    });
  } catch (error: any) {
    console.error("AR music upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload AR music" },
      { status: 500 }
    );
  }
}

// Get all AR music
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: music, error } = await supabase
      .from("ar_world_music")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch AR music:", error);
      return NextResponse.json(
        { error: "Failed to fetch AR music" },
        { status: 500 }
      );
    }

    return NextResponse.json({ music });
  } catch (error: any) {
    console.error("AR music fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch AR music" },
      { status: 500 }
    );
  }
}
