import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2025-02-24.acacia',
  });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log('Webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const bookingId = session.metadata?.booking_id;
        const slotId = session.metadata?.slot_id;
        const userId = session.metadata?.user_id;
        const lawyerId = session.metadata?.lawyer_id;

        if (bookingId) {
          // Update booking to confirmed
          const { error: bookingError } = await supabase
            .from('bookings')
            .update({
              status: 'confirmed',
              payment_status: 'paid',
              payment_intent_id: session.payment_intent,
              confirmed_at: new Date().toISOString(),
            })
            .eq('id', bookingId);

          if (bookingError) {
            console.error('Failed to update booking:', bookingError);
          }

          // Mark slot as booked
          if (slotId) {
            await supabase
              .schema('lawyer')
              .from('consultation_slots')
              .update({ is_booked: true, is_reserved: false, reserved_until: null })
              .eq('id', slotId);
          }

          // Create activity log entry
          await supabase.rpc('log_activity', {
            p_user_id: userId,
            p_action: 'consultation_booked',
            p_resource_type: 'booking',
            p_resource_id: bookingId,
            p_metadata: { lawyer_id: lawyerId, amount: session.amount_total },
          });

          console.log(`Booking ${bookingId} confirmed`);
        }
        break;
      }

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object;
        const bookingId = session.metadata?.booking_id;
        const slotId = session.metadata?.slot_id;

        if (bookingId) {
          // Cancel the booking
          await supabase
            .from('bookings')
            .update({ status: 'cancelled', payment_status: 'failed' })
            .eq('id', bookingId);

          // Release the slot
          if (slotId) {
            await supabase
              .schema('lawyer')
              .from('consultation_slots')
              .update({ is_reserved: false, reserved_until: null })
              .eq('id', slotId);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        // Handle failed payment if needed
        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
});
