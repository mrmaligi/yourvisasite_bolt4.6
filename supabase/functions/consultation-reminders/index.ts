import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

/**
 * Scheduled function to send consultation reminder emails
 * Trigger: Run daily via Supabase cron or external scheduler
 * Sends reminders for consultations occurring in ~24 hours
 */

interface BookingReminder {
  booking_id: string;
  user_id: string;
  lawyer_name: string;
  user_email: string;
  user_name: string;
  slot_date: string;
  slot_time: string;
  duration_minutes: number;
}

Deno.serve(async (req) => {
  // Verify authorization (cron secret)
  const authHeader = req.headers.get('Authorization');
  const cronSecret = Deno.env.get('CRON_SECRET');
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    // Find confirmed bookings starting in ~24 hours (within 23-25 hour window)
    const targetStart = new Date();
    targetStart.setHours(targetStart.getHours() + 23);
    
    const targetEnd = new Date();
    targetEnd.setHours(targetEnd.getHours() + 25);

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        user_id,
        lawyer:lawyer_id(full_name),
        slot:slot_id(start_time, duration_minutes),
        user:user_id(email, full_name),
        reminder_sent
      `)
      .eq('status', 'confirmed')
      .eq('reminder_sent', false)
      .gte('slot.start_time', targetStart.toISOString())
      .lte('slot.start_time', targetEnd.toISOString());

    if (error) {
      console.error('Error fetching bookings:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch bookings' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, message: 'No reminders needed' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    let sentCount = 0;
    const failed: string[] = [];

    for (const booking of bookings) {
      try {
        // Format date/time
        const slotDate = new Date(booking.slot.start_time);
        const dateStr = slotDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const timeStr = slotDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        });

        // Call the send-email function
        const response = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({
              userId: booking.user_id,
              type: 'booking_reminder',
              data: {
                lawyerName: booking.lawyer?.full_name || 'Your Lawyer',
                date: dateStr,
                time: timeStr,
                duration: `${booking.slot.duration_minutes} minutes`,
                dashboardUrl: `${Deno.env.get('APP_URL')}/consultations`
              }
            })
          }
        );

        if (response.ok) {
          // Mark reminder as sent
          await supabase
            .from('bookings')
            .update({ reminder_sent: true })
            .eq('id', booking.id);
          
          sentCount++;
          console.log(`Reminder sent for booking ${booking.id}`);
        } else {
          failed.push(booking.id);
          console.error(`Failed to send reminder for booking ${booking.id}`);
        }
      } catch (err) {
        failed.push(booking.id);
        console.error(`Error processing booking ${booking.id}:`, err);
      }
    }

    return new Response(
      JSON.stringify({ 
        sent: sentCount, 
        failed: failed.length,
        failed_bookings: failed,
        total: bookings.length 
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Reminder job error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
