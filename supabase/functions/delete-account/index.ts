import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the user
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    const { confirmation } = await req.json();

    if (confirmation !== "DELETE MY ACCOUNT") {
      return new Response(JSON.stringify({ error: "Invalid confirmation text" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`🗑️ Deleting account for user: ${userId}`);

    // Use service role for full deletion
    const adminClient = createClient(supabaseUrl, serviceKey);

    // Delete in order (respecting foreign keys)
    const tables = [
      "chat_messages",
      "agent_reference_materials",
      "post_analytics_history",
      "post_analytics",
      "analytics_queue",
      "extension_posted_urls",
      "extension_alerts",
      "notification_log",
      "notifications",
      "linkedin_post_history",
      "linkedin_analytics",
      "user_writing_style",
      "user_writing_profiles",
      "voice_notes",
      "posts",
      "agents",
      "campaigns",
      "payments",
      "admin_alert_settings",
      "user_roles",
      "user_profiles",
    ];

    for (const table of tables) {
      const { error } = await adminClient
        .from(table)
        .delete()
        .eq("user_id", userId);
      if (error) {
        console.warn(`Warning deleting from ${table}:`, error.message);
      }
    }

    // Delete storage files
    try {
      const { data: files } = await adminClient.storage
        .from("post-images")
        .list(userId, { limit: 1000 });
      if (files && files.length > 0) {
        const paths = files.map((f) => `${userId}/${f.name}`);
        await adminClient.storage.from("post-images").remove(paths);
      }
    } catch {
      console.warn("Storage cleanup skipped");
    }

    // Delete auth user
    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error("Auth user deletion error:", deleteAuthError);
      return new Response(JSON.stringify({ error: "Failed to delete auth account" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`✅ Account deleted: ${userId}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Delete account error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete account" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
