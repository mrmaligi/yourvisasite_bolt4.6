# Complete Australian Visa Catalog

> **Version:** 2.0 - Complete  
> **Last Updated:** February 2026  
> **Source:** Department of Home Affairs (DHA) Australia  
> **Total Visas:** 100+ subclasses across 15 categories  
> **Official Website:** https://immi.homeaffairs.gov.au/visas

---

## Table of Contents

1. [Overview](#overview)
2. [Visa Categories Summary](#visa-categories-summary)
3. [Complete Visa Catalog](#complete-visa-catalog)
4. [Database Schema](#database-schema)
5. [Document Checklist Categories](#document-checklist-categories)
6. [SQL Seed Data](#sql-seed-data)
7. [MVP Priority](#mvp-priority)

---

## Overview

This document contains the **complete catalog** of Australian visa subclasses for the VisaBuild application. All 100+ visa types are documented with official DHA links, processing times, costs, and requirements.

**Scope:** Australia ONLY — all subclasses reference the Australian Department of Home Affairs.

---

## Visa Categories Summary

| Category | Count | Description |
|----------|-------|-------------|
| Visitor | 6 | Short-term tourism, business, medical |
| Study & Training | 5 | Students, graduates, trainees |
| Skilled Migration | 9 | Permanent and provisional skilled visas |
| Employer Sponsored | 6 | Work visas via employer nomination |
| Partner & Family | 13 | Spouses, partners, family members |
| Parent | 7 | Parent migration pathways |
| Child & Adoption | 5 | Child migration |
| Other Family | 8 | Aged, carer, remaining relative |
| Business & Investment | 7 | Business owners and investors |
| Work & Holiday | 2 | Youth mobility visas |
| Bridging | 7 | Temporary status while awaiting decision |
| Humanitarian | 8 | Protection and refugee visas |
| Special & Other | 5 | NZ citizens, residents, transit |

---

## Complete Visa Catalog

### 1. VISITOR VISAS (Short-term stays)

| Subclass | Name | Duration | Cost (AUD) | Processing | Key Requirements |
|----------|------|----------|------------|------------|------------------|
| **600** | Visitor (Tourist Stream) | 3-12 months | $195 | 1-4 weeks | Genuine visitor, sufficient funds |
| **600** | Visitor (Sponsored Family) | 3-12 months | $195 | 1-4 weeks | Family sponsor in Australia |
| **600** | Visitor (Business Stream) | 3-12 months | $195 | 1-4 weeks | Business visitor purpose |
| **601** | Electronic Travel Authority (ETA) | 12 months (3m stays) | $20 | Instant-24h | ETA-eligible passports |
| **651** | eVisitor | 12 months (3m stays) | Free | 1-3 days | European passport holders |
| **602** | Medical Treatment | Variable | Variable | 1-4 weeks | Medical treatment in Australia |
| **771** | Transit | 72 hours | Free | 1-2 weeks | Transit through Australia |

### 2. STUDY & TRAINING VISAS

| Subclass | Name | Duration | Cost (AUD) | Processing | Key Requirements |
|----------|------|----------|------------|------------|------------------|
| **500** | Student | Course duration | $710 | 1-4 months | CoE, GTE, OSHC, funds, English |
| **590** | Student Guardian | Course duration | $710 | 1-4 months | Parent of student under 18 |
| **485** | Temporary Graduate | 2-4 years | $1,895 | 2-6 months | Australian degree, English |
| **476** | Skilled - Recognised Graduate | 18 months | $410 | 3-6 months | Engineering degree |
| **407** | Training | 2 years | $310 | 2-4 months | Sponsored training program |

### 3. SKILLED MIGRATION VISAS (Permanent/Provisional)

| Subclass | Name | Type | Cost (AUD) | Processing | Key Requirements |
|----------|------|------|------------|------------|------------------|
| **189** | Skilled Independent | Permanent | $4,640 | 8-18 months | Points 65+, MLTSSL, skills assessment |
| **190** | Skilled Nominated | Permanent | $4,640 | 9-19 months | State nomination, points 65+ |
| **191** | Skilled Regional (Permanent) | Permanent | $465 | 6-12 months | Held 491/494, 3 years regional |
| **491** | Skilled Work Regional (Provisional) | 5 years | $4,640 | 12-25 months | State/family sponsor, points 65+ |
| **887** | Skilled Regional | Permanent | $425 | 12-18 months | Held 489/495/496, 2 years regional |

### 4. EMPLOYER SPONSORED VISAS

| Subclass | Name | Type | Cost (AUD) | Processing | Key Requirements |
|----------|------|------|------------|------------|------------------|
| **186** | Employer Nomination Scheme | Permanent | $4,640 | 6-12 months | Employer nomination, 3 years exp |
| **482** | Temporary Skill Shortage (TSS) | 1-4 years | $1,490 | 2-8 weeks | Employer sponsor, occupation on CSOL |
| **494** | Skilled Employer Sponsored Regional | 5 years | $4,640 | 6-12 months | Regional employer, 3 years exp |
| **187** | Regional Sponsored Migration Scheme | Permanent | $4,640 | N/A | Closed to new applicants |
| **400** | Temporary Work (Short Stay Specialist) | 3-6 months | $310 | 2-4 weeks | Short-term specialist work |
| **403** | Temporary Work (International Relations) | 2 years | $310 | 2-4 weeks | Government agreements |
| **408** | Temporary Activity | 2 years | $310 | 2-4 weeks | Specific activities/events |

### 5. GLOBAL TALENT VISAS

| Subclass | Name | Type | Cost (AUD) | Processing | Key Requirements |
|----------|------|------|------------|------------|------------------|
| **858** | Global Talent (Independent) | Permanent | $4,765 | 2-4 months | Internationally recognized talent |

### 6. PARTNER VISAS

| Subclass | Name | Type | Cost (AUD) | Processing | Key Requirements |
|----------|------|------|------------|------------|------------------|
| **820/801** | Partner (Onshore) | Temp → Perm | $8,850 | 18-30 months | Genuine relationship, sponsor |
| **309/100** | Partner (Offshore) | Prov → Perm | $8,850 | 15-26 months | Genuine relationship, offshore |
| **300** | Prospective Marriage | 9 months | $8,850 | 12-18 months | Fiancé, intention to marry |

### 7. PARENT VISAS

| Subclass | Name | Type | Cost (AUD) | Processing | Key Requirements |
|----------|------|------|------------|------------|------------------|
| **143** | Contributory Parent | Permanent | $4,765 + $43,600 | 6-12 years | Balance of family test, AoS |
| **173** | Contributory Parent (Temporary) | 2 years | $2,540 + $29,130 | 6-12 years | Converts to 143 |
| **103** | Parent | Permanent | $4,990 | 30+ years | Very long queue |
| **804** | Aged Parent | Permanent | $4,990 | 30+ years | Pension age, onshore |
| **864** | Contributory Aged Parent | Permanent | $4,765 + $43,600 | 6-12 years | Pension age, onshore |
| **884** | Contributory Aged Parent (Temp) | 2 years | $2,540 + $29,130 | 6-12 years | Converts to 864 |
| **870** | Sponsored Parent (Temporary) | 3-5 years | $1,000-$5,000 | 4-6 months | No PR pathway |

### 8. CHILD & ADOPTION VISAS

| Subclass | Name | Type | Cost (AUD) | Processing | Key Requirements |
|----------|------|------|------------|------------|------------------|
| **101** | Child | Permanent | $3,055 | 12-24 months | Under 18, single, offshore |
| **802** | Child (Onshore) | Permanent | $3,055 | 12-24 months | Under 18, onshore |
| **102** | Adoption | Permanent | $3,055 | 12-24 months | Overseas adoption |
| **445** | Dependent Child | Temporary | $715 | 6-12 months | Child of 309/820 holder |

### 9. OTHER FAMILY VISAS

| Subclass | Name | Type | Cost (AUD) | Processing | Key Requirements |
|----------|------|------|------------|------------|------------------|
| **114** | Aged Dependent Relative (Offshore) | Permanent | $4,115 | 12-24 months | Aged, dependent on relative |
| **838** | Aged Dependent Relative (Onshore) | Permanent | $3,055 | 12-24 months | Aged, onshore |
| **115** | Remaining Relative (Offshore) | Permanent | $4,115 | 12-24 months | All near relatives in Australia |
| **835** | Remaining Relative (Onshore) | Permanent | $3,055 | 12-24 months | Onshore version |
| **116** | Carer (Offshore) | Permanent | $4,115 | 12-24 months | Care for relative with condition |
| **836** | Carer (Onshore) | Permanent | $3,055 | 12-24 months | Onshore version |
| **117** | Orphan Relative (Offshore) | Permanent | $1,870 | 12-24 months | Under 18, parents deceased |
| **837** | Orphan Relative (Onshore) | Permanent | $1,870 | 12-24 months | Onshore version |

### 10. BUSINESS & INVESTMENT VISAS

| Subclass | Name | Type | Cost (AUD) | Processing | Key Requirements |
|----------|------|------|------------|------------|------------------|
| **188** | Business Innovation & Investment (Provisional) | 5 years | $6,270 | 12-24 months | State nomination, business history |
| **888** | Business Innovation & Investment (Permanent) | Permanent | $3,490 | 12-24 months | Held 188, met obligations |
| **132** | Business Talent | Permanent | $7,855 | N/A | Closed to new applicants |
| **890** | Business Owner | Permanent | $2,505 | N/A | Closed to new applicants |
| **891** | Investor | Permanent | $2,505 | N/A | Closed to new applicants |
| **892** | State/Territory Sponsored Business Owner | Permanent | $2,505 | N/A | Closed to new applicants |
| **893** | State/Territory Sponsored Investor | Permanent | $2,505 | N/A | Closed to new applicants |

**188 Streams:**
- Business Innovation: AUD 1.25M net assets, AUD 750K turnover
- Investor: AUD 2.5M investment
- Significant Investor: AUD 5M investment
- Entrepreneur: AUD 200K funding for innovative enterprise

### 11. WORK & HOLIDAY VISAS

| Subclass | Name | Type | Cost (AUD) | Processing | Key Requirements |
|----------|------|------|------------|------------|------------------|
| **417** | Working Holiday | 12 months | $635 | 1-4 weeks | Age 18-30, eligible passport |
| **462** | Work and Holiday | 12 months | $635 | 1-4 weeks | Age 18-30, education requirement |

### 12. BRIDGING VISAS

| Subclass | Name | Duration | Cost | Key Requirements |
|----------|------|----------|------|------------------|
| **010** | Bridging Visa A (BVA) | Until decision | Free | Applied onshore for substantive visa |
| **020** | Bridging Visa B (BVB) | 3-12 months | $180 | Hold BVA, need to travel |
| **030** | Bridging Visa C (BVC) | Until decision | Free | Applied while unlawful |
| **040** | Bridging Visa D (BVD) | 5 working days | Free | Unlawful, cannot apply for BVC |
| **041** | Bridging Visa D (BVD) | 5 working days | Free | Unlawful, cannot apply for BVC |
| **050** | Bridging Visa E (BVE) | Until decision | Free | Resolve immigration status |
| **051** | Bridging Visa E (BVE) | Until decision | Free | Apply for protection visa |

### 13. HUMANITARIAN & PROTECTION VISAS

| Subclass | Name | Type | Cost | Processing | Key Requirements |
|----------|------|------|------|------------|------------------|
| **866** | Protection | Permanent | Free | Variable | Onshore protection claim |
| **200** | Refugee | Permanent | Free | Variable | UNHCR referral offshore |
| **201** | In-country Special Humanitarian | Permanent | Free | Variable | In-country, compelling reasons |
| **202** | Global Special Humanitarian | Permanent | Free | Variable | Substantial discrimination |
| **203** | Woman at Risk | Permanent | Free | Variable | UNHCR referral, woman at risk |
| **204** | Emergency Rescue | Permanent | Free | Variable | Immediate threat |
| **785** | Temporary Protection | 3 years | Free | Variable | Boat arrival protection claim |
| **790** | Safe Haven Enterprise | 5 years | Free | Variable | Work in regional area |

### 14. SPECIAL CATEGORY VISAS

| Subclass | Name | Type | Cost | Key Requirements |
|----------|------|------|------|------------------|
| **444** | Special Category Visa (NZ Citizen) | Temporary | Free | NZ citizen on arrival |
| **461** | NZ Citizen Family Relationship | 5 years | $380 | Family of NZ citizen |

### 15. RESIDENT RETURN VISAS

| Subclass | Name | Type | Cost | Key Requirements |
|----------|------|------|------|------------------|
| **155** | Resident Return (5 years) | 5 years | $425 | PR holder, lived in AU 2 of 5 years |
| **157** | Resident Return (3 months) | 3 months | $425 | PR holder, compelling reasons |

### 16. OTHER VISAS

| Subclass | Name | Type | Cost | Key Requirements |
|----------|------|------|------|------------------|
| **418** | Educational (Exchange) | Variable | Variable | Educational exchange programs |
| **426** | Domestic Worker (Diplomatic/Consular) | Variable | Variable | Diplomatic domestic workers |
| **427** | Domestic Worker (Exchange) | Variable | Variable | Exchange program domestic workers |
| **428** | Religious Worker | 2 years | $310 | Religious activities |
| **442** | Occupational Trainee | Variable | Variable | Occupational training (replaced by 407) |
| **456** | Business (Short Stay) | Variable | Variable | Replaced by 600 |
| **457** | Work (Skilled) | Variable | Variable | Replaced by TSS 482 |
| **475** | Skilled - Regional Sponsored | Variable | Variable | Replaced by 489, then 491 |
| **487** | Skilled - Regional Sponsored | Variable | Variable | Replaced by 489, then 491 |
| **489** | Skilled - Regional (Provisional) | Variable | Variable | Replaced by 491 |
| **495** | Skilled - Independent Regional | Variable | Variable | Replaced by 489 |
| **496** | Skilled - Independent Regional | Variable | Variable | Replaced by 489 |
| **497** | Graduate - Skilled | Variable | Variable | Replaced by 485 |
| **570** | Independent ELICOS Sector | Variable | Variable | Replaced by 500 |
| **571** | Schools Sector | Variable | Variable | Replaced by 500 |
| **572** | Vocational Education and Training Sector | Variable | Variable | Replaced by 500 |
| **573** | Higher Education Sector | Variable | Variable | Replaced by 500 |
| **574** | Postgraduate Research Sector | Variable | Variable | Replaced by 500 |
| **575** | Non-Award Sector | Variable | Variable | Replaced by 500 |
| **576** | Foreign Affairs or Defence Sector | Variable | Variable | Replaced by 500 |
| **580** | Student Guardian | Variable | Variable | Replaced by 590 |
| **675** | Medical Treatment (Short Stay) | Variable | Variable | Replaced by 602 |
| **679** | Sponsored Family Visitor | Variable | Variable | Replaced by 600 |
| **685** | Medical Treatment (Long Stay) | Variable | Variable | Replaced by 602 |
| **801** | Partner (permanent) | Variable | Variable | Combined with 820 |
| **814** | Interdependency (permanent) | Variable | Variable | Replaced by Partner visas |
| **820** | Partner (temporary) | Variable | Variable | Combined with 801 |
| **826** | Interdependency (temporary) | Variable | Variable | Replaced by Partner visas |
| **851** | Resolution of Status | Variable | Variable | Special circumstances |
| **855** | Labour Agreement | Variable | Variable | Replaced by 186/482 |
| **856** | Employer Nomination Scheme (Old) | Variable | Variable | Replaced by 186 |
| **857** | Regional Sponsored Migration Scheme (Old) | Variable | Variable | Replaced by 187 |
| **884** | Medical Treatment | Variable | Variable | Replaced by 602 |
| **942** | Declaratory (Child) | Variable | Variable | For children of Australians |
| **977** | Maritime Crew | Variable | Variable | For maritime crew |
| **988** | Maritime Crew (Transit) | Variable | Variable | For maritime crew transit |
| **995** | Diplomatic (Temporary) | Variable | Variable | Diplomatic/official passport |

---

## Database Schema

### Visas Table (Complete)

```sql
CREATE TABLE visas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    subclass VARCHAR(10) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    
    -- Official Links
    official_link VARCHAR(500),
    processing_time_link VARCHAR(500),
    
    -- Content (JSON for flexibility)
    summary TEXT,
    eligibility_criteria JSONB,
    requirements JSONB,
    process_steps JSONB,
    document_categories JSONB,
    
    -- Financial
    base_cost_aud DECIMAL(10,2),
    additional_costs_note TEXT,
    
    -- Processing Times (months)
    processing_time_min_months INTEGER,
    processing_time_max_months INTEGER,
    processing_time_notes TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_open_new_applications BOOLEAN DEFAULT true,
    is_closed_to_new_applicants BOOLEAN DEFAULT false,
    
    -- Premium/Paid
    is_premium_content BOOLEAN DEFAULT true,
    price_cents INTEGER DEFAULT 4900, -- $49 AUD
    
    -- Display
    display_order INTEGER DEFAULT 0,
    search_keywords TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_subclass UNIQUE (subclass)
);

-- Indexes
CREATE INDEX idx_visas_category ON visas(category);
CREATE INDEX idx_visas_subclass ON visas(subclass);
CREATE INDEX idx_visas_is_active ON visas(is_active);
CREATE INDEX idx_visas_search ON visas USING gin(to_tsvector('english', search_keywords));
```

### Document Categories Table

```sql
CREATE TABLE document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Visa Document Requirements (Junction)

```sql
CREATE TABLE visa_document_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visa_id UUID REFERENCES visas(id) ON DELETE CASCADE,
    document_category_id UUID REFERENCES document_categories(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT true,
    notes TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(visa_id, document_category_id)
);
```

---

## Document Checklist Categories

| Key | Name | Description | Example Documents |
|-----|------|-------------|-------------------|
| identity | Identity Documents | Passport, birth certificate | Passport, birth cert, national ID |
| character | Character Documents | Police clearances | Police checks, Form 80 |
| health | Health Examinations | Medical checks | Health exam, medical reports |
| english | English Language | English proficiency | IELTS, PTE, TOEFL results |
| skills_assessment | Skills Assessment | Professional skills | Skills assessment letter |
| employment | Employment Documents | Work history | Contracts, references, payslips |
| qualifications | Qualifications | Educational certs | Degrees, diplomas, transcripts |
| financial | Financial Documents | Proof of funds | Bank statements, tax returns |
| relationship | Relationship Evidence | Partner visa proof | Photos, joint accounts, Form 888 |
| family | Family Documents | Family evidence | Birth certs, marriage certs |
| sponsorship | Sponsorship Documents | Sponsor forms | Sponsor forms, sponsor ID |
| travel | Travel Documents | Travel intentions | Itinerary, travel history |
| study | Study Documents | Student evidence | CoE, transcripts, qualifications |
| insurance | Health Insurance | OSHC/OVHC | Health insurance certificate |
| forms | Application Forms | Completed forms | Application forms, declarations |
| photos | Photographs | Passport photos | Recent passport photos |
| biometrics | Biometrics | Biometric info | Biometrics appointment |
| business | Business Documents | Business ownership | Business reg, financial statements |
| investment | Investment Documents | Investment evidence | Investment statements, valuations |

### Visa-Specific Requirements Mapping

**Skilled Migration (189, 190, 491):**
identity, character, health, english, skills_assessment, employment, qualifications, forms, photos, biometrics

**Employer Sponsored (186, 482, 494):**
identity, character, health, english, skills_assessment, employment, qualifications, sponsorship, forms, photos

**Partner Visas (820/801, 309/100):**
identity, character, health, relationship, family, financial, sponsorship, forms, photos

**Student (500):**
identity, character, health, english, study, financial, insurance, forms, photos

**Visitor (600):**
identity, financial, travel, forms, photos

**Business/Investor (188, 888):**
identity, character, health, english, business, investment, financial, employment, forms, photos

**Parent (143, 173, 103):**
identity, character, health, family, financial, sponsorship, forms, photos

**Child (101, 802):**
identity, health, family, forms, photos

---

## SQL Seed Data

### Document Categories

```sql
INSERT INTO document_categories (key, name, description, icon, display_order) VALUES
('identity', 'Identity Documents', 'Passport, birth certificate, and identity documents', 'id-card', 1),
('character', 'Character Documents', 'Police clearances and character evidence', 'shield-check', 2),
('health', 'Health Examinations', 'Medical examination results', 'heart-pulse', 3),
('english', 'English Language', 'English test results', 'languages', 4),
('skills_assessment', 'Skills Assessment', 'Skills assessment from authority', 'certificate', 5),
('employment', 'Employment Documents', 'Work references and contracts', 'briefcase', 6),
('qualifications', 'Qualifications', 'Educational certificates and transcripts', 'graduation-cap', 7),
('financial', 'Financial Documents', 'Proof of funds and financial capacity', 'wallet', 8),
('relationship', 'Relationship Evidence', 'Proof of genuine relationship', 'heart', 9),
('family', 'Family Documents', 'Birth and marriage certificates', 'users', 10),
('sponsorship', 'Sponsorship Documents', 'Sponsor forms and evidence', 'user-check', 11),
('travel', 'Travel Documents', 'Travel history and intentions', 'plane', 12),
('study', 'Study Documents', 'CoE and academic records', 'book-open', 13),
('insurance', 'Health Insurance', 'OSHC or OVHC evidence', 'medical-cross', 14),
('forms', 'Application Forms', 'Completed application forms', 'file-text', 15),
('photos', 'Photographs', 'Passport photos', 'camera', 16),
('biometrics', 'Biometrics', 'Biometric information', 'fingerprint', 17),
('business', 'Business Documents', 'Business registration and financials', 'building', 18),
('investment', 'Investment Documents', 'Investment evidence', 'trending-up', 19);
```

### MVP Tier 1 Visas (8 High-Volume Visas)

```sql
INSERT INTO visas (name, subclass, category, description, official_link, base_cost_aud, processing_time_min_months, processing_time_max_months, is_active, is_open_new_applications, is_premium_content, display_order, search_keywords) VALUES
('Skilled Independent Visa', '189', 'Skilled Migration', 'Permanent visa for invited workers with skills Australia needs. Live and work anywhere permanently.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189', 4640.00, 8, 18, true, true, true, 1, 'skilled independent points migration permanent 189 work live anywhere'),
('Skilled Nominated Visa', '190', 'Skilled Migration', 'Permanent visa for skilled workers nominated by a state or territory government.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190', 4640.00, 9, 19, true, true, true, 2, 'skilled nominated state sponsored migration permanent 190'),
('Skilled Work Regional (Provisional)', '491', 'Skilled Migration', '5-year provisional visa for skilled workers nominated by state or sponsored by family in regional area.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-491', 4640.00, 12, 25, true, true, true, 3, 'skilled regional provisional points migration 491 regional area'),
('Partner Visa (Onshore)', '820/801', 'Family', 'Combined temporary and permanent visa for partners of Australian citizens/PRs. Applied in Australia.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore', 8850.00, 18, 30, true, true, true, 4, 'partner spouse wife husband de facto relationship 820 801 permanent'),
('Partner Visa (Offshore)', '309/100', 'Family', 'Combined provisional and permanent visa for partners applied outside Australia.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-provisional-309', 8850.00, 15, 26, true, true, true, 5, 'partner spouse offshore 309 100 provisional permanent relationship'),
('Student Visa', '500', 'Student', 'Visa for international students to study full-time at Australian institutions.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500', 710.00, 1, 4, true, true, true, 6, 'student study education university college vocational school 500 coe'),
('Visitor Visa', '600', 'Visitor', 'Temporary visa for tourism, visiting family, or business visits to Australia.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600', 195.00, 0, 1, true, true, true, 7, 'visitor tourist tourism holiday travel business 600'),
('Temporary Skill Shortage Visa', '482', 'Employer Sponsored', 'Temporary visa for skilled workers sponsored by approved employer. 1-4 years duration.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482', 1490.00, 0, 2, true, true, true, 8, 'temporary skill shortage tss employer sponsored work visa 482');
```

### MVP Tier 2 Visas (6 Additional Visas)

```sql
INSERT INTO visas (name, subclass, category, description, official_link, base_cost_aud, processing_time_min_months, processing_time_max_months, is_active, is_open_new_applications, is_premium_content, display_order, search_keywords) VALUES
('Employer Nomination Scheme', '186', 'Employer Sponsored', 'Permanent visa for skilled workers nominated by Australian employer.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186', 4640.00, 6, 12, true, true, true, 9, 'employer nomination scheme ens permanent 186'),
('Prospective Marriage Visa', '300', 'Family', '9-month visa for fiancés to enter Australia and marry their sponsor.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/prospective-marriage-300', 8850.00, 12, 18, true, true, true, 10, 'fiancé prospective marriage fiance 300'),
('Temporary Graduate Visa', '485', 'Student', '2-4 year visa for international graduates to live, study, and work in Australia.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485', 1895.00, 2, 6, true, true, true, 11, 'temporary graduate post study work 485'),
('Skilled Employer Sponsored Regional', '494', 'Employer Sponsored', '5-year provisional visa for skilled workers sponsored by regional employer.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-employer-sponsored-regional-494', 4640.00, 6, 12, true, true, true, 12, 'employer sponsored regional provisional 494'),
('Working Holiday Visa', '417', 'Work & Holiday', '12-month visa for young adults to holiday and work in Australia.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417', 635.00, 0, 1, true, true, true, 13, 'working holiday backpacker 417'),
('Work and Holiday Visa', '462', 'Work & Holiday', 'Similar to 417 with education requirement for different countries.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462', 635.00, 0, 1, true, true, true, 14, 'work and holiday 462 usa');
```

### Remaining Tier 3+ Visas (Complete Catalog)

```sql
-- Skilled Migration
INSERT INTO visas (name, subclass, category, description, official_link, base_cost_aud, processing_time_min_months, processing_time_max_months, is_active, is_open_new_applications, is_premium_content, display_order) VALUES
('Permanent Residence (Skilled Regional)', '191', 'Skilled Migration', 'Permanent visa for holders of 491/494 who lived 3+ years in regional Australia.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-regional-191', 465.00, 6, 12, true, true, true, 15),
('Skilled Regional Visa', '887', 'Skilled Migration', 'Permanent visa for provisional skilled visa holders who lived in regional Australia.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-regional-887', 425.00, 12, 18, true, true, true, 16);

-- Family - Parents
INSERT INTO visas (name, subclass, category, description, official_link, base_cost_aud, processing_time_min_months, processing_time_max_months, is_active, is_open_new_applications, is_premium_content, display_order) VALUES
('Contributory Parent Visa', '143', 'Family', 'Permanent visa for parents of settled Australians. Faster processing, higher cost.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-parent-143', 4765.00, 72, 144, true, true, true, 20),
('Contributory Parent (Temporary)', '173', 'Family', '2-year temporary visa for parents, can apply for 143 later.', 'https://immi.homeaffairs.gov.au/visas/getting-a