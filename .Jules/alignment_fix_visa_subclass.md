# Jules Alignment Fix Submission

## Issue: Visa Field Name Mismatch in stripe-checkout (CRITICAL)

**Repository:** mrmaligi2007/yourvisasite_bolt4.6
**Auto-create PR:** true

### Problem

`supabase/functions/stripe-checkout/index.ts` queries `visa_subclass` but the database column is `subclass` (in both SQL schema and TypeScript interface).

### Current Code (Broken)
```typescript
// supabase/functions/stripe-checkout/index.ts lines 88-102
const { data: visa, error: visaError } = await supabase
  .from('visas')
  .select('visa_subclass, name')  // ❌ WRONG: column is 'subclass'
  .eq('id', visa_id)
  .single();

// ... later ...
name: `Premium Guide: ${visa.visa_subclass} - ${visa.name}`,  // ❌ WRONG field name
```

### Correct Code
```typescript
const { data: visa, error: visaError } = await supabase
  .from('visas')
  .select('subclass, name')  // ✅ CORRECT
  .eq('id', visa_id)
  .single();

// ... later ...
name: `Premium Guide: ${visa.subclass} - ${visa.name}`,  // ✅ CORRECT
```

### Schema Reference
```sql
-- All visa table definitions use 'subclass', not 'visa_subclass'
CREATE TABLE public.visas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subclass TEXT NOT NULL UNIQUE,  -- ✅ CORRECT COLUMN NAME
  name TEXT NOT NULL,
  ...
);
```

```typescript
// src/types/database.ts
export interface Visa {
  id: string;
  subclass: string;  // ✅ CORRECT FIELD NAME
  name: string;
  ...
}
```

### Other Functions (Already Correct)
- `supabase/functions/process-payment/index.ts` - Uses `subclass_number` (also valid)
- `supabase/functions/stripe-webhook/index.ts` - Uses `subclass_number` (also valid)

### Required Changes
1. Fix line 90 in `supabase/functions/stripe-checkout/index.ts`: Change `visa_subclass` to `subclass` in the select
2. Fix line 102: Change `visa.visa_subclass` to `visa.subclass`

### Files to Modify
- `supabase/functions/stripe-checkout/index.ts` - 2 line changes

### Testing
1. Test premium visa purchase flow
2. Verify Stripe checkout session creates with correct product name
3. Check that visa data is correctly fetched

### Impact
**CRITICAL** - Stripe checkout for premium visas fails because the visa query returns null due to invalid column name.
