# Australian Visa Data Documentation

> **Version:** 1.0  
> **Last Updated:** February 2026  
> **Source:** Department of Home Affairs (DHA) Australia  
> **Official Website:** https://immi.homeaffairs.gov.au/visas

---

## Table of Contents

1. [Overview](#overview)
2. [Visa Categories & Subclasses](#visa-categories--subclasses)
3. [Database Schema](#database-schema)
4. [Document Checklist Categories](#document-checklist-categories)
5. [Sample SQL Insert Statements](#sample-sql-insert-statements)
6. [MVP Priority Recommendations](#mvp-priority-recommendations)

---

## Overview

This document contains comprehensive data on Australian visa types, subclasses, requirements, and document checklists for the VisaBuild application. All data is compiled from official Department of Home Affairs sources.

---

## Visa Categories & Subclasses

### 1. SKILLED MIGRATION VISAS

| Subclass | Name | Category | Description | Processing Time | Key Requirements |
|----------|------|----------|-------------|-----------------|------------------|
| **189** | Skilled Independent | Skilled | Permanent visa for invited workers with skills Australia needs | 8-18 months | Points test 65+, occupation on MLTSSL, skills assessment, English |
| **190** | Skilled Nominated | Skilled | Permanent visa nominated by state/territory government | 9-19 months | State nomination, points test 65+, occupation on list |
| **191** | Skilled Regional (Permanent) | Skilled | Permanent for 491/494 holders after 3 years regional | 6-12 months | Held 491/494 for 3 years, lived in regional area |
| **491** | Skilled Work Regional (Provisional) | Skilled | 5-year provisional for regional workers | 12-25 months | State nomination OR family sponsorship, points test 65+ |
| **494** | Skilled Employer Sponsored Regional | Employer | 5-year provisional sponsored by regional employer | 6-12 months | Regional employer nomination, 3 years experience |

### 2. EMPLOYER SPONSORED VISAS

| Subclass | Name | Category | Description | Processing Time | Key Requirements |
|----------|------|----------|-------------|-----------------|------------------|
| **482** | Temporary Skill Shortage (TSS) | Employer | Temporary visa 1-4 years for skilled workers | 2-8 weeks | Employer sponsorship, occupation on CSOL, English |
| **186** | Employer Nomination Scheme | Employer | Permanent visa nominated by Australian employer | 6-12 months | Employer nomination, 3 years experience, under 45 |

### 3. FAMILY VISAS

#### Partner Visas
| Subclass | Name | Category | Description | Processing Time | Key Requirements |
|----------|------|----------|-------------|-----------------|------------------|
| **820/801** | Partner Visa (Onshore) | Family | Combined temporary/permanent for partners in Australia | 18-30 months | Genuine relationship, sponsor eligibility |
| **309/100** | Partner Visa (Offshore) | Family | Combined provisional/permanent applied outside Australia | 15-26 months | Same as 820/801 but offshore |
| **300** | Prospective Marriage | Family | 9-month visa for fiancés to marry in Australia | 12-18 months | Intention to marry within 9 months, met in person |

#### Parent Visas
| Subclass | Name | Category | Description | Processing Time | Key Requirements |
|----------|------|----------|-------------|-----------------|------------------|
| **143** | Contributory Parent | Family | Permanent visa for parents (faster, higher cost) | 6-12 years | Balance of family test, Assurance of Support |
| **103** | Parent Visa | Family | Permanent visa for parents (lower cost, very long queue) | 30+ years | Long processing queue |
| **870** | Sponsored Parent (Temporary) | Family | 3-5 year temporary visa for parents | 4-6 months | No permanent pathway, private health insurance |

#### Child Visas
| Subclass | Name | Category | Description | Processing Time | Key Requirements |
|----------|------|----------|-------------|-----------------|------------------|
| **101** | Child Visa | Family | Permanent for children outside Australia | 12-24 months | Under 18, single, sponsored by parent |
| **802** | Child Visa (Onshore) | Family | Permanent for children in Australia | 12-24 months | Same as 101 but onshore |
| **445** | Dependent Child | Family | Temporary for children of temporary partner visa holders | 6-12 months | Parent holds 309/820 |

### 4. STUDENT VISAS

| Subclass | Name | Category | Description | Processing Time | Key Requirements |
|----------|------|----------|-------------|-----------------|------------------|
| **500** | Student Visa | Student | Full-time study at Australian institutions | 1-4 months | CoE, GTE requirement, financial capacity, OSHC |
| **590** | Student Guardian | Student | For guardians of students under 18 | 1-4 months | Parent/guardian of student under 18 |

### 5. VISITOR VISAS

| Subclass | Name | Category | Description | Processing Time | Key Requirements |
|----------|------|----------|-------------|-----------------|------------------|
| **600** | Visitor Visa | Visitor | Tourism, visiting family, or business (3-12 months) | 1-4 weeks | Genuine visitor, sufficient funds |
| **651** | eVisitor | Visitor | Free visa for eligible passports (3 months) | 1-3 days | European passport holders only |
| **601** | Electronic Travel Authority | Visitor | Electronic visa for eligible passports | Instant-24 hours | ETA-eligible passports |

### 6. BUSINESS & INVESTOR VISAS

| Subclass | Name | Category | Description | Processing Time | Key Requirements |
|----------|------|----------|-------------|-----------------|------------------|
| **188** | Business Innovation & Investment (Provisional) | Business | 5-year provisional for business owners/investors | 12-24 months | State nomination, business/investment history |
| **888** | Business Innovation & Investment (Permanent) | Business | Permanent for 188 holders who meet requirements | 12-24 months | Held 188, met business/investment obligations |

### 7. WORK & HOLIDAY VISAS

| Subclass | Name | Category | Description | Processing Time | Key Requirements |
|----------|------|----------|-------------|-----------------|------------------|
| **417** | Working Holiday | Work & Holiday | 12-month visa for young adults (18-30/35) | 1-4 weeks | Age 18-30, eligible passport, sufficient funds |
| **462** | Work and Holiday | Work & Holiday | Similar to 417 with education requirement | 1-4 weeks | Age 18-30, functional English, eligible passport |

### 8. TEMPORARY GRADUATE VISAS

| Subclass | Name | Category | Description | Processing Time | Key Requirements |
|----------|------|----------|-------------|-----------------|------------------|
| **485** | Temporary Graduate | Graduate | 2-4 years for international graduates | 2-6 months | Completed Australian qualification (2 years), English |

### 9. BRIDGING & OTHER VISAS

| Subclass | Name | Category | Description | Key Requirements |
|----------|------|----------|-------------|------------------|
| **010** | Bridging Visa A | Bridging | Lawful stay while application processed | Applied for substantive visa onshore |
| **444** | Special Category Visa (NZ) | Special | Automatic for NZ citizens on arrival | NZ citizen, valid passport |
| **461** | NZ Citizen Family Relationship | Special | 5-year temporary for non-NZ family of NZ citizens | Family unit of NZ citizen |

---

## Database Schema

### Proposed `visas` Table Structure

```sql
CREATE TABLE visas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subclass VARCHAR(10) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    official_link VARCHAR(500),
    summary TEXT,
    eligibility_criteria JSONB,
    requirements JSONB,
    process_steps JSONB,
    document_categories JSONB,
    base_cost_aud DECIMAL(10,2),
    typical_processing_time_min_months INTEGER,
    typical_processing_time_max_months INTEGER,
    is_active BOOLEAN DEFAULT true,
    is_premium_content BOOLEAN DEFAULT false,
    price_cents INTEGER DEFAULT 4900, -- $49 AUD
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visas_category ON visas(category);
CREATE INDEX idx_visas_subclass ON visas(subclass);
CREATE INDEX idx_visas_is_active ON visas(is_active);
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Document Checklist Categories

| Key | Name | Description | Typical Documents |
|-----|------|-------------|-------------------|
| **identity** | Identity Documents | Passport, birth certificate | Passport, birth certificate, national ID |
| **character** | Character Documents | Police clearances | Police certificates, Form 80 |
| **health** | Health Examinations | Medical checks | Health referrals, medical reports |
| **english** | English Language | English proficiency | IELTS, PTE, TOEFL results |
| **skills_assessment** | Skills Assessment | Professional assessment | Skills assessment outcome letter |
| **employment** | Employment Documents | Work history | Contracts, reference letters, CV |
| **qualifications** | Qualifications | Education certificates | Degrees, diplomas, transcripts |
| **financial** | Financial Documents | Proof of funds | Bank statements, tax returns |
| **relationship** | Relationship Evidence | Partner visa proof | Joint accounts, photos, Form 888 |
| **family** | Family Documents | Family evidence | Birth certificates, family composition |
| **sponsorship** | Sponsorship Documents | Sponsor forms | Sponsor forms, citizenship evidence |
| **study** | Study Documents | Student evidence | CoE, academic transcripts |
| **insurance** | Health Insurance | OSHC/OVHC | Health insurance evidence |
| **forms** | Application Forms | Completed forms | Application forms, declarations |
| **photos** | Photographs | Passport photos | Recent passport photos |

### Visa-Specific Document Requirements

- **Skilled (189, 190, 491):** identity, character, health, english, skills_assessment, employment, qualifications
- **Employer (482, 186):** identity, character, health, english, skills_assessment, employment, sponsorship
- **Partner (820/801):** identity, character, health, relationship, family, sponsorship
- **Student (500):** identity, character, health, english, study, financial, insurance
- **Visitor (600):** identity, financial, travel
- **Business (188):** identity, character, health, english, business, investment, financial

---

## Sample SQL Insert Statements

```sql
-- Document Categories
INSERT INTO document_categories (key, name, description, icon, display_order) VALUES
('identity', 'Identity Documents', 'Passport and birth certificate', 'id-card', 1),
('character', 'Character Documents', 'Police clearances', 'shield-check', 2),
('health', 'Health Examinations', 'Medical examination results', 'heart-pulse', 3),
('english', 'English Language', 'English test results', 'languages', 4),
('skills_assessment', 'Skills Assessment', 'Skills assessment letter', 'certificate', 5),
('employment', 'Employment Documents', 'Work references and contracts', 'briefcase', 6),
('qualifications', 'Qualifications', 'Educational certificates', 'graduation-cap', 7),
('financial', 'Financial Documents', 'Proof of funds', 'wallet', 8),
('relationship', 'Relationship Evidence', 'Proof of genuine relationship', 'heart', 9),
('family', 'Family Documents', 'Birth and marriage certificates', 'users', 10),
('sponsorship', 'Sponsorship Documents', 'Sponsor forms', 'user-check', 11),
('study', 'Study Documents', 'CoE and transcripts', 'book-open', 12),
('insurance', 'Health Insurance', 'OSHC/OVHC evidence', 'medical-cross', 13),
('forms', 'Application Forms', 'Completed forms', 'file-text', 14),
('photos', 'Photographs', 'Passport photos', 'camera', 15);

-- Skilled Migration Visas
INSERT INTO visas (name, subclass, category, description, official_link, base_cost_aud, typical_processing_time_min_months, typical_processing_time_max_months, is_active, display_order) VALUES
('Skilled Independent Visa', '189', 'Skilled Migration', 'Permanent visa for invited workers with skills Australia needs. Live and work anywhere permanently.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189', 4640.00, 8, 18, true, 1),
('Skilled Nominated Visa', '190', 'Skilled Migration', 'Permanent visa for skilled workers nominated by a state or territory government.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190', 4640.00, 9, 19, true, 2),
('Skilled Work Regional (Provisional)', '491', 'Skilled Migration', '5-year provisional visa for skilled workers nominated by state or sponsored by family in regional area.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-491', 4640.00, 12, 25, true, 3);

-- Family Visas
INSERT INTO visas (name, subclass, category, description, official_link, base_cost_aud, typical_processing_time_min_months, typical_processing_time_max_months, is_active, display_order) VALUES
('Partner Visa (Onshore)', '820/801', 'Family', 'Combined temporary and permanent visa for partners of Australian citizens/PRs.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore', 8850.00, 18, 30, true, 10),
('Partner Visa (Offshore)', '309/100', 'Family', 'Combined provisional and permanent visa for partners applied outside Australia.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-provisional-309', 8850.00, 15, 26, true, 11),
('Prospective Marriage Visa', '300', 'Family', '9-month visa for fiancés to enter Australia and marry their sponsor.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/prospective-marriage-300', 8850.00, 12, 18, true, 12),
('Contributory Parent Visa', '143', 'Family', 'Permanent visa for parents of settled Australians.', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/contributory-parent-143', 4765.00, 72, 144, true, 13);

-- Continue with remaining visas...
```

---

## MVP Priority Recommendations

### Tier 1 - Must Have for MVP (High Volume Visas)
1. **189 - Skilled Independent** (Most popular skilled visa)
2. **190 - Skilled Nominated** (High volume)
3. **491 - Skilled Regional** (Growing popularity)
4. **820/801 - Partner (Onshore)** (High volume family visa)
5. **309/100 - Partner (Offshore)** (High volume family visa)
6. **500 - Student Visa** (Very high volume)
7. **600 - Visitor Visa** (Very high volume)
8. **482 - TSS Visa** (High employer demand)

### Tier 2 - Important for Launch
9. **186 - Employer Nomination Scheme**
10. **300 - Prospective Marriage**
11. **485 - Temporary Graduate**
12. **494 - Regional Employer Sponsored**
13. **143 - Contributory Parent**
14. **417/462 - Working Holiday**

### Tier 3 - Post-MVP
15. Business/Investor visas (188, 888)
16. Other parent visas (103, 804, 864)
17. Child visas (101, 802)
18. Bridging visas
19. Protection/humanitarian visas

### Recommended Implementation Order
1. **Week 1:** Implement Tier 1 visas (8 visas)
2. **Week 2:** Implement Tier 2 visas (6 visas)
3. **Week 3+:** Add remaining visas as needed

---

## Official DHA Links

- **Visa Listing:** https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing
- **Processing Times:** https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times
- **Fees and Charges:** https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges
- **Document Checklists:** Available on individual visa pages

---

*This documentation is for the VisaBuild application. For the most current information, always refer to the official Department of Home Affairs website.*
