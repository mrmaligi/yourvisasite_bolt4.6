/*
  # Stripe RLS Policy Optimization

  1. Security Fix
    - Update Stripe table policies to use `(select auth.uid())` pattern
    - Prevents per-row re-evaluation of auth function for better performance

  2. Tables Updated
    - `stripe_customers` - "Users can view their own customer data"
    - `stripe_subscriptions` - "Users can view their own subscription data"
    - `stripe_orders` - "Users can view their own order data"
*/

-- ======== stripe_customers ========
DROP POLICY IF EXISTS "Users can view their own customer data" ON public.stripe_customers;

CREATE POLICY "Users can view their own customer data"
  ON public.stripe_customers FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    AND deleted_at IS NULL
  );

-- ======== stripe_subscriptions ========
DROP POLICY IF EXISTS "Users can view their own subscription data" ON public.stripe_subscriptions;

CREATE POLICY "Users can view their own subscription data"
  ON public.stripe_subscriptions FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT stripe_customers.customer_id
      FROM public.stripe_customers
      WHERE stripe_customers.user_id = (select auth.uid())
        AND stripe_customers.deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- ======== stripe_orders ========
DROP POLICY IF EXISTS "Users can view their own order data" ON public.stripe_orders;

CREATE POLICY "Users can view their own order data"
  ON public.stripe_orders FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT stripe_customers.customer_id
      FROM public.stripe_customers
      WHERE stripe_customers.user_id = (select auth.uid())
        AND stripe_customers.deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );
