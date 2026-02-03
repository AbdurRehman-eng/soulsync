import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Sign out the user
    await supabase.auth.signOut();

    // Create response that clears all auth cookies
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear all possible Supabase auth cookies
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token',
      'sb-auth-token',
    ];

    // Get all cookies from request
    const allCookies = request.cookies.getAll();

    // Clear Supabase-related cookies
    allCookies.forEach(cookie => {
      if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
        response.cookies.delete(cookie.name);
        response.cookies.set(cookie.name, '', {
          maxAge: 0,
          path: '/',
          expires: new Date(0),
        });
      }
    });

    // Also clear known auth cookies explicitly
    cookiesToClear.forEach(cookieName => {
      response.cookies.delete(cookieName);
      response.cookies.set(cookieName, '', {
        maxAge: 0,
        path: '/',
        expires: new Date(0),
      });
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to logout" },
      { status: 500 }
    );
  }
}
