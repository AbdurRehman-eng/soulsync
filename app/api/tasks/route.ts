import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET - Fetch user tasks
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

    // Get all active tasks
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select(`
        id,
        card_id,
        task_type,
        description,
        points_reward,
        expires_at,
        cards (
          id,
          title,
          subtitle,
          type
        )
      `)
      .order("task_type", { ascending: true })
      .order("created_at", { ascending: false });

    if (tasksError) throw tasksError;

    // Get user's task progress
    const { data: userProgress } = await supabase
      .from("user_tasks")
      .select("*")
      .eq("user_id", user.id);

    // Combine tasks with progress
    const tasksWithProgress = (tasks || []).map((task: any) => {
      const progress = userProgress?.find((p) => p.task_id === task.id);
      const card = task.cards;

      return {
        id: task.id,
        title: card?.title || "Task",
        description: task.description || card?.subtitle || "",
        type: task.task_type || "daily",
        points_reward: task.points_reward,
        completed: progress?.status === "completed",
        expires_at: task.expires_at,
      };
    });

    // Separate by type
    const dailyTasks = tasksWithProgress.filter((t: any) => t.type === "daily");
    const weeklyTasks = tasksWithProgress.filter((t: any) => t.type === "weekly");
    const challengeTasks = tasksWithProgress.filter((t: any) => t.type === "challenge");

    return NextResponse.json({
      daily: dailyTasks,
      weekly: weeklyTasks,
      challenge: challengeTasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Toggle task completion
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
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    // Get task details
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (taskError) throw taskError;

    // Check if user has progress record
    const { data: existingProgress } = await supabase
      .from("user_tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("task_id", taskId)
      .single();

    // Toggle completion
    const newStatus = existingProgress?.status === "completed" ? "pending" : "completed";
    const isCompleting = newStatus === "completed";

    if (existingProgress) {
      // Update existing progress
      await supabase
        .from("user_tasks")
        .update({
          status: newStatus,
          completed_at: isCompleting ? new Date().toISOString() : null,
        })
        .eq("id", existingProgress.id);
    } else {
      // Create new progress record
      await supabase.from("user_tasks").insert({
        user_id: user.id,
        task_id: taskId,
        status: newStatus,
        completed_at: isCompleting ? new Date().toISOString() : null,
      });
    }

    // If completing, award points
    if (isCompleting && !existingProgress?.completed_at) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        const pointsReward = task.points_reward || 10;

        // Award points
        await supabase.from("points_transactions").insert({
          user_id: user.id,
          amount: pointsReward,
          source: "task",
          source_id: taskId,
          description: `Completed task`,
          multiplier: 1.0,
        });

        // Update profile
        await supabase
          .from("profiles")
          .update({
            points: profile.points + pointsReward,
          })
          .eq("id", user.id);

        return NextResponse.json({
          success: true,
          completed: true,
          rewards: {
            points: pointsReward,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      completed: isCompleting,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
