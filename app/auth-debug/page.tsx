"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthDebugPage() {
  const [status, setStatus] = useState<string>("Checking...");
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();

    try {
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      setSession(session);

      // Check user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      setUser(user);

      if (sessionError || userError) {
        setStatus(`Error: ${sessionError?.message || userError?.message}`);
      } else if (session && user) {
        setStatus("✅ Logged in");
      } else if (session && !user) {
        setStatus("⚠️ Session exists but no user (stale session)");
      } else {
        setStatus("❌ Not logged in");
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const forceLogout = async () => {
    const supabase = createClient();

    try {
      // Clear session
      await supabase.auth.signOut();

      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Clear storage
      localStorage.clear();
      sessionStorage.clear();

      setStatus("✅ Cleared all auth data");

      // Reload page
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error: any) {
      setStatus(`Error clearing: ${error.message}`);
    }
  };

  const forceRefresh = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>

        <div className="space-y-2">
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-semibold mb-1">Status:</p>
            <p className="text-lg">{status}</p>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-semibold mb-1">Session:</p>
            <p className="text-xs font-mono break-all">
              {session ? "✅ Exists" : "❌ None"}
            </p>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-semibold mb-1">User:</p>
            <p className="text-xs font-mono break-all">
              {user ? `✅ ${user.email}` : "❌ None"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={checkAuth}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Refresh Status
          </button>

          <button
            onClick={forceLogout}
            className="w-full py-2 px-4 bg-destructive text-destructive-foreground rounded-lg font-semibold"
          >
            Force Clear All Auth Data
          </button>

          <button
            onClick={forceRefresh}
            className="w-full py-2 px-4 bg-muted text-foreground rounded-lg font-semibold"
          >
            Reload Page
          </button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          This page helps debug authentication issues
        </div>
      </div>
    </div>
  );
}
