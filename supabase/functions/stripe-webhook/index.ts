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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Webhook signature verification failed: ${message}`);
      return new Response(`Webhook signature verification failed: ${message}`, { status: 400 });
    }

    console.log(`Received event type: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
    } else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionExpired(session);
    } else if (event.type === 'payment_intent.payment_failed') {
       const paymentIntent = event.data.object as Stripe.PaymentIntent;
       await handlePaymentIntentFailed(paymentIntent);
    }

    return Response.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing webhook:', error);
    return Response.json({ error: message }, { status: 500 });
  }
});

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

    if (userId && visaId) {
       // Upsert into user_visa_purchases
       const purchaseData = {
         user_id: userId,
         visa_id: visaId,
         stripe_payment_intent_id: typeof payment_intent === 'string' ? payment_intent : payment_intent?.id,
         stripe_checkout_session_id: sessionId,
         amount_cents: amount_total,
         currency: currency,
         status: 'active',
         purchased_at: new Date().toISOString()
       };

       const { error } = await supabase
         .from('user_visa_purchases')
         .upsert(purchaseData, { onConflict: 'user_id, visa_id' });

       if (error) {
         console.error('Error upserting user_visa_purchase:', error);
       } else {
         console.log('Successfully recorded premium purchase for user', userId);

         // Fetch Visa Name
         let visaName = 'Premium Guide';
         if (visaId) {
             const { data: visa } = await supabase.from('visas').select('name, subclass_number').eq('id', visaId).single();
             if (visa?.name) visaName = `${visa.subclass_number ? visa.subclass_number + ' - ' : ''}${visa.name}`;
         }

         // Send Email
         await sendNotification(userId, 'premium_purchase', {
             visaName: visaName,
             amount: (amount_total ? amount_total / 100 : 0).toFixed(2),
             guideUrl: `${Deno.env.get('VITE_APP_URL') || 'https://visabuild.com'}/premium/${visaId || ''}`,
             date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
         });
       }
    }
  } else if (type === 'consultation') {
    const bookingId = metadata?.booking_id;
    const slotId = metadata?.slot_id;

    if (bookingId) {
      // Update booking status
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          confirmed_at: new Date().toISOString(),
          payment_intent_id: typeof payment_intent === 'string' ? payment_intent : payment_intent?.id,
          stripe_checkout_session_id: sessionId
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking status:', error);
      } else {
        console.log('Successfully confirmed booking', bookingId);

        // Mark slot as booked
        if (slotId) {
          try {
            const { error: slotError } = await supabase
              .schema('lawyer')
              .from('consultation_slots')
              .update({ is_booked: true, is_reserved: false, reserved_until: null })
              .eq('id', slotId);

            if (slotError) {
              console.error('Error updating consultation slot:', slotError);
            }
          } catch (err) {
             console.error('Schema error updating consultation slot:', err);
          }
        }

        // Fetch booking details for email
        // We need: lawyerName, date, time, duration, amount
        try {
            const { data: booking } = await supabase.from('bookings').select('*').eq('id', bookingId).single();
            if (booking && booking.user_id) {
                 let lawyerName = 'Your Lawyer';
                 let date = 'Pending';
                 let time = 'Pending';
                 let duration = '30 mins';

                 // Fetch Slot
                 try {
                   const { data: slot } = await supabase.schema('lawyer').from('consultation_slots').select('*').eq('id', booking.slot_id).single();
                   if (slot) {
                       const startDate = new Date(slot.start_time);
                       date = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
                       time = startDate.toISOString().split('T')[1].substring(0, 5) + ' UTC'; // HH:MM UTC
                   }
                 } catch (err) {
                   console.error('Schema error fetching slot for email:', err);
                 }

                 if (booking.duration_minutes) duration = `${booking.duration_minutes} minutes`;

                 // Fetch Lawyer Profile
                 try {
                   const { data: lawyerProfile } = await supabase.schema('lawyer').from('profiles').select('profile_id').eq('id', booking.lawyer_id).single();
                   if (lawyerProfile) {
                       const { data: publicProfile } = await supabase.from('profiles').select('full_name').eq('id', lawyerProfile.profile_id).single();
                       if (publicProfile?.full_name) lawyerName = publicProfile.full_name;
                   }
                 } catch (err) {
                   console.error('Schema error fetching lawyer for email:', err);
                 }

                 await sendNotification(booking.user_id, 'booking_confirmation', {
                     lawyerName,
                     date,
                     time,
                     duration,
                     amount: (amount_total ? amount_total / 100 : 0).toFixed(2),
                     dashboardUrl: `${Deno.env.get('VITE_APP_URL') || 'https://visabuild.com'}/user/consultations`,
                 });
            }
        } catch (fetchError) {
            console.error('Error fetching booking details for email:', fetchError);
        }
      }
    } else {
      console.error('No booking_id found in metadata for consultation');
    }
  } else {
    console.log('Unknown checkout type:', type);
  }
}

async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  const { metadata } = session;
  const type = metadata?.type;

  if (type === 'consultation') {
    const bookingId = metadata?.booking_id;
    const slotId = metadata?.slot_id;

    console.log(`Handling expired/failed session for booking ${bookingId}`);

    if (bookingId) {
       await supabase.from('bookings').update({ status: 'cancelled', payment_status: 'failed' }).eq('id', bookingId);
    }

    if (slotId) {
       try {
         await supabase
           .schema('lawyer')
           .from('consultation_slots')
           .update({ is_reserved: false, reserved_until: null })
           .eq('id', slotId);
       } catch (err) {
         console.error('Schema error releasing slot reservation:', err);
       }
    }
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const { metadata, last_payment_error } = paymentIntent;
    const type = metadata?.type;

    console.log(`Handling payment failure for type ${type}, error: ${last_payment_error?.message}`);

    if (type === 'consultation') {
        const bookingId = metadata?.booking_id;
        const slotId = metadata?.slot_id;

        if (bookingId) {
            await supabase.from('bookings').update({ status: 'cancelled', payment_status: 'failed' }).eq('id', bookingId);
        }

        if (slotId) {
            try {
              await supabase
               .schema('lawyer')
               .from('consultation_slots')
               .update({ is_reserved: false, reserved_until: null })
               .eq('id', slotId);
            } catch (err) {
               console.error('Schema error releasing slot reservation on failure:', err);
            }
        }
    } else if (type === 'premium') {
        // Just log it, user can try again
        const userId = metadata?.user_id;
        const visaId = metadata?.visa_id;
        console.log(`Premium purchase failed for user ${userId}, visa ${visaId}`);
    }
}
