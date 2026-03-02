# Jules Alignment Fix Submission

## Issue: Booking Interface/Schema Mismatch (CRITICAL)

**Repository:** mrmaligi2007/yourvisasite_bolt4.6
**Auto-create PR:** true

### Problem

The TypeScript `Booking` interface in `src/types/database.ts` does NOT match the actual database schema defined in migrations. This causes runtime errors when inserting or querying booking data.

### TypeScript Interface (Current)
```typescript
export interface Booking {
  id: string;
  user_id: string;
  lawyer_id: string;
  booking_reference?: string;  // NOT IN SCHEMA
  status: BookingStatus;
  scheduled_at: string;        // NOT IN SCHEMA (use booking_date + start_time)
  duration_minutes: number;    // IN SCHEMA ✅
  timezone: string;            // NOT IN SCHEMA
  meeting_type: string;        // NOT IN SCHEMA
  meeting_link?: string;       // NOT IN SCHEMA
  meeting_address?: string;    // NOT IN SCHEMA
  amount_cents: number;        // IN SCHEMA (as total_price_cents in migration 003)
  is_paid: boolean;            // NOT IN SCHEMA
  paid_at?: string;            // NOT IN SCHEMA
  topic?: string;              // NOT IN SCHEMA
  notes: string | null;        // IN SCHEMA ✅
  pre_meeting_notes?: string;  // NOT IN SCHEMA
  post_meeting_notes?: string; // NOT IN SCHEMA
  reminder_sent_24h: boolean;  // NOT IN SCHEMA
  reminder_sent_1h: boolean;   // NOT IN SCHEMA
  created_at: string;
  updated_at: string;
}
```

### Database Schema (Migration 003 - Correct Version)
```sql
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lawyer_id uuid NOT NULL REFERENCES lawyer.profiles(id) ON DELETE CASCADE,
  slot_id uuid NOT NULL REFERENCES lawyer.consultation_slots(id) ON DELETE CASCADE,  // MISSING IN TS
  duration_minutes integer NOT NULL DEFAULT 30,
  total_price_cents integer NOT NULL DEFAULT 0,
  status public.booking_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### Required Changes

1. **Update TypeScript interface** to match the actual database schema:
   - Add `slot_id: string` (required)
   - Change `amount_cents` to `total_price_cents`
   - Remove phantom fields: `booking_reference`, `scheduled_at`, `timezone`, `meeting_type`, `meeting_link`, `meeting_address`, `is_paid`, `paid_at`, `topic`, `pre_meeting_notes`, `post_meeting_notes`, `reminder_sent_24h`, `reminder_sent_1h`
   - Add `updated_at: string`

2. **Update all files using Booking interface**:
   - `src/hooks/useBookings.ts`
   - `supabase/functions/stripe-checkout/index.ts` (lines referencing booking fields)
   - `supabase/functions/stripe-webhook/index.ts`
   - `supabase/functions/consultation-checkout/index.ts`
   - Any components using booking data

3. **Fix edge functions** to use correct field names when inserting bookings

### Files to Modify
- `src/types/database.ts` - Fix Booking interface
- `src/hooks/useBookings.ts` - Update field references
- `supabase/functions/stripe-checkout/index.ts` - Fix booking insert
- `supabase/functions/stripe-webhook/index.ts` - Fix booking update
- `supabase/functions/consultation-checkout/index.ts` - Fix booking insert

### Testing
1. Run TypeScript compilation: `npm run typecheck`
2. Test booking flow end-to-end
3. Verify database inserts work correctly

### Impact
**CRITICAL** - This mismatch prevents bookings from being created correctly and causes runtime type errors.
