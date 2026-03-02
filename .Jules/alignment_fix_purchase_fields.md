# Jules Alignment Fix Submission

## Issue: UserVisaPurchase Interface Mismatch (MEDIUM)

**Repository:** mrmaligi2007/yourvisasite_bolt4.6
**Auto-create PR:** true

### Problem

The TypeScript `UserVisaPurchase` interface has outdated fields that don't match the current database schema. Multiple migrations have different column definitions causing inconsistency.

### TypeScript Interface (Current - Outdated)
```typescript
export interface UserVisaPurchase {
  id: string;
  user_id: string;
  visa_id: string;
  amount_cents: number;
  payment_provider: string;   // NOT IN LATEST SCHEMA
  payment_id: string | null;  // NOT IN LATEST SCHEMA
  purchased_at: string;
}
```

### Database Schema (Migration 027 - Current Standard)
```sql
CREATE TABLE IF NOT EXISTS public.user_visa_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,      // Use this instead of payment_id
    stripe_checkout_session_id TEXT,    // Additional tracking
    amount_cents INTEGER NOT NULL DEFAULT 4900,
    currency VARCHAR(3) DEFAULT 'AUD',
    status VARCHAR(20) DEFAULT 'active', -- active, refunded, expired
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE  -- NULL = never
);
```

### Migration 20260222100000 (Incomplete - Missing Payment Fields!)
```sql
-- This migration is missing payment tracking columns!
CREATE TABLE IF NOT EXISTS public.user_visa_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visa_id uuid NOT NULL REFERENCES public.visas(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  purchased_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  UNIQUE(user_id, visa_id)
  -- MISSING: stripe_payment_intent_id, stripe_checkout_session_id, amount_cents, currency
);
```

### Required Changes

1. **Update TypeScript interface** to match Migration 027 schema:
```typescript
export interface UserVisaPurchase {
  id: string;
  user_id: string;
  visa_id: string;
  stripe_payment_intent_id?: string | null;
  stripe_checkout_session_id?: string | null;
  amount_cents: number;
  currency: string;
  status: 'active' | 'refunded' | 'expired';
  purchased_at: string;
  expires_at?: string | null;
}
```

2. **Create migration** to ensure all environments have consistent columns:
   - Add missing columns if they don't exist
   - Migrate data from old `payment_id` to `stripe_payment_intent_id` if needed

3. **Update edge functions** to use correct field names:
   - `supabase/functions/stripe-webhook/index.ts` already uses correct fields
   - Verify `supabase/functions/process-payment/index.ts` consistency

### Files to Modify
- `src/types/database.ts` - Update UserVisaPurchase interface
- Create new migration: `supabase/migrations/20260228000001_fix_purchase_columns.sql`

### Migration Content
```sql
-- Add missing columns to user_visa_purchases if they don't exist
DO $$
BEGIN
    -- Add stripe_payment_intent_id if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_visa_purchases' 
                   AND column_name = 'stripe_payment_intent_id') THEN
        ALTER TABLE public.user_visa_purchases ADD COLUMN stripe_payment_intent_id TEXT;
    END IF;

    -- Add stripe_checkout_session_id if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_visa_purchases' 
                   AND column_name = 'stripe_checkout_session_id') THEN
        ALTER TABLE public.user_visa_purchases ADD COLUMN stripe_checkout_session_id TEXT;
    END IF;

    -- Add currency if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_visa_purchases' 
                   AND column_name = 'currency') THEN
        ALTER TABLE public.user_visa_purchases ADD COLUMN currency VARCHAR(3) DEFAULT 'AUD';
    END IF;

    -- Add status if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_visa_purchases' 
                   AND column_name = 'status') THEN
        ALTER TABLE public.user_visa_purchases ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;

    -- Add expires_at if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_visa_purchases' 
                   AND column_name = 'expires_at') THEN
        ALTER TABLE public.user_visa_purchases ADD COLUMN expires_at TIMESTAMPTZ;
    END IF;
END $$;
```

### Testing
1. Run migration on test database
2. Run TypeScript compilation: `npm run typecheck`
3. Test premium purchase flow
4. Verify purchase records have all required fields

### Impact
**MEDIUM** - Causes data inconsistency and missing payment tracking information.
