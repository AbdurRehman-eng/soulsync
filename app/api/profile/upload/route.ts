import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Use service client for storage operations (bypasses RLS)
    const serviceClient = await createServiceClient();

    // Get current profile to check for existing avatar
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    // Delete old avatar if exists
    if (profile?.avatar_url) {
      try {
        const bucketName = "profile-images";
        const bucketMarker = `/storage/v1/object/public/${bucketName}/`;
        const markerIndex = profile.avatar_url.indexOf(bucketMarker);

        if (markerIndex !== -1) {
          const oldFilePath = profile.avatar_url.substring(
            markerIndex + bucketMarker.length
          );
          if (oldFilePath) {
            await serviceClient.storage.from(bucketName).remove([oldFilePath]);
          }
        }
      } catch (deleteError) {
        console.warn("Could not delete old avatar:", deleteError);
      }
    }

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate file path
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await serviceClient.storage
      .from("profile-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Failed to upload image" },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = serviceClient.storage.from("profile-images").getPublicUrl(fileName);

    // Update profile in database
    const { error: updateError } = await serviceClient
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: updateError.message || "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      avatar_url: publicUrl,
    });
  } catch (error: any) {
    console.error("Profile upload error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
