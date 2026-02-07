import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let visaId: string | undefined;
    try {
      const body = await req.json();
      visaId = body.visa_id;
    } catch {
      // no body is fine
    }

    if (visaId) {
      await serviceClient.rpc("calculate_tracker_stats", {
        target_visa_id: visaId,
      });
    } else {
      const { data: visaIds } = await serviceClient
        .from("tracker_entries")
        .select("visa_id")
        .limit(1000);

      const uniqueIds = [
        ...new Set((visaIds || []).map((r: { visa_id: string }) => r.visa_id)),
      ];

      for (const vid of uniqueIds) {
        await serviceClient.rpc("calculate_tracker_stats", {
          target_visa_id: vid,
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
