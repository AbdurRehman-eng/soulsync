import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function generateReferralCode(userId: string): string {
  const hash = crypto.createHash("md5").update(userId).digest("hex");
  return `SS${hash.substring(0, 8).toUpperCase()}`;
}

// POST - Process a referral after signup
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

    const body = await request.json();
    const { referralCode } = body;

    if (!referralCode || typeof referralCode !== "string") {
      return NextResponse.json(
        { error: "Referral code is required" },
        { status: 400 }
      );
    }

    const trimmedCode = referralCode.trim().toUpperCase();

    // Use service client to bypass RLS — referral processing needs to read/write
    // another user's profile and insert transactions for both users
    const serviceClient = createServiceClient();

    // Get the new user's profile
    const { data: newUserProfile, error: profileError } = await serviceClient
      .from("profiles")
      .select("id, referred_by, referral_code")
      .eq("id", user.id)
      .single();

    if (profileError || !newUserProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Already referred — skip silently
    if (newUserProfile.referred_by) {
      return NextResponse.json({
        success: true,
        alreadyReferred: true,
        message: "Referral already processed",
      });
    }

    // Find the referrer by their referral code
    const { data: referrer, error: referrerError } = await serviceClient
      .from("profiles")
      .select("id, points, xp, total_referrals, referral_code")
      .eq("referral_code", trimmedCode)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 400 }
      );
    }

    // Can't refer yourself
    if (referrer.id === user.id) {
      return NextResponse.json(
        { error: "Cannot use your own referral code" },
        { status: 400 }
      );
    }

    // Get referral reward settings (with defaults)
    const { data: settings } = await serviceClient
      .from("app_settings")
      .select("key, value")
      .in("key", [
        "referral_referrer_points",
        "referral_referrer_xp",
        "referral_new_user_points",
        "referral_new_user_xp",
      ]);

    const referrerPoints = parseInt(
      settings?.find((s) => s.key === "referral_referrer_points")?.value || "25"
    );
    const referrerXP = parseInt(
      settings?.find((s) => s.key === "referral_referrer_xp")?.value || "50"
    );
    const newUserPoints = parseInt(
      settings?.find((s) => s.key === "referral_new_user_points")?.value || "10"
    );
    const newUserXP = parseInt(
      settings?.find((s) => s.key === "referral_new_user_xp")?.value || "20"
    );

    // Set referred_by on the new user
    const { error: updateRefError } = await serviceClient
      .from("profiles")
      .update({ referred_by: referrer.id })
      .eq("id", user.id);

    if (updateRefError) {
      console.error("Failed to set referred_by:", updateRefError);
      return NextResponse.json(
        { error: "Failed to process referral" },
        { status: 500 }
      );
    }

    // Update referrer's total_referrals and reward them
    const newTotalReferrals = (referrer.total_referrals || 0) + 1;
    const { error: updateReferrerError } = await serviceClient
      .from("profiles")
      .update({
        total_referrals: newTotalReferrals,
        points: (referrer.points || 0) + referrerPoints,
        xp: (referrer.xp || 0) + referrerXP,
        updated_at: new Date().toISOString(),
      })
      .eq("id", referrer.id);

    if (updateReferrerError) {
      console.error("Failed to update referrer:", updateReferrerError);
    }

    // Log referrer's reward transactions
    await serviceClient.from("points_transactions").insert({
      user_id: referrer.id,
      amount: referrerPoints,
      source: "referral",
      description: "Referral reward — new user signed up with your code",
      multiplier: 1.0,
    });

    await serviceClient.from("xp_transactions").insert({
      user_id: referrer.id,
      amount: referrerXP,
      source: "referral",
      description: "Referral reward — new user signed up with your code",
    });

    // Give the new user a welcome bonus
    const { data: newProfile } = await serviceClient
      .from("profiles")
      .select("points, xp")
      .eq("id", user.id)
      .single();

    if (newProfile) {
      const { error: newUserUpdateError } = await serviceClient
        .from("profiles")
        .update({
          points: (newProfile.points || 0) + newUserPoints,
          xp: (newProfile.xp || 0) + newUserXP,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (newUserUpdateError) {
        console.error("Failed to update new user points:", newUserUpdateError);
      }

      await serviceClient.from("points_transactions").insert({
        user_id: user.id,
        amount: newUserPoints,
        source: "referral",
        description: "Welcome bonus — signed up with a referral code",
        multiplier: 1.0,
      });

      await serviceClient.from("xp_transactions").insert({
        user_id: user.id,
        amount: newUserXP,
        source: "referral",
        description: "Welcome bonus — signed up with a referral code",
      });
    } else {
      console.error("Could not fetch new user profile for welcome bonus");
    }

    // Log in referral_tracking table (if it exists)
    serviceClient.from("referral_tracking").insert({
      referrer_id: referrer.id,
      referred_id: user.id,
      referral_code: trimmedCode,
      referrer_points_awarded: referrerPoints,
      referrer_xp_awarded: referrerXP,
      referred_points_awarded: newProfile ? newUserPoints : 0,
      referred_xp_awarded: newProfile ? newUserXP : 0,
    }).then(() => {}).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Referral processed successfully",
      rewards: {
        referrerPoints,
        referrerXP,
        newUserPoints,
        newUserXP,
      },
    });
  } catch (error) {
    console.error("Error processing referral:", error);
    return NextResponse.json(
      { error: "Failed to process referral" },
      { status: 500 }
    );
  }
}

// GET - Get or generate user's referral code
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service client to bypass RLS — need to query other users' referred_by
    // and check for referral code collisions across all profiles
    const serviceClient = createServiceClient();

    const { data: profile } = await serviceClient
      .from("profiles")
      .select("referral_code, total_referrals, referred_by")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    let referralCode = profile.referral_code;

    // Generate one if missing
    if (!referralCode) {
      referralCode = generateReferralCode(user.id);

      // Handle unlikely collision
      const { data: existing } = await serviceClient
        .from("profiles")
        .select("id")
        .eq("referral_code", referralCode)
        .neq("id", user.id)
        .maybeSingle();

      if (existing) {
        referralCode = `SS${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
      }

      await serviceClient
        .from("profiles")
        .update({ referral_code: referralCode })
        .eq("id", user.id);
    }

    // Get live referral count
    const { count: referralCount } = await serviceClient
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("referred_by", user.id);

    // Get reward settings so the UI can display them
    const { data: settings } = await serviceClient
      .from("app_settings")
      .select("key, value")
      .in("key", [
        "referral_referrer_points",
        "referral_referrer_xp",
        "referral_new_user_points",
        "referral_new_user_xp",
      ]);

    return NextResponse.json({
      referralCode,
      totalReferrals: referralCount || 0,
      hasBeenReferred: !!profile.referred_by,
      rewards: {
        referrerPoints: parseInt(
          settings?.find((s) => s.key === "referral_referrer_points")?.value || "25"
        ),
        referrerXP: parseInt(
          settings?.find((s) => s.key === "referral_referrer_xp")?.value || "50"
        ),
        newUserPoints: parseInt(
          settings?.find((s) => s.key === "referral_new_user_points")?.value || "10"
        ),
        newUserXP: parseInt(
          settings?.find((s) => s.key === "referral_new_user_xp")?.value || "20"
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching referral info:", error);
    return NextResponse.json(
      { error: "Failed to fetch referral info" },
      { status: 500 }
    );
  }
}
