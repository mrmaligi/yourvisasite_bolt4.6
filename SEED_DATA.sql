-- ============================================
-- SEED DATA FOR VISABUILD
-- Run this to populate empty tables
-- ============================================

-- 1. NEWS ARTICLES
INSERT INTO news_articles (title, slug, excerpt, content, status, published_at, author_id, created_at, updated_at) VALUES
('Australia Announces New Skilled Migration Program', 
 'australia-skilled-migration-2025',
 'The Australian government has introduced significant changes to the skilled migration program, offering new pathways for professionals.',
 '<p>The Australian government has announced sweeping changes to the skilled migration program...</p>',
 'published', NOW(), 'cb9b6b02-4332-45ef-ab75-55038333e7f8', NOW(), NOW()),

('Partner Visa Processing Times Reduced by 30%', 
 'partner-visa-processing-times-reduced',
 'Good news for couples: Department of Home Affairs reports significant improvements in partner visa processing.',
 '<p>The Department of Home Affairs has announced a 30% reduction in partner visa processing times...</p>',
 'published', NOW(), 'cb9b6b02-4332-45ef-ab75-55038333e7f8', NOW(), NOW()),

('Student Visa Rules: What Changed in 2025', 
 'student-visa-changes-2025',
 'International students should be aware of the latest policy changes affecting work rights and post-study options.',
 '<p>Several important changes to student visa regulations have taken effect this year...</p>',
 'published', NOW(), 'cb9b6b02-4332-45ef-ab75-55038333e7f8', NOW(), NOW()),

('Regional Visa Opportunities Expand', 
 'regional-visa-opportunities-expand',
 'New regional areas added to the designated area list, opening more pathways to permanent residency.',
 '<p>The government has expanded the designated regional area list, creating new opportunities...</p>',
 'published', NOW(), 'cb9b6b02-4332-45ef-ab75-55038333e7f8', NOW(), NOW()),

('Business Innovation Visa: Updated Requirements', 
 'business-innovation-visa-updates',
 'Entrepreneurs and investors should review the updated criteria for business innovation visas.',
 '<p>The Business Innovation and Investment Program has undergone significant updates...</p>',
 'published', NOW(), 'cb9b6b02-4332-45ef-ab75-55038333e7f8', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 2. YOUTUBE FEEDS
INSERT INTO youtube_feeds (channel_id, channel_name, playlist_id, is_active, created_at, updated_at) VALUES
('UCy_zf_-_7kdb-4E331j0Cuw', 'VisaBuild Official', NULL, true, NOW(), NOW()),
('UCz4a7ag7bBRS1fOIAHUj8yg', 'Migration Alliance', NULL, true, NOW(), NOW()),
('UCDeZVf7l1KkS5d7HjM4-xWw', 'Australian Immigration', NULL, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 3. FORUM CATEGORIES
INSERT INTO forum_categories (name, slug, description, icon, sort_order, created_at, updated_at) VALUES
('General Discussion', 'general', 'General topics about Australian immigration and visas', 'MessageCircle', 1, NOW(), NOW()),
('Skilled Migration', 'skilled-migration', 'Discuss skilled visas, points tests, and occupation lists', 'Briefcase', 2, NOW(), NOW()),
('Partner Visas', 'partner-visas', 'Share experiences and ask questions about partner visas', 'Heart', 3, NOW(), NOW()),
('Student Visas', 'student-visas', 'Everything about student visas and study in Australia', 'GraduationCap', 4, NOW(), NOW()),
('Business Visas', 'business-visas', 'Business innovation, investment, and entrepreneur visas', 'TrendingUp', 5, NOW(), NOW()),
('Citizenship', 'citizenship', 'Australian citizenship applications and tests', 'Flag', 6, NOW(), NOW()),
('Success Stories', 'success-stories', 'Share your visa success stories and celebrate wins', 'Award', 7, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 4. FORUM TOPICS
INSERT INTO forum_topics (category_id, title, slug, content, author_id, is_pinned, is_locked, view_count, created_at, updated_at)
SELECT 
  c.id,
  'Welcome to VisaBuild Forum - Please Read First!',
  'welcome-to-forum',
  '<p>Welcome to the VisaBuild community! This is a space for sharing experiences...</p>',
  'cb9b6b02-4332-45ef-ab75-55038333e7f8',
  true,
  true,
  0,
  NOW(),
  NOW()
FROM forum_categories c
WHERE c.slug = 'general'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO forum_topics (category_id, title, slug, content, author_id, is_pinned, view_count, created_at, updated_at)
SELECT 
  c.id,
  'Points Test Changes 2025 - Discussion Thread',
  'points-test-2025-discussion',
  '<p>With the new points test changes coming into effect, let''s discuss...</p>',
  '94864ee4-ec62-40eb-9c43-bc42b77bd620',
  false,
  0,
  NOW(),
  NOW()
FROM forum_categories c
WHERE c.slug = 'skilled-migration'
ON CONFLICT (slug) DO NOTHING;

-- 5. MARKETPLACE CATEGORIES
INSERT INTO marketplace_categories (name, slug, description, icon, sort_order, created_at, updated_at) VALUES
('Document Services', 'document-services', 'Professional document preparation and review services', 'FileText', 1, NOW(), NOW()),
('Legal Consultation', 'legal-consultation', 'One-on-one consultations with migration lawyers', 'Users', 2, NOW(), NOW()),
('Visa Application Help', 'visa-application-help', 'Assistance with visa application preparation', 'ClipboardCheck', 3, NOW(), NOW()),
('Skills Assessment', 'skills-assessment', 'Help with professional skills assessments', 'Award', 4, NOW(), NOW()),
('English Test Prep', 'english-test-prep', 'IELTS, PTE, and other English test preparation', 'BookOpen', 5, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 6. PRODUCTS (for marketplace)
INSERT INTO products (name, description, price_cents, type, is_active, created_at, updated_at) VALUES
('Document Review Service', 'Professional review of your visa documents by certified agents', 15000, 'service', true, NOW(), NOW()),
('30-Min Consultation', 'One-on-one consultation with an experienced migration lawyer', 5000, 'service', true, NOW(), NOW()),
('Visa Application Check', 'Complete review and checklist for your visa application', 10000, 'service', true, NOW(), NOW()),
('Skills Assessment Guide', 'Step-by-step guide to getting your skills assessed', 5000, 'digital', true, NOW(), NOW()),
('IELTS Prep Course', 'Online course to help you achieve your target IELTS score', 20000, 'digital', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 7. CONSULTATION SLOTS (for lawyers)
INSERT INTO consultation_slots (lawyer_id, start_time, end_time, is_booked, price_cents, meeting_type, created_at, updated_at)
SELECT 
  lp.user_id,
  NOW() + (random() * INTERVAL '7 days'),
  NOW() + (random() * INTERVAL '7 days') + INTERVAL '1 hour',
  false,
  5000,
  'video',
  NOW(),
  NOW()
FROM lawyer_profiles lp
WHERE lp.is_verified = true
  AND lp.verification_status = 'approved'
LIMIT 5;

-- 8. PLATFORM SETTINGS
INSERT INTO platform_settings (key, value, description, created_at, updated_at) VALUES
('site_name', 'VisaBuild', 'Website name', NOW(), NOW()),
('support_email', 'support@yourvisasite.com', 'Support email address', NOW(), NOW()),
('enable_registration', 'true', 'Allow new user registration', NOW(), NOW()),
('maintenance_mode', 'false', 'Put site in maintenance mode', NOW(), NOW())
ON CONFLICT (key) DO NOTHING;

-- 9. PROMO CODES
INSERT INTO promo_codes (code, discount_percent, discount_cents, valid_from, valid_until, max_uses, current_uses, is_active, created_at, updated_at) VALUES
('WELCOME10', 10, NULL, NOW(), NOW() + INTERVAL '90 days', 100, 0, true, NOW(), NOW()),
('FIRST20', 20, NULL, NOW(), NOW() + INTERVAL '30 days', 50, 0, true, NOW(), NOW()),
('LAWYER50', NULL, 5000, NOW(), NOW() + INTERVAL '60 days', 25, 0, true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Verification
SELECT 'Seed data inserted successfully' as status;
