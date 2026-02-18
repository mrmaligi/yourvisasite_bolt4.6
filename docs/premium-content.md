# VisaBuild Premium Content System

## Overview

The Premium Content system is a **$49 per-visa unlock** feature that provides comprehensive guidance for Australian visa applications.

---

## What Users Get ($49 Unlock)

### 1. Step-by-Step Application Guide
- Mirrors the official DHA online application
- Section-by-section explanations
- Interactive progress tracking
- Auto-save functionality
- Mobile-responsive design

### 2. Document Upload Helper (19 Categories)

| # | Category | Description | Required For |
|---|----------|-------------|--------------|
| 1 | **Identity** | Passport, birth certificate | All visas |
| 2 | **Character** | Police clearances | All visas |
| 3 | **Health** | Medical exams, insurance | Most visas |
| 4 | **English** | IELTS, PTE, TOEFL | Skilled, Student |
| 5 | **Financial** | Bank statements, tax returns | Most visas |
| 6 | **Employment** | References, contracts | Skilled, Work |
| 7 | **Qualifications** | Degrees, transcripts | Skilled, Student |
| 8 | **Skills Assessment** | Assessment authority letters | Skilled |
| 9 | **Relationship** | Marriage certs, joint accounts | Partner, Family |
| 10 | **Accommodation** | Lease, property ownership | Most |
| 11 | **Sponsorship** | Sponsor forms | Sponsored |
| 12 | **Nomination** | State nomination letters | State-nominated |
| 13 | **EOI** | SkillSelect screenshots | Points-tested |
| 14 | **Family Members** | Birth certs, custody docs | Family |
| 15 | **Invitation** | Host invitation letters | Visitor |
| 16 | **Travel History** | Previous visas, stamps | Most |
| 17 | **Genuine Temporary** | GS statements | Student, Visitor |
| 18 | **Business** | Company registration | Business |
| 19 | **Other** | Additional documents | All |

### 3. Example Filled Applications
Sample applications for:
- **Subclass 189** (Skilled Independent) - IT Professional
- **Subclass 820/801** (Partner) - Married Couple  
- **Subclass 500** (Student) - University Student

### 4. Document Checklist with Tooltips
- Visa-specific dynamic checklists
- ? tooltips explaining each requirement
- Conditional logic (show/hide based on circumstances)
- Upload status integration

### 5. Processing Timeline Estimator
- Real-time estimates based on current DHA times
- Visual timeline of application stages
- Comparison with recent cases

### 6. Common Mistakes Section
- Visa-specific pitfalls by section
- Real rejection case studies (anonymized)
- Before/after correction examples

### 7. Lawyer Tips
- Curated advice from verified lawyers
- FAQ with expert responses
- Policy update explanations

---

## Application Guide Structure (8 Sections)

### Section 1: Personal Details
**What to enter:**
- Full legal name (all given names)
- Previous names/aliases
- Date and place of birth
- Gender, relationship status
- Previous visa history

**Common mistakes:**
- Using nicknames instead of legal names
- Not declaring previous names
- Wrong date format (use DD/MM/YYYY)
- Not disclosing previous refusals

### Section 2: Passport & Identity
**What to enter:**
- Current passport details
- Previous passports
- National ID details
- Other citizenships

**Common mistakes:**
- Entering expired passport
- Not listing all citizenships
- Wrong expiry date format
- Unclear passport scans

### Section 3: Character & Health
**What to enter:**
- Criminal history
- Military service
- Previous visa cancellations
- Health exam results (HAP ID)

**Common mistakes:**
- Not declaring minor offenses
- Missing police checks
- Late health examinations
- Hiding immigration issues

### Section 4: Employment History
**What to enter:**
- Last 10 years of employment
- Employer names and addresses
- Positions and dates
- Duties and responsibilities

**Common mistakes:**
- Unexplained gaps
- Overlapping dates
- Not matching nominated occupation
- Inconsistent with CV

### Section 5: Qualifications
**What to enter:**
- All educational qualifications
- Institution details
- Course names and dates
- Professional registrations

**Common mistakes:**
- Missing incomplete qualifications
- Wrong institution names
- Not getting overseas quals assessed

### Section 6: Family Members
**What to enter:**
- All family members (migrating and not)
- Relationships and personal details
- Custody arrangements

**Common mistakes:**
- Not declaring non-migrating family
- Missing custody documentation
- Not obtaining other parent's consent

### Section 7: Sponsorship (if applicable)
**What to enter:**
- Sponsor's personal details
- Sponsor's residency status
- Financial capacity
- Assurance of Support

**Common mistakes:**
- Sponsor doesn't meet income requirements
- Wrong sponsor type for visa
- Missing sponsor proof

### Section 8: Declaration & Submit
**What to confirm:**
- Understanding of visa conditions
- Truthfulness of information
- Consent to information sharing
- Payment of visa charge

**Common mistakes:**
- Not reading declarations
- Not understanding conditions
- Not keeping application copy

---

## Database Schema

```sql
-- Visa Premium Content
CREATE TABLE visa_premium_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visa_id UUID REFERENCES visas(id) ON DELETE CASCADE,
    section_number INTEGER NOT NULL,
    section_title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tips TEXT,
    common_mistakes TEXT,
    examples JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(visa_id, section_number)
);

-- User Visa Purchases (Premium unlocks)
CREATE TABLE user_visa_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    visa_id UUID REFERENCES visas(id),
    stripe_payment_intent_id TEXT,
    amount_cents INTEGER NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, visa_id)
);

-- Document Examples (Templates)
CREATE TABLE document_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visa_id UUID REFERENCES visas(id),
    document_category VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    example_data JSONB,
    is_template BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Document Progress
CREATE TABLE user_document_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    visa_id UUID REFERENCES visas(id),
    document_category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'not_started',
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, visa_id, document_category)
);
```

---

## User Flow: Free → Premium

```
1. User browses /visas (free)
2. Clicks visa → sees basic info
3. "Unlock Premium Content $49" CTA
4. Stripe checkout
5. Payment confirmed
6. Access unlocked:
   - Step-by-step guide
   - Document upload helper
   - Example applications
   - Checklists with tooltips
```

---

## Document Upload Interface

```
┌─────────────────────────────────────────────┐
│  📁 Category: Identity Documents            │
│                                             │
│     ┌─────────────────────────────────┐    │
│     │     📤 Drag & drop files here   │    │
│     │         or click to browse      │    │
│     │                                 │    │
│     │  Supported: PDF, JPG, PNG       │    │
│     │  Max size: 10MB per file        │    │
│     └─────────────────────────────────┘    │
│                                             │
│  ✅ passport_bio.pdf      [3.2MB] [Remove] │
│  ⏳ birth_cert.jpg       [1.8MB] Uploading │
│                                             │
│  [?] See examples and tips →               │
└─────────────────────────────────────────────┘
```

---

## Premium Content Access Control

```sql
-- RLS Policy for premium content
CREATE POLICY "Users can view premium content if purchased"
ON visa_premium_content FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_visa_purchases 
        WHERE user_id = auth.uid() 
        AND visa_id = visa_premium_content.visa_id
    )
);
```

---

## Key Integration Points

1. **Stripe** - Payment for $49 unlock
2. **Supabase Storage** - Document uploads
3. **RLS** - Access control for premium
4. **Lawyer Booking** - Share docs with lawyer

---

*Premium Content Documentation for VisaBuild*
