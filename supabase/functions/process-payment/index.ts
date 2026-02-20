import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-02-24.acacia",
});

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

    const { visa_id } = await req.json();
    if (!visa_id) {
      return new Response(JSON.stringify({ error: "visa_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existing } = await supabase
      .from("user_visa_purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("visa_id", visa_id)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "Already purchased" }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch Visa details
    const { data: visa, error: visaError } = await serviceClient
      .from("visas")
      .select("name, subclass")
      .eq("id", visa_id)
      .single();

    if (visaError || !visa) {
      console.error("Visa not found:", visaError);
      throw new Error("Visa not found");
    }

    // Fetch Product price
    const { data: product } = await serviceClient
      .from("products")
      .select("price_cents")
      .eq("visa_id", visa_id)
      .maybeSingle();

    const priceCents = product?.price_cents || 4900;

    // Get or create Stripe customer
    const { data: customerData } = await serviceClient
      .from("stripe_customers")
      .select("customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let customerId = customerData?.customer_id;

    if (!customerId) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = newCustomer.id;
      await serviceClient.from("stripe_customers").insert({
        user_id: user.id,
        customer_id: customerId,
      });
    }

    const origin = req.headers.get("origin") || "http://localhost:5173";
    const metadata = {
      type: "premium",
      user_id: user.id,
      visa_id: visa_id,
    };

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: `Premium Guide: ${visa.subclass ? visa.subclass + ' - ' : ''}${visa.name}`,
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&type=premium&visa_id=${visa_id}`,
      cancel_url: `${origin}/visas/${visa_id}`,
      metadata: metadata,
      payment_intent_data: {
        metadata: metadata,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
