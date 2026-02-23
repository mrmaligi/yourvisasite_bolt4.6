import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function sendNotification(userId: string, type: string, data: any) {
  try {
    console.log(`Sending notification (${type}) to user ${userId}`);
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type,
        data,
      }),
    });
  } catch (error) {
    console.error(`Failed to send notification (${type}):`, error);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isAdmin = user.app_metadata?.role === "admin";
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { lawyer_profile_id, action, rejection_reason } = await req.json();
    if (!lawyer_profile_id || !["approve", "reject"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "lawyer_profile_id and action (approve/reject) required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "approve") {
      await serviceClient.auth.admin.updateUserById(lawyer_profile_id, {
        app_metadata: { role: "lawyer", is_verified: true },
      });

      await serviceClient
        .from("profiles")
        .update({
            role: "lawyer",
            is_verified: true,
            verification_status: 'approved',
            verified_at: new Date().toISOString()
        })
        .eq("id", lawyer_profile_id);

      // Update lawyer schema profile
      await serviceClient
        .schema('lawyer')
        .from('profiles')
        .update({
            is_verified: true,
            verification_status: 'verified',
            verified_at: new Date().toISOString()
        })
        .eq('profile_id', lawyer_profile_id);

      await sendNotification(lawyer_profile_id, 'lawyer_approved', {
           dashboardUrl: `${Deno.env.get('VITE_APP_URL') || 'https://visabuild.com'}/lawyer/dashboard`,
      });

    } else if (action === "reject") {
      await serviceClient
        .from("profiles")
        .update({
            is_verified: false,
            verification_status: 'rejected'
        })
        .eq("id", lawyer_profile_id);

      // Update lawyer schema profile
      await serviceClient
        .schema('lawyer')
        .from('profiles')
        .update({
            is_verified: false,
            verification_status: 'rejected',
            rejection_reason: rejection_reason || null
        })
        .eq('profile_id', lawyer_profile_id);

      await sendNotification(lawyer_profile_id, 'lawyer_rejected', {
           reason: rejection_reason,
           settingsUrl: `${Deno.env.get('VITE_APP_URL') || 'https://visabuild.com'}/settings/profile`,
      });
    }

    return new Response(
      JSON.stringify({ success: true, action }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
