-- Migration: Seed Premium Content for Top 8 Visas
-- Track: 011-014
-- Status: IN_PROGRESS
-- 8 sections per visa: Personal Details, Passport, Character/Health, Employment, Qualifications, Family, Sponsorship, Declaration

-- Section 1: Personal Details (All visas)
INSERT INTO public.visa_premium_content (visa_id, section_number, section_title, content, tips, common_mistakes, estimated_minutes, required_documents) VALUES
((SELECT id FROM public.visas WHERE subclass = '189'), 1, 'Personal Details', 
E'# Section 1: Personal Details

## What Information is Needed

### Full Legal Name
- Enter your complete legal name as shown on your birth certificate and passport
- Include all given names and family name
- Do not use nicknames or abbreviated names

### Previous Names
- List all names you have used including:
  - Maiden names
  - Names changed by deed poll
  - Names from previous marriages
  - Religious or cultural names

### Date and Place of Birth
- Date format: DD/MM/YYYY (e.g., 15/03/1985)
- Place of birth: City, State/Province, Country
- Must match your birth certificate

### Gender
- Select your legal gender as shown on passport
- Options: Male, Female, Non-binary (X)

### Relationship Status
- Current status: Single, Married, De facto, Divorced, Widowed
- Include date of marriage/civil partnership if applicable
- Previous marriages must be declared even if dissolved

### Previous Visa History
- List ALL previous Australian visas (granted or refused)
- Include visa subclass numbers and dates
- Declare any visa cancellations or breaches
- Include visas from other countries if relevant

## Important Notes

### Name Consistency
All documents must show consistent name usage. If you have changed your name, provide:
- Marriage certificate
- Deed poll certificate
- Other legal name change documentation

### Character Requirements
You must declare:
- Criminal convictions (even if spent)
- Pending criminal charges
- Military service history
- Previous visa refusals from any country

### Health Requirements
Be prepared to disclose:
- Current medical conditions
- Previous serious illnesses
- Mental health history
- Any condition requiring ongoing treatment',

E'💡 **Lawyer Tip:** Double-check your name spelling matches your passport EXACTLY. Even small discrepancies can cause delays.',

E'❌ **Common Mistakes:**
- Using nicknames instead of legal names
- Not declaring ALL previous names
- Wrong date format (use DD/MM/YYYY)
- Hiding previous visa refusals
- Not disclosing spent convictions
- Misspelling place of birth',

30,
ARRAY['identity']);

-- Section 2: Passport & Identity (All visas)
INSERT INTO public.visa_premium_content (visa_id, section_number, section_title, content, tips, common_mistakes, estimated_minutes, required_documents) VALUES
((SELECT id FROM public.visas WHERE subclass = '189'), 2, 'Passport & Identity',
E'# Section 2: Passport & Identity

## Current Passport

### Required Information
- Passport number (exactly as shown)
- Country of issue
- Date of issue (DD/MM/YYYY)
- Date of expiry (DD/MM/YYYY)
- Place of issue
- Issuing authority

### Passport Validity
Your passport must be valid for at least 6 months beyond your intended stay in Australia.

### Passport Scan Requirements
Upload clear scans of:
1. **Bio page** (photo page) - Full page, all corners visible
2. **Signature page** (if separate)
3. **All pages with stamps, visas, or endorsements**
4. **Any amendments or observation pages**

## Previous Passports

List all passports you have held in the last 10 years:
- Passport numbers
- Countries of issue
- Date ranges
- Status (expired, cancelled, lost, stolen)

## National Identity Documents

If you have a national identity card (not all countries issue these):
- Card number
- Country of issue
- Issue and expiry dates

## Other Citizenships

You MUST declare:
- All citizenships you currently hold
- Previous citizenships you have held
- Applications for citizenship pending
- Right to reside in other countries

## Document Upload Checklist

✅ Passport bio page (color scan, 300 DPI minimum)
✅ All stamped pages
✅ Previous passports (if relevant to your history)
✅ National ID card (if applicable)
✅ Change of name documentation (if applicable)',

E'💡 **Lawyer Tip:** If your passport is within 12 months of expiry, consider renewing before applying. A full 3-year validity gives you flexibility.',

E'❌ **Common Mistakes:**
- Only uploading the bio page (need stamped pages too)
- Black and white scans (must be color)
- Low resolution scans (blur when zoomed)
- Missing blank pages that were requested
- Not declaring dual citizenship
- Using an expired passport as current',

25,
ARRAY['identity']);

-- Continue with sections 3-8 for 189 visa...
-- (abbreviated for brevity, would include all 8 sections for all 8 visas)

-- Verify insertion
SELECT COUNT(*) as sections_created 
FROM public.visa_premium_content 
WHERE visa_id IN (SELECT id FROM public.visas WHERE subclass IN ('189', '190', '491', '500', '600', '820/801', '309/100', '482'));
