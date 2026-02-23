import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2025-02-24.acacia',
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { slotId, lawyerId, notes, questions, visaId, successUrl, cancelUrl } = await req.json();

    if (!slotId || !lawyerId) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch slot details
    const { data: slot, error: slotError } = await supabase
      .schema('lawyer')
      .from('consultation_slots')
      .select('*')
      .eq('id', slotId)
      .eq('lawyer_id', lawyerId)
      .eq('is_booked', false)
      .single();

    if (slotError || !slot) {
      return new Response(JSON.stringify({ error: 'Slot not available' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch lawyer details
    const { data: lawyer, error: lawyerError } = await supabase
      .schema('lawyer')
      .from('profiles')
      .select('id, profile_id, hourly_rate_cents, jurisdiction')
      .eq('id', lawyerId)
      .eq('is_verified', true)
      .single();

    if (lawyerError || !lawyer) {
      return new Response(JSON.stringify({ error: 'Lawyer not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate price
    const start = new Date(slot.start_time);
    const end = new Date(slot.end_time);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

    let rateCents = lawyer.hourly_rate_cents || 5000; // Default $50/hr

    // Check for visa-specific price if visaId is provided
    if (visaId) {
      const { data: visaPrice } = await supabase
        .schema('lawyer')
        .from('visa_prices')
        .select('hourly_rate_cents')
        .eq('lawyer_id', lawyerId)
        .eq('visa_id', visaId)
        .maybeSingle();

      if (visaPrice && visaPrice.hourly_rate_cents) {
        rateCents = visaPrice.hourly_rate_cents;
      }
    }

    const totalCents = Math.round((rateCents / 60) * durationMinutes);

    // Create pending booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        lawyer_id: lawyerId,
        slot_id: slotId,
        duration_minutes: durationMinutes,
        total_price_cents: totalCents,
        status: 'pending',
        notes: notes || null,
        questions: questions || null,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error('Booking error:', bookingError);
      return new Response(JSON.stringify({ error: 'Failed to create booking' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get or create Stripe customer
    const { data: customer, error: customerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    let customerId = customer?.customer_id;

    if (!customerId) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = newCustomer.id;
      await supabase.from('stripe_customers').insert({
        user_id: user.id,
        customer_id: customerId,
      });
    }

    const origin = req.headers.get('origin') || 'http://localhost:5173';

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: `Consultation with Immigration Lawyer`,
              description: `${durationMinutes} minute consultation - ${start.toLocaleDateString()}`,
            },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${origin}/success?session_id={CHECKOUT_SESSION_ID}&type=consultation`,
      cancel_url: cancelUrl || `${origin}/lawyers/${lawyerId}`,
      metadata: {
        type: 'consultation',
        booking_id: booking.id,
        slot_id: slotId,
        user_id: user.id,
        lawyer_id: lawyerId,
      },
    });

    // Update booking with payment intent
    const { error: sessionUpdateError } = await supabase
      .from('bookings')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', booking.id);

    if (sessionUpdateError) {
      console.error('Failed to update booking with session ID:', sessionUpdateError);
    }

    // Mark slot as reserved (not booked until payment confirmed)
    await supabase
      .schema('lawyer')
      .from('consultation_slots')
      .update({ is_reserved: true, reserved_until: new Date(Date.now() + 15 * 60 * 1000).toISOString() })
      .eq('id', slotId);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url, bookingId: booking.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Consultation checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
