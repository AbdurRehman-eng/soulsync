import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for 3D models
const ALLOWED_MODEL_TYPES = ["model/gltf-binary", "model/gltf+json", "application/octet-stream"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
    const modelFile = formData.get("model") as File | null;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string | null;
    const scale = parseFloat(formData.get("scale") as string) || 1.0;

    // Validate required fields
    if (!modelFile || !name || !type) {
      return NextResponse.json(
        { error: "Model file, name, and type are required" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["animal", "tree", "object", "decoration"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be one of: animal, tree, object, decoration" },
        { status: 400 }
      );
    }

    // Validate model file
    if (!ALLOWED_MODEL_TYPES.includes(modelFile.type) && !modelFile.name.endsWith(".glb") && !modelFile.name.endsWith(".gltf")) {
      return NextResponse.json(
        { error: "Model must be a GLB or GLTF file" },
        { status: 400 }
      );
    }

    if (modelFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Model file size must be less than 50MB" },
        { status: 400 }
      );
    }

    // Validate thumbnail if provided
    if (thumbnailFile && !ALLOWED_IMAGE_TYPES.includes(thumbnailFile.type)) {
      return NextResponse.json(
        { error: "Thumbnail must be JPEG, PNG, or WebP" },
        { status: 400 }
      );
    }

    // Upload model to Supabase Storage
    const modelFileName = `ar-assets/${Date.now()}-${modelFile.name}`;
    const modelBuffer = await modelFile.arrayBuffer();

    const { data: modelData, error: modelError } = await supabase.storage
      .from("ar-assets")
      .upload(modelFileName, modelBuffer, {
        contentType: modelFile.type,
        upsert: false,
      });

    if (modelError) {
      console.error("Model upload error:", modelError);
      return NextResponse.json(
        { error: "Failed to upload model file" },
        { status: 500 }
      );
    }

    // Get public URL for model
    const { data: { publicUrl: modelUrl } } = supabase.storage
      .from("ar-assets")
      .getPublicUrl(modelFileName);

    // Upload thumbnail if provided
    let thumbnailUrl = null;
    let thumbnailFileName = null;
    if (thumbnailFile) {
      thumbnailFileName = `ar-assets/thumbnails/${Date.now()}-${thumbnailFile.name}`;
      const thumbnailBuffer = await thumbnailFile.arrayBuffer();

      const { data: thumbnailData, error: thumbnailError } = await supabase.storage
        .from("ar-assets")
        .upload(thumbnailFileName, thumbnailBuffer, {
          contentType: thumbnailFile.type,
          upsert: false,
        });

      if (!thumbnailError) {
        const { data: { publicUrl } } = supabase.storage
          .from("ar-assets")
          .getPublicUrl(thumbnailFileName);
        thumbnailUrl = publicUrl;
      }
    }

    // Insert AR asset into database
    const { data: asset, error: dbError } = await supabase
      .from("ar_assets")
      .insert({
        name,
        type,
        model_url: modelUrl,
        thumbnail_url: thumbnailUrl,
        scale,
        description,
        is_active: true,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Clean up uploaded files
      await supabase.storage.from("ar-assets").remove([modelFileName]);
      if (thumbnailUrl) {
        await supabase.storage.from("ar-assets").remove([thumbnailFileName]);
      }
      return NextResponse.json(
        { error: "Failed to save AR asset to database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      asset,
    });
  } catch (error: any) {
    console.error("AR asset upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload AR asset" },
      { status: 500 }
    );
  }
}

// Get all AR assets
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let query = supabase
      .from("ar_assets")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (type) {
      query = query.eq("type", type);
    }

    const { data: assets, error } = await query;

    if (error) {
      console.error("Failed to fetch AR assets:", error);
      return NextResponse.json(
        { error: "Failed to fetch AR assets" },
        { status: 500 }
      );
    }

    return NextResponse.json({ assets });
  } catch (error: any) {
    console.error("AR asset fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch AR assets" },
      { status: 500 }
    );
  }
}
