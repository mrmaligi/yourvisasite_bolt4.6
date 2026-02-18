import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import { Parser } from 'npm:json2csv';

interface ExportRequest {
  table: string;
  format?: 'csv' | 'json';
  userId?: string;
}

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

    const { table, format = 'csv', userId } = await req.json();

    if (!['profiles', 'bookings', 'user_visa_purchases'].includes(table)) {
      return new Response(JSON.stringify({ error: 'Invalid table' }), { status: 400 });
    }

    // Check authorization
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch user role for admin check
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';

    // If userId provided:
    if (userId) {
       if (user.id !== userId && !isAdmin) {
         return new Response(JSON.stringify({ error: 'Forbidden: Access denied' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
       }
    } else {
       // If no userId (export all), must be admin
       if (!isAdmin) {
         return new Response(JSON.stringify({ error: 'Forbidden: Admin access required for full export' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
       }
    }

    // Use adminClient for fetching data to ensure full access based on permissions determined above
    let query = adminClient.from(table).select('*');

    if (userId) {
      if (table === 'profiles') query = query.eq('id', userId);
      else if (table === 'bookings') query = query.eq('user_id', userId);
      else if (table === 'user_visa_purchases') query = query.eq('user_id', userId);
    }

    // Determine sort column
    const sortCol = table === 'user_visa_purchases' ? 'purchased_at' : 'created_at';
    query = query.order(sortCol, { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (format === 'json') {
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    // CSV format
    if (!data || data.length === 0) {
      return new Response('', {
        headers: {
          'Content-Type': 'text/csv',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    const parser = new Parser();
    const csv = parser.parse(data);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${table}_export.csv"`,
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
