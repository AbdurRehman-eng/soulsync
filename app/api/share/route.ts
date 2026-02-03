import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// POST - Track share and award rewards
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

    const body = await request.json();
    const { cardId, platform, referralCode } = body;

    if (!cardId || !platform) {
      return NextResponse.json(
        { error: "Card ID and platform are required" },
        { status: 400 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    // Check for active bonus events
    const today = new Date().toISOString().split("T")[0];
    const { data: bonusEvents } = await supabase
      .from("bonus_events")
      .select("*")
      .eq("is_active", true)
      .eq("event_type", "social_surge")
      .or(`start_date.is.null,start_date.lte.${today}`)
      .or(`end_date.is.null,end_date.gte.${today}`);

    let multiplier = 1.0;
    let bonusActive = false;
    let bonusEvent = null;

    if (bonusEvents && bonusEvents.length > 0) {
      bonusEvent = bonusEvents[0];
      multiplier = bonusEvent.multiplier;
      bonusActive = true;
    }

    // Get share reward settings from database
    const { data: shareSettings } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", ["share_points", "share_xp"]);

    const basePoints = parseFloat(
      shareSettings?.find((s) => s.key === "share_points")?.value || "5"
    );
    const baseXP = parseFloat(
      shareSettings?.find((s) => s.key === "share_xp")?.value || "10"
    );

    // Calculate platform multiplier
    let platformMultiplier = 1.0;
    const platformBonuses: Record<string, number> = {
      facebook: 1.2,
      twitter: 1.2,
      instagram: 1.3,
      whatsapp: 1.1,
      copy_link: 1.0,
      other: 1.0,
    };

    platformMultiplier = platformBonuses[platform] || 1.0;

    // Final multiplier
    const finalMultiplier = multiplier * platformMultiplier;

    // Calculate rewards
    const pointsReward = Math.floor(basePoints * finalMultiplier);
    const xpReward = Math.floor(baseXP * finalMultiplier);

    // Track the share
    const { error: shareError } = await supabase
      .from("share_tracking")
      .insert({
        user_id: user.id,
        card_id: cardId,
        platform,
        referral_code: referralCode || profile.referral_code,
      });

    if (shareError) throw shareError;

    // Create card interaction for share
    await supabase.from("card_interactions").insert({
      user_id: user.id,
      card_id: cardId,
      interaction_type: "share",
    });

    // Update profile
    const newTotalShares = (profile.total_shares || 0) + 1;
    const newPoints = profile.points + pointsReward;
    const newXP = (profile.xp || 0) + xpReward;

    await supabase
      .from("profiles")
      .update({
        total_shares: newTotalShares,
        points: newPoints,
        xp: newXP,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    // Log transactions
    await supabase.from("points_transactions").insert({
      user_id: user.id,
      amount: pointsReward,
      source: "share",
      source_id: cardId,
      description: `Shared on ${platform}`,
      multiplier: finalMultiplier,
    });

    await supabase.from("xp_transactions").insert({
      user_id: user.id,
      amount: xpReward,
      source: "share",
      source_id: cardId,
      description: `Shared on ${platform}`,
    });

    // Get share milestone settings from database
    const { data: milestoneSettings } = await supabase
      .from("app_settings")
      .select("key, value")
      .or(
        "key.like.share_%_milestone_points,key.like.share_%_milestone_xp"
      );

    // Check for share milestones
    const milestones = [
      {
        count: 5,
        points: parseFloat(milestoneSettings?.find((s) => s.key === "share_5_milestone_points")?.value || "20"),
        xp: parseFloat(milestoneSettings?.find((s) => s.key === "share_5_milestone_xp")?.value || "30"),
        name: "Sharer"
      },
      {
        count: 10,
        points: parseFloat(milestoneSettings?.find((s) => s.key === "share_10_milestone_points")?.value || "50"),
        xp: parseFloat(milestoneSettings?.find((s) => s.key === "share_10_milestone_xp")?.value || "75"),
        name: "Social Butterfly"
      },
      {
        count: 25,
        points: parseFloat(milestoneSettings?.find((s) => s.key === "share_25_milestone_points")?.value || "100"),
        xp: parseFloat(milestoneSettings?.find((s) => s.key === "share_25_milestone_xp")?.value || "150"),
        name: "Influencer"
      },
      {
        count: 50,
        points: parseFloat(milestoneSettings?.find((s) => s.key === "share_50_milestone_points")?.value || "200"),
        xp: parseFloat(milestoneSettings?.find((s) => s.key === "share_50_milestone_xp")?.value || "300"),
        name: "Ambassador"
      },
      {
        count: 100,
        points: parseFloat(milestoneSettings?.find((s) => s.key === "share_100_milestone_points")?.value || "500"),
        xp: parseFloat(milestoneSettings?.find((s) => s.key === "share_100_milestone_xp")?.value || "750"),
        name: "Evangelist"
      },
    ];

    const achievements: any[] = [];

    for (const milestone of milestones) {
      if (newTotalShares === milestone.count) {
        // Award milestone bonus
        await supabase.from("points_transactions").insert({
          user_id: user.id,
          amount: milestone.points,
          source: "milestone",
          description: `${milestone.name} milestone reached!`,
          multiplier: 1.0,
        });

        await supabase.from("xp_transactions").insert({
          user_id: user.id,
          amount: milestone.xp,
          source: "milestone",
          description: `${milestone.name} milestone reached!`,
        });

        await supabase
          .from("profiles")
          .update({
            points: newPoints + milestone.points,
          })
          .eq("id", user.id);

        achievements.push({
          type: "milestone",
          name: milestone.name,
          message: `Milestone reached: ${milestone.count} shares! 🎉`,
          points: milestone.points,
          xp: milestone.xp,
        });

        // Check for badge
        const { data: badge } = await supabase
          .from("badges")
          .select("*")
          .eq("name", milestone.name)
          .single();

        if (badge) {
          const { error: badgeError } = await supabase
            .from("user_badges")
            .insert({
              user_id: user.id,
              badge_id: badge.id,
            });

          if (!badgeError) {
            achievements.push({
              type: "badge",
              name: badge.name,
              message: `New badge unlocked: ${badge.name}!`,
              badge,
            });
          }
        }
      }
    }

    // Update share achievement progress
    const { data: shareAchievements } = await supabase
      .from("achievements")
      .select("*")
      .eq("requirement_type", "total_shares")
      .eq("is_active", true);

    if (shareAchievements) {
      for (const achievement of shareAchievements) {
        const { data: userAchievement } = await supabase
          .from("user_achievements")
          .select("*")
          .eq("user_id", user.id)
          .eq("achievement_id", achievement.id)
          .single();

        if (!userAchievement) {
          await supabase.from("user_achievements").insert({
            user_id: user.id,
            achievement_id: achievement.id,
            progress: newTotalShares,
            completed: newTotalShares >= (achievement.requirement_value || 0),
            completed_at:
              newTotalShares >= (achievement.requirement_value || 0)
                ? new Date().toISOString()
                : null,
          });
        } else if (!userAchievement.completed) {
          const completed =
            newTotalShares >= (achievement.requirement_value || 0);

          await supabase
            .from("user_achievements")
            .update({
              progress: newTotalShares,
              completed,
              completed_at: completed ? new Date().toISOString() : null,
            })
            .eq("id", userAchievement.id);

          if (completed) {
            achievements.push({
              type: "achievement",
              name: achievement.name,
              message: `Achievement unlocked: ${achievement.name}!`,
              points: achievement.points_reward,
              xp: achievement.xp_reward,
              icon: achievement.badge_icon,
            });

            // Award achievement rewards
            if (achievement.points_reward > 0) {
              await supabase.from("points_transactions").insert({
                user_id: user.id,
                amount: achievement.points_reward,
                source: "achievement",
                source_id: achievement.id,
                description: `Achievement: ${achievement.name}`,
                multiplier: 1.0,
              });

              await supabase
                .from("profiles")
                .update({
                  points: newPoints + achievement.points_reward,
                })
                .eq("id", user.id);
            }

            if (achievement.xp_reward > 0) {
              await supabase.from("xp_transactions").insert({
                user_id: user.id,
                amount: achievement.xp_reward,
                source: "achievement",
                source_id: achievement.id,
                description: `Achievement: ${achievement.name}`,
              });

              await supabase
                .from("profiles")
                .update({
                  xp: newXP + achievement.xp_reward,
                })
                .eq("id", user.id);
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      pointsReward,
      xpReward,
      totalShares: newTotalShares,
      multiplier: finalMultiplier,
      platformMultiplier,
      bonusActive,
      bonusEvent,
      achievements,
      shareUrl: generateShareUrl(cardId, profile.referral_code, platform),
    });
  } catch (error) {
    console.error("Error tracking share:", error);
    return NextResponse.json(
      { error: "Failed to track share" },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Get share statistics
// ============================================
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

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Get share history
    const { data: shares, count: totalShares } = await supabase
      .from("share_tracking")
      .select("*, card:cards(*)", { count: "exact" })
      .eq("user_id", user.id)
      .order("shared_at", { ascending: false })
      .limit(20);

    // Get platform breakdown
    const { data: platformBreakdown } = await supabase
      .from("share_tracking")
      .select("platform")
      .eq("user_id", user.id);

    const platformCounts: Record<string, number> = {};
    platformBreakdown?.forEach((share) => {
      platformCounts[share.platform] = (platformCounts[share.platform] || 0) + 1;
    });

    // Get referral stats
    const { data: referrals, count: totalReferrals } = await supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("referred_by", user.id);

    return NextResponse.json({
      totalShares: totalShares || 0,
      recentShares: shares || [],
      platformBreakdown: platformCounts,
      referralCode: profile?.referral_code,
      totalReferrals: totalReferrals || 0,
      referrals: referrals || [],
    });
  } catch (error) {
    console.error("Error fetching share stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch share stats" },
      { status: 500 }
    );
  }
}

// ============================================
// Helper: Generate share URL
// ============================================
function generateShareUrl(
  cardId: string,
  referralCode: string,
  platform: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://soulsync.app";
  const shareUrl = `${baseUrl}/?card=${cardId}&ref=${referralCode}`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const message = encodeURIComponent(
    "Check out this inspiring content on Soul Sync! 🙏✨"
  );

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${message}`;
    case "whatsapp":
      return `https://wa.me/?text=${message}%20${encodedUrl}`;
    case "instagram":
      // Instagram doesn't support direct sharing URLs, return the content URL
      return shareUrl;
    default:
      return shareUrl;
  }
}
