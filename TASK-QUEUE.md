# VisaBuild Task Queue

> This file drives the cron automation. The cron agent reads this to know what to do next.
> Only modify the NEXT section and status fields.

## CURRENT JULES SESSIONS (check these first)
| Task | Session ID | Fired At | Status |
|------|-----------|----------|--------|
| T2: Premium Content | 968936226952679464 | 2026-02-18 15:45 | MERGED |
| T3: Auth + Hooks | 12128341203887328535 | 2026-02-18 15:55 | MERGED |
| T4: Stripe + Edge Fns | 7963435567493555491 | 2026-02-18 15:58 | MERGED |
| T5: Landing + Search + Detail | 8309090833658564348 | 2026-02-18 16:00 | MERGED |
| T6: Tracker + Submit | 7166305531339836140 | 2026-02-18 16:02 | MERGED |
| T7: Lawyers + News + Pricing | 13245073353872056035 | 2026-02-18 16:04 | MERGED |

## TASK QUEUE (fire these next, in order)
Each cron job picks the FIRST task with status=QUEUED, fires it to Jules, and marks it FIRED.

| # | Task Name | Scope | Status |
|---|-----------|-------|--------|
| T8 | User Dashboard — All Sections | User dashboard with real data, My Visas (purchased list), Saved Visas page, User Settings page. Wire to Supabase. | FIRED |
| T9 | Premium Content Viewer + Unlock Flow | After purchase: show step-by-step guide, progress tracking checkboxes, section navigation. Unlock button → Stripe checkout. | FIRED |
| T10 | Document Upload + Checklist | MyDocuments page: upload to Supabase Storage, categorize by 19 types, list with status. Per-visa document checklist matching uploaded docs. | FIRED |
| T11 | Consultation Booking Flow | From lawyer profile: select time slot → confirm → Stripe checkout → booking created. Consultations page listing upcoming/past. | FIRED |
| T12 | Lawyer Registration + Pending | /register/lawyer form: bar number, jurisdiction, specializations, rate, credential upload. Pending page after submission. | FIRED |
| T13 | Lawyer Dashboard + Clients | Lawyer dashboard with stats (clients, earnings, consultations). Clients page listing all booked clients with shared docs. | FIRED |
| T14 | Lawyer Availability + Tracker + News + Settings | Availability calendar UI. Weighted tracker submissions. News comments. Lawyer settings page. | FIRED |
| T11 | Consultation Booking Flow | From lawyer profile: select time slot → confirm → Stripe checkout → booking created. Consultations page listing upcoming/past. | QUEUED |
| T12 | Lawyer Registration + Pending | /register/lawyer form: bar number, jurisdiction, specializations, rate, credential upload. Pending page after submission. | QUEUED |
| T13 | Lawyer Dashboard + Clients | Lawyer dashboard with stats (clients, earnings, consultations). Clients page listing all booked clients with shared docs. | QUEUED |
| T14 | Lawyer Availability + Tracker + News + Settings | Availability calendar UI. Weighted tracker submissions. News comments. Lawyer settings page. | QUEUED |
| T15 | Admin Dashboard + User Management | Admin dashboard with platform stats/charts. User management: list, search, change roles, disable. | QUEUED |
| T16 | Admin Lawyer + Visa + News + Tracker Management | Approve/reject lawyers. Visa CRUD. News publish/edit. Tracker moderation. Premium content management. | QUEUED |
| T17 | Error Handling + Loading States + Empty States | Every page: loading skeleton, error boundary, empty state, toast notifications. 404 page. Network error handling. | QUEUED |
| T18 | Responsive Design + UI Polish | Test all pages mobile/tablet/desktop. Fix layouts. Consistent spacing/colors/typography. Accessibility basics. | QUEUED |
| T19 | Build Fix — Zero TypeScript Errors | npm run build with zero errors. Fix ALL TS errors. Verify all imports. Remove dead code. | QUEUED |
| T20 | Integration Test — All Routes Working | Verify every route renders. Check Supabase queries work. Test auth flow. Test role-based access. Document any issues. | QUEUED |

## DAILY SCHEDULE (12 cron jobs per day)

### Day 1 (Feb 18) — FOUNDATION
- Cron 1-6: Tasks T2-T7 already fired (parallel batch)
- Cron 7: Review T2-T7 PRs, merge, fire T8
- Cron 8: Review T8, fire T9
- Cron 9: Review T9, fire T10
- Cron 10: Review T10, fire T11 
- Cron 11: Verify day's work, fix issues
- Cron 12: Prep for Day 2

### Day 2 (Feb 19) — USER + PREMIUM
- Crons 1-10: Tasks T12-T16 + reviews
- Crons 11-12: Verify + prep

### Day 3 (Feb 20) — ADMIN + LAWYER
- Crons 1-10: Tasks T17-T20 + reviews  
- Crons 11-12: Verify + prep

### Day 4 (Feb 21) — POLISH + FIX
- Full app review, fix all issues from Day 1-3
- Bug fixes, UI polish, responsive testing

### Day 5 (Feb 22) — FINAL
- Integration testing
- Deploy preparation
- README update
- Final verification

## CRON AGENT INSTRUCTIONS

On each cron run:
1. Read this file (TASK-QUEUE.md)
2. Check ALL sessions in CURRENT JULES SESSIONS with status=PENDING_REVIEW:
   - curl to get session state
   - If COMPLETED with PR: review diff, merge if good (gh pr merge), mark MERGED
   - If COMPLETED with issues: note issue, try to fix, or mark NEEDS_FIX
   - If FAILED: mark FAILED, note error
   - If still IN_PROGRESS: leave as PENDING_REVIEW
3. Pick FIRST task in TASK QUEUE with status=QUEUED
4. Fire it to Jules with detailed prompt (use TASK-PROMPTS.md for schema reference)
5. Add to CURRENT JULES SESSIONS, mark QUEUED task as FIRED
6. Report to telegram -1003393208707:topic:164:
   - Tasks merged since last run
   - Current task in progress  
   - Next up
   - Overall progress %
   - Any blockers

## CREDENTIALS
- Jules API key: /home/openclaw/.openclaw/workspace/.jules-api-key
- Supabase: /home/openclaw/.openclaw/workspace/.env.supabase
- GitHub: gh CLI (authenticated as mrmaligi)
- Repo: mrmaligi2007/yourvisasite_bolt4.6
- Jules source: sources/github/mrmaligi2007/yourvisasite_bolt4.6
