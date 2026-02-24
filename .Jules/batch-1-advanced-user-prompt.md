================================================================================
BATCH 1: ADVANCED USER FEATURES (Pages 1-10)
Project: yourvisasite_bolt4.6
================================================================================

Create 10 advanced user feature pages for the VisaBuild platform. These are power-user tools that enhance the visa application experience.

PAGES TO CREATE:

--- PAGE 1: VisaComparisonTool ---
File: src/pages/user/advanced/VisaComparisonTool.tsx
Path: /user/visa-compare
Description: Side-by-side visa comparison with scoring algorithm
Features:
- Multi-select visa comparison (up to 3 visas)
- Comparison table with key criteria (cost, processing time, requirements)
- Eligibility scoring based on user profile
- Pros/cons list for each visa
- Recommendation engine highlighting best match
- Export comparison as PDF
- Save comparison for later

--- PAGE 2: DocumentScanner ---
File: src/pages/user/advanced/DocumentScanner.tsx
Path: /user/scan
Description: Mobile document scanner with OCR capabilities
Features:
- Camera interface for document capture
- Auto-crop and perspective correction
- OCR text extraction
- Auto-categorization using AI
- PDF generation from scans
- Upload directly to Document Vault
- Batch scanning mode

--- PAGE 3: ApplicationBuilder ---
File: src/pages/user/advanced/ApplicationBuilder.tsx
Path: /user/application-builder
Description: Guided visa application form builder
Features:
- Step-by-step form wizard
- Pre-fill from profile data
- Document requirements checklist
- Progress saving (draft mode)
- Field validation with helpful tips
- Preview before submission
- Export as printable PDF

--- PAGE 4: ExpenseTracker ---
File: src/pages/user/advanced/ExpenseTracker.tsx
Path: /user/expenses
Description: Track visa-related expenses
Features:
- Add expenses by category (application fees, medical, documents, etc.)
- Receipt upload and storage
- Budget setting and tracking
- Expense breakdown charts (Recharts)
- Currency conversion
- Tax deduction categorization
- Export expense report

--- PAGE 5: InterviewPrep ---
File: src/pages/user/advanced/InterviewPrep.tsx
Path: /user/interview-prep
Description: Visa interview question bank and preparation
Features:
- Common interview questions by visa type
- Practice mode with timer
- Record and review answers
- Tips from successful applicants
- Mock interview simulation
- Checklist of documents to bring
- Confidence scoring

--- PAGE 6: HealthRequirements ---
File: src/pages/user/advanced/HealthRequirements.tsx
Path: /user/health-check
Description: Medical exam requirements tracker
Features:
- Panel physician finder by location
- Required medical checks list
- Appointment booking
- Medical results tracking
- Vaccination records
- Health insurance requirements
- Reminders for upcoming checks

--- PAGE 7: CharacterCheck ---
File: src/pages/user/advanced/CharacterCheck.tsx
Path: /user/character-check
Description: Police check and character requirement tracker
Features:
- Police check requirements by country
- Application form links
- Fingerprint appointment booking
- Status tracking for submitted checks
- Validity date monitoring
- Multiple country checks support
- Document storage for certificates

--- PAGE 8: SkillsAssessment ---
File: src/pages/user/advanced/SkillsAssessment.tsx
Path: /user/skills-assessment
Description: Skills assessment tracking for skilled visas
Features:
- Assessing authority finder (VETASSESS, ACS, etc.)
- Assessment type selector
- Document checklist for assessment
- Application progress tracking
- Result notification
- Points calculation from assessment
- Validity period tracking

--- PAGE 9: EnglishTest ---
File: src/pages/user/advanced/EnglishTest.tsx
Path: /user/english-test
Description: English language test scores and requirements
Features:
- IELTS, PTE, TOEFL score entry
- Score comparison across tests
- Requirements by visa type
- Test booking links
- Results upload and storage
- Validity period tracking
- Points calculation from scores

--- PAGE 10: PointsCalculator ---
File: src/pages/user/advanced/PointsCalculator.tsx
Path: /user/points-calc
Description: Visa points calculator for AU/CA/NZ skilled visas
Features:
- Country selector (AU, CA, NZ)
- Age points calculator
- Education points entry
- Work experience calculator
- English points from test scores
- Partner skills points
- Real-time total calculation
- Visa eligibility based on points

TECHNICAL REQUIREMENTS:
1. Use TypeScript with proper interfaces
2. Use existing UI components from @/components/ui
3. Use Recharts for any charts
4. Implement loading states with Skeleton
5. Add error boundaries
6. Use React Hook Form for forms
7. Add SEO meta tags with react-helmet-async
8. Make all pages responsive (mobile-first)
9. Add to App.tsx with lazy loading
10. Follow existing project patterns

DATABASE REQUIREMENTS (create migrations):
- user_comparisons: store saved visa comparisons
- user_expenses: track expenses
- user_interview_prep: interview practice data
- user_health_checks: medical check tracking
- user_character_checks: police check tracking
- user_skills_assessments: skills assessment tracking
- user_english_tests: test scores

Add these pages to the appropriate sections in App.tsx with proper route protection (require authentication).

================================================================================
