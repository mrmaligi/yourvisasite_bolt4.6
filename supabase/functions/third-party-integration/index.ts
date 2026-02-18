import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Check for admin role using service role client
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const { integrationType, event, data } = await req.json();

    if (!integrationType) {
      return new Response(JSON.stringify({ error: 'Missing integrationType' }), { status: 400 });
    }

    if (integrationType === 'webhook') {
      const url = Deno.env.get('DEFAULT_WEBHOOK_URL');
      if (!url) {
        return new Response(JSON.stringify({ error: 'Webhook integration not configured' }), { status: 501 });
      }

      console.log(`Sending webhook to configured URL for event ${event}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Event-Type': event || 'unknown',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`Webhook failed: ${response.status} ${await response.text()}`);
        return new Response(JSON.stringify({ error: 'Webhook failed' }), { status: 502 });
      }

      return new Response(JSON.stringify({ success: true, message: 'Webhook sent' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add other integrations here (e.g. CRM, Slack)
    if (integrationType === 'slack') {
        const slackUrl = Deno.env.get('SLACK_WEBHOOK_URL');
        if (!slackUrl) {
            return new Response(JSON.stringify({ error: 'Slack webhook URL not configured' }), { status: 501 });
        }

        const message = {
            text: `Event: ${event}\nData: ${JSON.stringify(data, null, 2)}`
        };

        const response = await fetch(slackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });

         if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Slack notification failed' }), { status: 502 });
        }

        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown integration type' }), { status: 400 });

  } catch (error) {
    console.error('Integration error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
