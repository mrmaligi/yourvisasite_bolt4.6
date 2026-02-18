import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  apiVersion: '2025-02-24.acacia',
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
    }

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { metadata, id: sessionId, payment_intent, amount_total, currency, payment_status } = session;

  if (payment_status !== 'paid') {
    console.log('Payment not paid:', payment_status);
    return;
  }

  const type = metadata?.type;
  const userId = metadata?.user_id;

  console.log(`Processing checkout session ${sessionId} for type ${type}`);

  if (type === 'premium') {
    const visaId = metadata?.visa_id;

    if (userId) {
       // Insert into user_visa_purchases
       const purchaseData = {
         user_id: userId,
         visa_id: visaId || null,
         stripe_payment_intent_id: typeof payment_intent === 'string' ? payment_intent : payment_intent?.id,
         stripe_checkout_session_id: sessionId,
         amount_cents: amount_total,
         currency: currency,
         status: 'active',
         purchased_at: new Date().toISOString()
       };

       const { error } = await supabase
         .from('user_visa_purchases')
         .insert(purchaseData);

       if (error) {
         console.error('Error inserting user_visa_purchase:', error);
       } else {
         console.log('Successfully recorded premium purchase for user', userId);
       }
    }
  } else if (type === 'consultation') {
    const bookingId = metadata?.booking_id;

    if (bookingId) {
      // Update booking status
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          confirmed_at: new Date().toISOString(),
          payment_intent_id: typeof payment_intent === 'string' ? payment_intent : payment_intent?.id
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking status:', error);
      } else {
        console.log('Successfully confirmed booking', bookingId);
      }
    } else {
      console.error('No booking_id found in metadata for consultation');
    }
  } else {
    console.log('Unknown checkout type:', type);
  }
}
