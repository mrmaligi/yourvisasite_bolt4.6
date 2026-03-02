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

const DEFAULT_VISA_PRICE_CENTS = 4900;

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

    const { type, visa_id, lawyer_id, slot_id, notes, redirect_path } = await req.json();
    const origin = req.headers.get('origin') || 'http://localhost:5173';

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
    let cancelUrl = origin;
    let successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}&type=${type}`;

    if (redirect_path) {
      successUrl = `${origin}${redirect_path}`;
      successUrl += successUrl.includes('?') ? '&' : '?';
      successUrl += `session_id={CHECKOUT_SESSION_ID}&type=${type}`;
    }

    if (type === 'premium') {
      if (!visa_id) {
          throw new Error('Missing visa_id for premium purchase');
      }

      // Verify visa exists
      const { data: visa, error: visaError } = await supabase
        .from('visas')
        .select('subclass, name')
        .eq('id', visa_id)
        .single();

      if (visaError || !visa) {
          throw new Error('Visa not found');
      }

      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: `Premium Guide: ${visa.subclass} - ${visa.name}`,
          },
          unit_amount: DEFAULT_VISA_PRICE_CENTS,
        },
        quantity: 1,
      });

      metadata.visa_id = visa_id;
      cancelUrl = `${origin}/visas/${visa_id}`;

    } else if (type === 'consultation') {
      if (!lawyer_id || !slot_id) {
        throw new Error('Missing required details for consultation booking');
      }

       // Fetch slot details
       const { data: slot, error: slotError } = await supabase
         .schema('lawyer')
         .from('consultation_slots')
         .select('*')
         .eq('id', slot_id)
         .eq('lawyer_id', lawyer_id)
         .eq('is_booked', false)
         .single();

       if (slotError || !slot) {
         throw new Error('Slot not available');
       }

       // Fetch lawyer details
       const { data: lawyer, error: lawyerError } = await supabase
         .schema('lawyer')
         .from('profiles')
         .select('id, profile_id, hourly_rate_cents, jurisdiction')
         .eq('id', lawyer_id)
         .eq('is_verified', true)
         .single();

       if (lawyerError || !lawyer) {
         throw new Error('Lawyer not found');
       }

       // Calculate price
       const start = new Date(slot.start_time);
       const end = new Date(slot.end_time);
       const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
       const rateCents = lawyer.hourly_rate_cents || 5000; // Default $50/hr
       const totalCents = Math.round((rateCents / 60) * durationMinutes);

       // Create pending booking record
       const { data: booking, error: bookingError } = await supabase
         .from('bookings')
         .insert({
           user_id: user.id,
           lawyer_id: lawyer_id,
           slot_id: slot_id,
           duration_minutes: durationMinutes,
           total_price_cents: totalCents,
           status: 'pending',
           notes: notes || null,
         })
         .select()
         .single();

       if (bookingError || !booking) {
         console.error('Booking error:', bookingError);
         throw new Error('Failed to create booking');
       }

       lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: 'Lawyer Consultation',
            description: `${durationMinutes} minute consultation - ${start.toLocaleDateString()}`,
          },
          unit_amount: totalCents,
        },
        quantity: 1,
      });

      metadata.booking_id = booking.id;
      metadata.slot_id = slot_id;
      metadata.lawyer_id = lawyer_id;
      cancelUrl = `${origin}/lawyers/${lawyer_id}`;

      // Reserve the slot
      await supabase
        .schema('lawyer')
        .from('consultation_slots')
        .update({ is_reserved: true, reserved_until: new Date(Date.now() + 15 * 60 * 1000).toISOString() })
        .eq('id', slot_id);

    } else {
        throw new Error('Invalid type');
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
      payment_intent_data: {
          metadata: metadata
      }
    });

    if (type === 'consultation' && metadata.booking_id) {
        await supabase
          .from('bookings')
          .update({ stripe_checkout_session_id: session.id })
          .eq('id', metadata.booking_id);
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
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
