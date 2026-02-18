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
    // 1. Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. Verify the user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // 3. Check for admin role using service role client
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. Perform analytics logic
    const { period = 'all_time' } = await req.json();

    let bookingsQuery = adminClient.from('bookings').select('total_price_cents, created_at, status, payment_status');
    let purchasesQuery = adminClient.from('user_visa_purchases').select('amount_cents, purchased_at');

    if (period === 'last_30_days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      bookingsQuery = bookingsQuery.gte('created_at', thirtyDaysAgo.toISOString());
      purchasesQuery = purchasesQuery.gte('purchased_at', thirtyDaysAgo.toISOString());
    }

    const [bookingsRes, purchasesRes] = await Promise.all([
      bookingsQuery,
      purchasesQuery
    ]);

    if (bookingsRes.error) throw bookingsRes.error;
    if (purchasesRes.error) throw purchasesRes.error;

    const bookings = bookingsRes.data;
    const purchases = purchasesRes.data;

    // Calculate metrics
    const bookingRevenue = bookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => sum + (b.total_price_cents || 0), 0);

    const purchaseRevenue = purchases
      .reduce((sum, p) => sum + (p.amount_cents || 0), 0);

    const totalRevenue = bookingRevenue + purchaseRevenue;

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const totalPurchases = purchases.length;

    // Calculate revenue by day for charts
    const revenueByDay: Record<string, number> = {};

    bookings
      .filter(b => b.payment_status === 'paid')
      .forEach(b => {
        const date = b.created_at.split('T')[0];
        revenueByDay[date] = (revenueByDay[date] || 0) + (b.total_price_cents || 0);
      });

    purchases
      .forEach(p => {
        const date = p.purchased_at.split('T')[0];
        revenueByDay[date] = (revenueByDay[date] || 0) + (p.amount_cents || 0);
      });

    const chartData = Object.entries(revenueByDay)
      .map(([date, amount]) => ({ date, amount: amount / 100 })) // Convert cents to dollars
      .sort((a, b) => a.date.localeCompare(b.date));

    return new Response(
      JSON.stringify({
        totalRevenue: totalRevenue / 100, // Convert to dollars
        bookingRevenue: bookingRevenue / 100,
        purchaseRevenue: purchaseRevenue / 100,
        totalBookings,
        confirmedBookings,
        totalPurchases,
        chartData
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
