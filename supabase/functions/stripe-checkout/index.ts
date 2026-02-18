import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2025-02-24.acacia',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { type, visa_id, lawyer_id, amount } = await req.json();

    if (!type) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get or create Stripe customer
    const { data: customerData } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
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
      await supabase.from('stripe_customers').insert({
        user_id: user.id,
        customer_id: customerId,
      });
    }

    let lineItems = [];
    let metadata = {
      type,
      user_id: user.id,
    } as any;

    const origin = req.headers.get('origin') || 'http://localhost:5173';
    let successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}&type=${type}`;
    let cancelUrl = origin;

    if (type === 'premium') {
      lineItems.push({
        price: 'price_test_visa_premium',
        quantity: 1,
      });
      if (visa_id) {
        metadata.visa_id = visa_id;
        cancelUrl = `${origin}/visas/${visa_id}`;
      } else {
        cancelUrl = `${origin}/pricing`;
      }
    } else if (type === 'consultation') {
      if (!amount || !lawyer_id) {
         return new Response(
          JSON.stringify({ error: 'Consultation requires amount and lawyer_id' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: 'Lawyer Consultation',
          },
          unit_amount: amount,
        },
        quantity: 1,
      });
      metadata.lawyer_id = lawyer_id;
      cancelUrl = `${origin}/lawyers/${lawyer_id}`;
    } else {
       return new Response(
        JSON.stringify({ error: 'Invalid type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
