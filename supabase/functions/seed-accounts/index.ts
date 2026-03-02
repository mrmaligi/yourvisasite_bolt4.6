import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ACCOUNTS = [
  {
    email: "mrmaligi@gmail.com",
    password: "Qwerty@2007",
    role: "user",
    full_name: "Maligi User",
  },
  {
    email: "mrmaligi2007@gmail.com",
    password: "Qwerty@2007",
    role: "lawyer",
    full_name: "Maligi Lawyer",
    lawyer: {
      bar_number: "BAR-2024-AU-001",
      jurisdiction: "Australia",
      practice_areas: ["Skilled Worker Visas", "Family Visas", "Student Visas"],
      years_experience: 8,
      bio: "Experienced immigration lawyer specializing in Australian visa applications with over 8 years of practice.",
      hourly_rate_cents: 15000,
    },
  },
  {
    email: "manikaran2007@gmail.com",
    password: "Qwerty@2007",
    role: "admin",
    full_name: "Manikaran Admin",
  },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results: { email: string; status: string; id?: string }[] = [];

    for (const account of ACCOUNTS) {
      const { data: existingUsers } =
        await serviceClient.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(
        (u) => u.email === account.email
      );

      let userId: string;

      if (existing) {
        userId = existing.id;
        await serviceClient.auth.admin.updateUserById(userId, {
          password: account.password,
          app_metadata: { role: account.role },
          email_confirm: true,
        });
        results.push({ email: account.email, status: "updated", id: userId });
      } else {
        const { data: newUser, error: createErr } =
          await serviceClient.auth.admin.createUser({
            email: account.email,
            password: account.password,
            email_confirm: true,
            app_metadata: { role: account.role },
            user_metadata: { full_name: account.full_name },
          });

        if (createErr) {
          results.push({
            email: account.email,
            status: `error: ${createErr.message}`,
          });
          continue;
        }

        userId = newUser.user.id;
        results.push({ email: account.email, status: "created", id: userId });
      }

      const { data: existingProfile } = await serviceClient
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (!existingProfile) {
        await serviceClient.from("profiles").insert({
          id: userId,
          role: account.role,
          full_name: account.full_name,
          is_active: true,
        });
      } else {
        await serviceClient
          .from("profiles")
          .update({ role: account.role, full_name: account.full_name })
          .eq("id", userId);
      }

      if (account.role === "lawyer" && account.lawyer) {
        const { data: existingLawyer } = await serviceClient
          .schema("lawyer")
          .from("profiles")
          .select("id")
          .eq("profile_id", userId)
          .maybeSingle();

        if (!existingLawyer) {
          await serviceClient.schema("lawyer").from("profiles").insert({
            profile_id: userId,
            bar_number: account.lawyer.bar_number,
            jurisdiction: account.lawyer.jurisdiction,
            practice_areas: account.lawyer.practice_areas,
            years_experience: account.lawyer.years_experience,
            bio: account.lawyer.bio,
            hourly_rate_cents: account.lawyer.hourly_rate_cents,
            is_verified: true,
            verification_status: "approved",
          });
        } else {
          await serviceClient
            .schema("lawyer")
            .from("profiles")
            .update({
              is_verified: true,
              verification_status: "approved",
              bar_number: account.lawyer.bar_number,
              jurisdiction: account.lawyer.jurisdiction,
              practice_areas: account.lawyer.practice_areas,
              years_experience: account.lawyer.years_experience,
              bio: account.lawyer.bio,
              hourly_rate_cents: account.lawyer.hourly_rate_cents,
            })
            .eq("profile_id", userId);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Internal error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
