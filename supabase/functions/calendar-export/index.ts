import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

function generateICS({
  title,
  start,
  end,
  description,
  location,
  organizer,
  uid,
}: {
  title: string;
  start: Date;
  end: Date;
  description: string;
  location: string;
  organizer: { name: string; email: string };
  uid: string;
}): string {
  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VisaBuild//Consultation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    `ORGANIZER;CN=${organizer.name}:mailto:${organizer.email}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(req.url);
    const bookingId = url.pathname.split('/').pop();

    if (!bookingId) {
      return new Response(JSON.stringify({ error: 'Booking ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
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

    // Fetch booking with related data
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        id,
        status,
        duration_minutes,
        notes,
        lawyer_id,
        slot_id,
        lawyer:lawyer_id (id, profile_id, jurisdiction),
        slot:slot_id (start_time, end_time)
      `)
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();

    if (bookingError || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (booking.status !== 'confirmed') {
      return new Response(JSON.stringify({ error: 'Booking must be confirmed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch lawyer profile
    const { data: lawyerProfile } = await supabase
      .schema('lawyer')
      .from('profiles')
      .select('id, profile_id, jurisdiction')
      .eq('id', booking.lawyer_id)
      .single();

    const { data: lawyerUser } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', lawyerProfile?.profile_id || '')
      .single();

    const startTime = new Date(booking.slot?.start_time);
    const endTime = new Date(booking.slot?.end_time);

    const ics = generateICS({
      title: `VisaBuild Consultation with ${lawyerUser?.full_name || 'Immigration Lawyer'}`,
      start: startTime,
      end: endTime,
      description: [
        'Immigration Law Consultation',
        '',
        `Duration: ${booking.duration_minutes} minutes`,
        `Jurisdiction: ${lawyerProfile?.jurisdiction || 'N/A'}`,
        '',
        booking.notes ? `Notes: ${booking.notes}` : '',
        '',
        'Join via VisaBuild platform',
      ].join('\n'),
      location: 'Video Call (link to be provided)',
      organizer: {
        name: lawyerUser?.full_name || 'Immigration Lawyer',
        email: lawyerUser?.email || 'consultations@visabuild.com',
      },
      uid: `visabuild-booking-${booking.id}@visabuild.com`,
    });

    return new Response(ics, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="consultation-${bookingId}.ics"`,
      },
    });
  } catch (error: any) {
    console.error('ICS generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
