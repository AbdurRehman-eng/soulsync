import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== "string" || username.length < 3) {
      return NextResponse.json({ available: false, error: "Invalid username" });
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      console.error("Username check error:", error);
      return NextResponse.json({ available: true });
    }

    return NextResponse.json({ available: !data });
  } catch (error) {
    console.error("Username check failed:", error);
    return NextResponse.json({ available: true });
  }
}
