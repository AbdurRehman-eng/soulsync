import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET - Fetch all app settings
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabase.from("app_settings").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    const { data: settings, error } = await query.order("key");

    if (error) throw error;

    // Convert to key-value object for easier access
    const settingsObject: Record<string, any> = {};
    settings?.forEach((setting) => {
      let value: any = setting.value;

      // Parse value based on type
      switch (setting.value_type) {
        case "number":
          value = parseFloat(setting.value);
          break;
        case "boolean":
          value = setting.value === "true";
          break;
        case "json":
          try {
            value = JSON.parse(setting.value);
          } catch {
            value = setting.value;
          }
          break;
      }

      settingsObject[setting.key] = value;
    });

    return NextResponse.json({
      settings: settingsObject,
      raw: settings, // Include raw data with metadata
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Update app settings (Admin only)
// ============================================
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "Invalid settings format" },
        { status: 400 }
      );
    }

    // Update each setting
    const updates = [];
    for (const [key, value] of Object.entries(settings)) {
      // Convert value to string
      let stringValue: string;
      let valueType: string;

      if (typeof value === "number") {
        stringValue = value.toString();
        valueType = "number";
      } else if (typeof value === "boolean") {
        stringValue = value.toString();
        valueType = "boolean";
      } else if (typeof value === "object") {
        stringValue = JSON.stringify(value);
        valueType = "json";
      } else {
        stringValue = String(value);
        valueType = "string";
      }

      updates.push(
        supabase
          .from("app_settings")
          .upsert({
            key,
            value: stringValue,
            value_type: valueType,
            updated_by: user.id,
          })
          .eq("key", key)
      );
    }

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update a single setting (Admin only)
// ============================================
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { error: "Setting key is required" },
        { status: 400 }
      );
    }

    // Convert value to string
    let stringValue: string;
    let valueType: string;

    if (typeof value === "number") {
      stringValue = value.toString();
      valueType = "number";
    } else if (typeof value === "boolean") {
      stringValue = value.toString();
      valueType = "boolean";
    } else if (typeof value === "object") {
      stringValue = JSON.stringify(value);
      valueType = "json";
    } else {
      stringValue = String(value);
      valueType = "string";
    }

    const { error } = await supabase
      .from("app_settings")
      .upsert({
        key,
        value: stringValue,
        value_type: valueType,
        updated_by: user.id,
      })
      .eq("key", key);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Setting updated successfully",
    });
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}
