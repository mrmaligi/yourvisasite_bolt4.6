-- ============================================================================
-- PART 4: NEWS ARTICLES, FORUM TOPICS, NOTIFICATIONS, LAWYER AVAILABILITY
-- ============================================================================

-- =====================================================
-- NEWS ARTICLES (10 articles)
-- =====================================================

INSERT INTO public.news_articles (title, slug, body, image_url, author_id, is_published, published_at, meta_description) VALUES
(
    'Australia Announces Major Changes to Skilled Migration Program 2026',
    'skilled-migration-changes-2026',
    E'## Key Changes to Australia''s Skilled Migration

The Australian Government has announced significant reforms to the skilled migration program, effective from 1 July 2026. These changes aim to better align the migration program with Australia''s economic needs.

### Major Updates

**1. Increased Points Threshold**
- Minimum points requirement increased from 65 to 70 for skilled independent visas
- Extra points for regional study and work experience
- New points for STEM qualifications

**2. Expanded Priority Occupations List**
- 150 new occupations added to the Medium and Long-term Strategic Skills List (MLTSSL)
- Strong focus on healthcare, technology, and renewable energy sectors
- Construction trades in high demand

**3. Processing Time Improvements**
- Target processing time reduced to 3-6 months for priority occupations
- Fast-track processing for healthcare workers
- Digital-first application process

### Impact on Applicants

These changes present both opportunities and challenges. Applicants with higher qualifications and regional connections will benefit most. Those in priority sectors can expect faster processing.

**What You Should Do:**
- Review your points calculation
- Consider regional nomination pathways
- Update your skills assessment if needed
- Apply before July 2026 to be assessed under current rules

---
*Published by VisaBuild Legal Team - 18 February 2026*',
    'https://images.visabuild.com/news/skilled-migration-2026.jpg',
    (SELECT id FROM public.profiles WHERE email = 'admin@visabuild.local'),
    true,
    '2026-02-18 09:00:00+00',
    'Major changes to Australia skilled migration program for 2026 including points threshold increase and new priority occupations.'
),
(
    'Partner Visa Processing Times: What to Expect in 2026',
    'partner-visa-processing-times-2026',
    E'## Understanding Current Processing Times

Partner visa applications continue to be one of the most common pathways to Australian permanent residence. Here''s what you need to know about current timeframes.

### Current Processing Statistics

**Subclass 820 (Onshore Temporary)**
- 25% processed in 6 months
- 50% processed in 12 months  
- 75% processed in 18 months
- 90% processed in 24 months

**Subclass 309 (Offshore Provisional)**
- 25% processed in 8 months
- 50% processed in 14 months
- 75% processed in 20 months
- 90% processed in 28 months

### Factors Affecting Processing Speed

1. **Application Completeness**
   - Complete document checklist reduces delays
   - Missing documents can add 3-6 months

2. **Relationship Evidence Quality**
   - Strong evidence = faster assessment
   - Relationship history gaps cause queries

3. **Health and Character Checks**
   - Complex medical conditions require extra review
   - Character issues from any country must be resolved

### Tips to Avoid Delays

- Submit all documents upfront
- Use the VisaBuild document checklist
- Respond to requests within 28 days
- Keep relationship evidence current
- Consider professional assistance for complex cases

---
*Published by Sarah Mitchell, Migration Lawyer - 15 February 2026*',
    'https://images.visabuild.com/news/partner-visa-times.jpg',
    (SELECT id FROM public.profiles WHERE email = 'lawyer@visabuild.local'),
    true,
    '2026-02-15 10:30:00+00',
    'Current partner visa processing times for 820 and 309 visas with tips to avoid delays.'
),
(
    'Student Visa Update: Financial Requirements Increased',
    'student-visa-financial-requirements-2026',
    E'## New Financial Evidence Requirements

From 1 March 2026, international students must demonstrate increased financial capacity to support their studies in Australia.

### Updated Financial Requirements

**Annual Living Costs (main applicant):**
- Previous: $21,041 AUD
- **New: $24,505 AUD** (+16.5%)

**Additional requirements:**
- Partner/spouse: $8,574 AUD (up from $7,362)
- First child: $3,670 AUD (up from $3,152)
- Each additional child: $2,790 AUD (up from $2,397)

### Evidence Accepted

✅ Bank statements (3 months)
✅ Government loans
✅ Scholarships or financial aid
✅ Parent/guardian financial support
✅ Annual income of $83,454 (family) or $72,465 (single)

### Impact on Applications

Students currently in Australia extending their stay must meet new requirements. Those applying offshore should ensure evidence reflects updated amounts.

**Important:** GTE (Genuine Temporary Entrant) assessment remains critical. Financial capacity is just one factor.

---
*Published by Emma Thompson, Student Visa Specialist - 12 February 2026*',
    'https://images.visabuild.com/news/student-financial.jpg',
    (SELECT id FROM public.profiles WHERE email = 'emma.thompson@visabuild.local'),
    true,
    '2026-02-12 14:00:00+00',
    'Student visa financial requirements increased for 2026 - what international students need to know.'
),
(
    'Regional Migration: Why More Applicants Are Choosing Pathway 491',
    'regional-migration-491-pathway',
    E'## The Rise of Regional Migration

The Skilled Work Regional (Provisional) visa (subclass 491) has become increasingly popular, with applications up 45% compared to last year.

### Why Choose the 491 Visa?

**1. Lower Points Requirement**
- Minimum 65 points (including 15 points from nomination)
- More accessible than 189 visa

**2. Priority Processing**
- Regional visas processed faster
- State nomination gives priority

**3. Clear Pathway to Permanent Residence**
- Subclass 191 permanent visa after 3 years
- Income requirement: $53,900/year
- No points test for 191

### Designated Regional Areas

All of Australia except:
- Sydney
- Melbourne  
- Brisbane

**Popular regional destinations:**
- Perth (now regional!)
- Gold Coast
- Adelaide
- Newcastle
- Wollongong
- Canberra

### State Nomination Opportunities

Each state has different occupation lists and requirements:

- **NSW**: Strong demand for healthcare and IT
- **Victoria**: Focus on STEM and healthcare
- **Queensland**: Trade skills in demand
- **WA**: Mining and engineering priority
- **SA**: Broad occupation list

---
*Published by Michael O''Brien, Regional Migration Expert - 10 February 2026*',
    'https://images.visabuild.com/news/regional-migration.jpg',
    (SELECT id FROM public.profiles WHERE email = 'michael.obrien@visabuild.local'),
    true,
    '2026-02-10 11:00:00+00',
    'Why more skilled migrants are choosing the 491 regional visa pathway and designated regional areas explained.'
),
(
    'Employer Sponsorship Changes: What Businesses Need to Know',
    'employer-sponsorship-changes-2026',
    E'## Updates to TSS and ENS Visas

Significant changes to employer sponsorship programs will affect both businesses and skilled workers from July 2026.

### Changes to Subclass 482 (TSS)

**Work Experience Requirement Reduced**
- Previous: 2 years
- **New: 1 year post-qualification experience**

This opens the pathway to many more recent graduates and skilled workers.

**New Occupations Added**
- Additional 150 occupations eligible
- Includes more trades and para-professional roles
- All ANZSCO skill levels 1-3

### Changes to Subclass 186 (ENS)

**Direct Entry Stream Improvements**
- Faster processing for high-salary roles ($135,000+)
- Age exemptions for high-income earners
- Streamlined labour agreement pathway

**Temporary Residence Transition**
- Reduced work requirement from 3 to 2 years with same employer
- Greater flexibility for role changes within company

### Labour Market Testing Updates

- Advertising period remains 4 weeks minimum
- New exemptions for high-demand occupations
- Digital advertising now fully accepted

### Impact on Employers

Businesses can now sponsor:
- More occupations
- Less experienced workers
- With faster pathways to permanent residence

---
*Published by David Chen, Business Migration Specialist - 8 February 2026*',
    'https://images.visabuild.com/news/employer-sponsorship.jpg',
    (SELECT id FROM public.profiles WHERE email = 'david.chen@visabuild.local'),
    true,
    '2026-02-08 09:30:00+00',
    'Major changes to 482 TSS and 186 ENS employer sponsorship visas from July 2026.'
),
(
    'Global Talent Visa: Priority Sectors for 2026',
    'global-talent-priority-sectors-2026',
    E'## Target Sectors for Global Talent

The Global Talent visa (subclass 858) continues to offer a fast-track pathway to permanent residence for highly skilled professionals.

### Current Priority Sectors

**1. Resources**
- Critical minerals extraction
- Renewable energy resources
- Advanced mining technologies

**2. Agri-food and AgTech**
- Agricultural technology
- Food processing innovation
- Sustainable farming

**3. Energy**
- Clean energy technologies
- Battery storage
- Green hydrogen

**4. Health Industries**
- Medical devices
- Digital health
- Biotechnology

**5. Defence, Advanced Manufacturing and Space**
- Aerospace
- Advanced materials
- Autonomous systems

**6. Circular Economy**
- Waste management innovation
- Recycling technologies
- Sustainable manufacturing

**7. Digitech**
- Artificial Intelligence
- Cybersecurity
- Quantum computing
- FinTech

**8. Infrastructure and Tourism**
- Transport innovation
- Sustainable tourism
- Smart cities

**9. Financial Services and FinTech**
- Blockchain applications
- Digital banking
- InsurTech

**10. Education**
- EdTech innovation
- International education services

### Application Process

1. **Expression of Interest** - Submit via Global Talent contact
2. **Unique Identifier** - If successful, receive invitation code
3. **Visa Application** - Apply within 60 days

### Success Factors

- High salary ($167,500+) OR exceptional talent
- Internationally recognised achievements
- Evidence of current prominence in field

---
*Published by David Chen, Global Talent Specialist - 5 February 2026*',
    'https://images.visabuild.com/news/global-talent.jpg',
    (SELECT id FROM public.profiles WHERE email = 'david.chen@visabuild.local'),
    true,
    '2026-02-05 13:00:00+00',
    'The 10 priority sectors for Australia Global Talent visa and application requirements for 2026.'
),
(
    'Parent Visa Options: Comparing 143 vs 870 vs 103',
    'parent-visa-options-compared',
    E'## Choosing the Right Parent Visa

Australian parent visas offer different pathways with varying costs, processing times, and conditions. Here''s a comprehensive comparison.

### Permanent Parent Visas

**Contributory Parent (143)**
- Cost: ~$47,755 (visa + assurance of support bond)
- Processing: 5-6 years
- Permanent residence immediately
- Medicare access
- Can apply for citizenship after 4 years

**Parent (103)**
- Cost: ~$6,985
- Processing: 30+ years (very long queue)
- Cheapest option but extremely long wait
- Same benefits as 143 when granted

### Temporary Options

**Sponsored Parent (870)**
- Cost: $1,145 (3 years) or $2,030 (5 years)
- Processing: 3-6 months
- Can stay up to 5 years
- **No work rights**
- **No Medicare**
- Can be renewed once (total 10 years)

**173 (Contributory Temporary)**
- Cost: $29,130
- Processing: 2-4 years
- 2-year temporary visa
- Can apply for 143 permanent
- Balance of fees due for permanent

### Our Recommendation

**If budget allows:** Apply for 143 immediately (fastest permanent option)

**If waiting for 143:** Apply for 870 to spend time with family now

**If cost is concern:** Apply for 103 (but expect very long wait)

### Balance of Family Test

All parent visas require:
- At least half of children living permanently in Australia, OR
- More children in Australia than any other single country

---
*Published by Priya Sharma, Family Migration Specialist - 3 February 2026*',
    'https://images.visabuild.com/news/parent-visas.jpg',
    (SELECT id FROM public.profiles WHERE email = 'priya.sharma@visabuild.local'),
    true,
    '2026-02-03 10:00:00+00',
    'Complete comparison of Australian parent visa options - 143 Contributory, 870 Temporary, and 103 standard.'
),
(
    'Working Holiday Visa: Complete Guide for 2026',
    'working-holiday-visa-guide-2026',
    E'## Subclass 417 and 462 Explained

The Working Holiday visa allows young people to holiday and work in Australia for up to 12 months.

### Eligibility Requirements

**Age:** 18-30 years (inclusive) at time of application
**Passport:** Eligible country (417 or 462)
**Funds:** At least $5,000 AUD plus return airfare
**Dependents:** No dependent children

### 417 vs 462: What''s the Difference?

**Working Holiday (417)**
- UK, Canada, France, Germany, Ireland, Italy, Japan, Netherlands, Sweden, etc.
- No formal education requirement
- Multiple entries allowed

**Work and Holiday (462)**
- USA, Argentina, Bangladesh, Chile, China, Indonesia, Malaysia, Poland, Portugal, Singapore, Spain, Thailand, Turkey, Uruguay, Vietnam
- May require functional English
- May require education (varies by country)
- Limited spots (except USA)

### Work Restrictions

- **Same employer:** Maximum 6 months (can apply for extension)
- **Total stay:** Can extend to 2-3 years with specified work
- **Study:** Up to 4 months

### Specified Work for Extension

Complete 3 months of specified work in regional Australia to apply for second year:

**Eligible work:**
- Plant and animal cultivation
- Fishing and pearling
- Tree farming and felling
- Mining
- Construction
- Bushfire recovery work

**Regional areas only** for most work types.

---
*Published by Emma Thompson - 1 February 2026*',
    'https://images.visabuild.com/news/working-holiday.jpg',
    (SELECT id FROM public.profiles WHERE email = 'emma.thompson@visabuild.local'),
    true,
    '2026-02-01 09:00:00+00',
    'Complete guide to 417 and 462 Working Holiday visas including eligibility, work restrictions, and extensions.'
),
(
    'Skills Assessment Guide: ACS, Engineers Australia, VETASSESS',
    'skills-assessment-guide-2026',
    E'## Understanding Skills Assessments

A positive skills assessment is crucial for most skilled migration pathways. Here''s what you need to know about the major assessing authorities.

### Australian Computer Society (ACS)

**For:** IT and computing occupations
**Cost:** $560-$1,100
**Processing:** 8-12 weeks

**Requirements:**
- Relevant ICT degree + 2 years experience OR
- Non-ICT degree + 6 years experience OR
- No degree + 8 years experience

**Common Issues:**
- Insufficient employment evidence
- Duties don''t match ANZSCO
- Wrong occupation code selection

### Engineers Australia

**For:** Engineering professions
**Cost:** $360-$815
**Processing:** 8-12 weeks

**Pathways:**
- **Accredited Qualifications:** Washington/Sydney/Dublin Accord
- **Competency Demonstration Report (CDR):** Non-accredited degrees

**CDR Requirements:**
- 3 career episodes
- Summary statement
- Continuing professional development

### VETASSESS

**For:** Trade and professional occupations
**Cost:** $1,034-$1,540
**Processing:** 12-20 weeks

**Requirements vary by occupation:**
- Most require post-qualification experience
- Some require Australian employment
- Trade assessments may require practical testing

### Tips for Success

1. **Choose correct occupation** - Use ANZSCO carefully
2. **Provide detailed evidence** - Employment references must match ANZSCO duties
3. **Be patient** - Don''t book flights until assessment complete
4. **Consider professional help** - Complex cases benefit from migration agent

---
*Published by Sarah Mitchell - 28 January 2026*',
    'https://images.visabuild.com/news/skills-assessment.jpg',
    (SELECT id FROM public.profiles WHERE email = 'lawyer@visabuild.local'),
    true,
    '2026-01-28 11:30:00+00',
    'Complete guide to skills assessments for Australian migration including ACS, Engineers Australia, and VETASSESS.'
),
(
    'Visa Refused? Your Options and Next Steps',
    'visa-refusal-options-guide',
    E'## Understanding Visa Refusals

Receiving a visa refusal can be devastating, but you may have options. Here''s what to do next.

### First Steps

**1. Read the Refusal Notice Carefully**
- Understand the exact grounds for refusal
- Check if it''s a legislative requirement or discretionary decision
- Note any review rights mentioned

**2. Check Timeline for Review**
- Administrative Appeals Tribunal (AAT): 21-28 days
- Federal Circuit Court: 35 days
- Ministerial Intervention: No strict deadline but act quickly

### Your Options

**1. Reapply**
- Best when: Circumstances have changed or original application was incomplete
- Pros: Fresh start, can address refusal reasons
- Cons: New application fee, processing time resets

**2. AAT Merits Review**
- Best when: Decision was incorrect on the facts or law
- Process: Independent review by AAT member
- Timeline: 12-24 months for most visas
- Cost: $3,496

**3. Federal Court Judicial Review**
- Best when: Legal error in decision-making process
- Grounds: Jurisdictional error, procedural unfairness
- Not a re-hearing - focuses on legal process

**4. Ministerial Intervention**
- Best when: Compassionate or compelling circumstances
- Not a right - entirely discretionary
- Usually requires exceptional circumstances

### Common Refusal Reasons and Solutions

**Genuine Temporary Entrant (GTE) Failure**
- Solution: Address specific concerns, provide stronger ties evidence

**Insufficient Funds**
- Solution: Document additional funds, provide sponsor evidence

**Character Concerns**
- Solution: Character submissions, time since offence, rehabilitation evidence

**False Information (PIC 4020)**
- Solution: This is serious - seek legal advice immediately

---
*Published by Priya Sharma - 25 January 2026*',
    'https://images.visabuild.com/news/visa-refusal.jpg',
    (SELECT id FROM public.profiles WHERE email = 'priya.sharma@visabuild.local'),
    true,
    '2026-01-25 14:00:00+00',
    'What to do if your Australian visa is refused - options including AAT review, reapplying, and Ministerial Intervention.'
);

-- =====================================================
-- FORUM TOPICS (5-6 topics with replies)
-- =====================================================

INSERT INTO public.forum_topics (title, content, author_id, category, tags, view_count, is_pinned, is_locked) VALUES
(
    '189 Visa - How long after invitation to submit?',
    E'Hi everyone,

I just received my invitation to apply for the 189 visa yesterday! Super excited but also nervous about the timeline.

**My situation:**
- Invited with 85 points (Software Engineer)
- Invitation valid for 60 days
- Most documents ready but still waiting on my AFP check

**Questions:**
1. Can I submit without the AFP check and upload it later?
2. Is 60 days usually enough time?
3. What happens if I miss the deadline?

Any advice would be greatly appreciated! 

Thanks,
James',
    (SELECT id FROM public.profiles WHERE email = 'applicant@visabuild.local'),
    'skilled-migration',
    ARRAY['189', 'invitation', 'timeline', 'australian-federal-police'],
    245,
    false,
    false
),
(
    'Partner visa - Evidence of genuine relationship',
    E'Hello,

My partner and I are preparing our 820 visa application. We''ve been together for 2.5 years and living together for 1.5 years.

**What we have so far:**
- Joint lease agreement
- Joint bank account (8 months)
- Utility bills in both names
- Photos together (50+)
- Travel bookings together
- Stat decs from 2 friends

**Questions:**
1. Is 8 months of joint bank account enough?
2. Should we include social media evidence?
3. Do we need to explain every trip we''ve taken together?
4. Any other documents we''re missing?

Also, my partner is currently on a tourist visa - should we apply now or wait?

Thanks!',
    (SELECT id FROM public.profiles WHERE email = 'anonymous@visabuild.local'),
    'family-visas',
    ARRAY['820', 'partner-visa', 'relationship-evidence', 'genuine-relationship'],
    189,
    false,
    false
),
(
    'Student visa refused - GTE concerns',
    E'Hi all,

Unfortunately my student visa (500) was refused yesterday. The refusal letter cites GTE concerns.

**Background:**
- Applied for MBA at University of Sydney
- Previously studied in Canada (completed)
- 5 years work experience in marketing
- 32 years old

**Refusal reasons:**
- Age not consistent with career progression
- Course not relevant to previous studies
- Strong economic ties to home country

I''m devastated because I''ve already paid tuition fees. Has anyone successfully overcome a GTE refusal?

Should I:
1. Reapply with better GTE statement?
2. Appeal to AAT?
3. Apply for different course?

Any advice would mean a lot.',
    (SELECT id FROM public.profiles WHERE email = 'maria.garcia@visabuild.local'),
    'student-visas',
    ARRAY['500', 'refusal', 'GTE', 'review-options'],
    312,
    false,
    false
),
(
    '482 to PR pathway - Timeline questions',
    E'Hey everyone,

I''m currently on a 482 visa (Medium-term stream) and planning my pathway to PR.

**Current status:**
- 482 granted: March 2024
- Working as ICT Business Analyst
- Employer willing to sponsor for PR
- Current salary: $125,000

**My questions:**

1. **186 TRT stream:** When can I apply? Is it 3 years from grant date or from when I started working?

2. **186 Direct Entry:** Can my employer nominate me now? Do I need skills assessment?

3. **189/190:** Should I pursue points-based pathway instead? Currently have 75 points.

4. **Employer changes:** If I change employers, what happens to my 482 and PR pathway?

Would love to hear from others who''ve been through this process!

Cheers,
Raj',
    (SELECT id FROM public.profiles WHERE email = 'raj.patel@visabuild.local'),
    'employer-sponsorship',
    ARRAY['482', '186', 'PR-pathway', 'employer-sponsorship'],
    456,
    true,
    false
),
(
    'Medical examination - How long does it take?',
    E'Hi,

Just completed my medical examination for my 189 visa application. Thought I''d share my experience and timeline.

**My experience:**
- HAP ID received: 15 Jan 2026
- Booked appointment: 20 Jan (Bupa Melbourne)
- Medical completed: 22 Jan
- Results uploaded to ImmiAccount: 25 Jan
- Status changed to "Health clearance provided": 28 Jan

**What to bring:**
- Passport
- HAP letter
- Glasses (if you wear them)
- List of current medications
- Previous chest x-rays (if available)

**Cost:** $420 (including blood tests)

**Tips:**
- Book early morning (faster)
- Drink water before urine test
- Don''t exercise before appointment (can affect blood pressure)

Hope this helps others!',
    (SELECT id FROM public.profiles WHERE email = 'yuki.tanaka@visabuild.local'),
    'general',
    ARRAY['health-examination', 'medical', 'HAP-ID', 'timeline'],
    178,
    false,
    false
),
(
    'PTE vs IELTS - Which is easier for 20 points?',
    E'Hi all,

I need 20 points for English to reach 65 points for 189. Currently at 45.

**My background:**
- Native Hindi speaker
- Lived in Singapore 3 years (English speaking environment)
- Bachelor degree taught in English

**Questions:**
1. Is PTE easier to score 79+ than IELTS 8.0?
2. Do I need to take the test or can I claim points based on my degree?
3. How long to prepare for each test?
4. Which has faster results?

I''ve heard mixed opinions. Some say PTE is easier because it''s computer-based and has templates. Others say IELTS is more predictable.

Would appreciate any insights!

Thanks',
    (SELECT id FROM public.profiles WHERE email = 'anonymous@visabuild.local'),
    'skilled-migration',
    ARRAY['english-test', 'PTE', 'IELTS', 'points-test'],
    523,
    false,
    false
);

-- Add replies to forum topics
INSERT INTO public.forum_replies (topic_id, content, author_id) 
SELECT 
    t.id,
    E'Congratulations on your invitation! 🎉

**Regarding your questions:**

1. **AFP Check:** Yes, you can submit without it and upload later via your ImmiAccount. Just make sure to get it uploaded ASAP as processing won''t complete without it.

2. **60 Days:** For most people, 60 days is plenty if you have most documents ready. I submitted mine in 3 weeks.

3. **Missing deadline:** If you miss the 60 days, the invitation expires and you''ll need to wait for another round. Your EOI stays active.

**Pro tip:** Submit as soon as you can - processing officially starts from submission date, not invitation date!

Good luck!',
    (SELECT id FROM public.profiles WHERE email = 'lawyer@visabuild.local')
FROM public.forum_topics t WHERE t.title LIKE '%189 Visa - How long%';

INSERT INTO public.forum_replies (topic_id, content, author_id) 
SELECT 
    t.id,
    E'Hey James,

I was in the same boat last year. I submitted my 189 application without the AFP check and uploaded it 2 weeks later. No issues at all.

One thing to note - make sure your passport has at least 6 months validity from your intended travel date.

Also, if you have any documents not in English, get them translated by a NAATI translator before uploading.

Cheers!',
    (SELECT id FROM public.profiles WHERE email = 'raj.patel@visabuild.local')
FROM public.forum_topics t WHERE t.title LIKE '%189 Visa - How long%';

INSERT INTO public.forum_replies (topic_id, content, author_id) 
SELECT 
    t.id,
    E'Hi there,

Your evidence list looks solid! Here are my thoughts:

**Joint bank account:** 8 months is acceptable, though 12+ months is ideal. Make sure to highlight regular transactions showing shared expenses.

**Social media:** Can help but not essential. If you do include it, provide screenshots with dates and context, not just links.

**Travel:** No need to explain every trip, just highlight the significant ones (over 1 week, international trips).

**Missing documents:**
- Consider adding:
  - Mail addressed to both of you at same address
  - Joint memberships (gym, clubs)
  - Joint insurance policies
  - Wills naming each other

**Tourist visa:** Apply ASAP! The 820 can be applied onshore and you''ll get a Bridging A while it processes.

Best of luck!',
    (SELECT id FROM public.profiles WHERE email = 'priya.sharma@visabuild.local')
FROM public.forum_topics t WHERE t.title LIKE '%Partner visa%';

-- =====================================================
-- NOTIFICATIONS (for test users)
-- =====================================================

INSERT INTO public.notifications (user_id, type, title, message, link, is_read, priority) VALUES
('a0000000-0000-0000-0000-000000000003'::UUID, 'in_app', 'Document Verified', 'Your passport has been verified successfully.', '/documents', true, 'low'),
('a0000000-0000-0000-0000-000000000003'::UUID, 'in_app', 'Consultation Booked', 'Your consultation with Sarah Mitchell is confirmed for tomorrow at 10:00 AM.', '/bookings', false, 'medium'),
('a0000000-0000-0000-0000-000000000003'::UUID, 'email', 'Application Status Update', 'Your 189 visa application has moved to assessment phase.', '/applications/189', true, 'high'),
('a0000000-0000-0000-0000-000000000003'::UUID, 'push', 'New Tracker Entry', 'A new processing time has been reported for 189 visas.', '/tracker/189', false, 'low'),
('a0000000-0000-0000-0000-000000000003'::UUID, 'in_app', 'Premium Content Unlocked', 'You now have access to the complete 189 visa guide.', '/visas/189/premium', true, 'medium');

INSERT INTO public.notifications (user_id, type, title, message, link, is_read, priority) VALUES
('a0000000-0000-0000-0000-00000000000a'::UUID, 'in_app', 'Consultation Reminder', 'Your consultation with David Chen is in 2 hours.', '/bookings', false, 'high'),
('a0000000-0000-0000-0000-00000000000a'::UUID, 'email', 'Skills Assessment Update', 'Your ACS skills assessment is now in progress.', '/documents', true, 'medium'),
('a0000000-0000-0000-0000-000000000009'::UUID, 'push', 'Visa Granted! 🎉', 'Congratulations! Your student visa has been granted.', '/applications/500', true, 'urgent'),
('a0000000-0000-0000-0000-000000000009'::UUID, 'in_app', 'Welcome to VisaBuild', 'Complete your profile to get personalised visa recommendations.', '/profile', false, 'low');

-- =====================================================
-- LAWYER AVAILABILITY SLOTS
-- =====================================================

INSERT INTO public.lawyer_availability (lawyer_id, date, start_time, end_time, is_booked) 
SELECT 
    p.id,
    CURRENT_DATE + INTERVAL '1 day' * d.day_offset,
    t.start_time,
    t.end_time,
    false
FROM public.profiles p
CROSS JOIN (VALUES (1), (2), (3), (4), (5), (6), (7)) AS d(day_offset)
CROSS JOIN (
    VALUES 
        ('09:00:00', '10:00:00'),
        ('10:00:00', '11:00:00'),
        ('11:00:00', '12:00:00'),
        ('14:00:00', '15:00:00'),
        ('15:00:00', '16:00:00')
) AS t(start_time, end_time)
WHERE p.role = 'lawyer';

-- Mark some slots as booked
UPDATE public.lawyer_availability 
SET is_booked = true 
WHERE id IN (
    SELECT id FROM public.lawyer_availability 
    WHERE date = CURRENT_DATE + INTERVAL '3 days'
    LIMIT 5
);

SELECT '✓ Part 4: Content and notifications created' as status,
    (SELECT COUNT(*)::text FROM public.news_articles) as articles,
    (SELECT COUNT(*)::text FROM public.forum_topics) as topics,
    (SELECT COUNT(*)::text FROM public.forum_replies) as replies,
    (SELECT COUNT(*)::text FROM public.notifications) as notifications,
    (SELECT COUNT(*)::text FROM public.lawyer_availability) as availability_slots;
