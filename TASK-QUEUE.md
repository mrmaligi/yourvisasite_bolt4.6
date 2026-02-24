# VisaBuild Task Queue

> This file drives the cron automation. The cron agent reads this to know what to do next.
> Only modify the NEXT section and status fields.

## CURRENT STATUS

**Phase:** 7 (Frontend-Backend Alignment)  
**Overall Progress:** ~72%  
**Critical Issues:** 22 alignment problems (Jules-ready)

## CURRENT JULES SESSIONS (check these first)
| Task | Session ID | Fired At | Status |
|------|-----------|----------|--------|
| Alignment Issue #20 | - | - | QUEUED |
| Alignment Issue #21 | - | - | QUEUED |
| Alignment Issue #22 | - | - | QUEUED |
| Alignment Issue #18 | - | - | QUEUED |
| Alignment Issue #19 | - | - | QUEUED |

## COMPLETED TASKS (Archive)
| # | Task Name | Scope | Status |
|---|-----------|-------|--------|
| T2 | Premium Content | Seed content for 17 visas | MERGED |
| T3 | Auth + Hooks | AuthContext, ProtectedRoute, useAuth | MERGED |
| T4 | Stripe + Edge Fns | Payment flows, webhooks | MERGED |
| T5 | Landing + Search + Detail | Public pages | MERGED |
| T6 | Tracker + Submit | Anonymous tracker, submission form | MERGED |
| T7 | Lawyers + News + Pricing | Lawyer directory, profiles | MERGED |
| T8 | User Dashboard | My Visas, Saved Visas, Settings | MERGED |
| T9 | Premium Content Viewer | Unlock flow, progress tracking | MERGED |
| T10 | Document Upload + Checklist | Supabase Storage, 19 categories | MERGED |
| T11 | Consultation Booking Flow | Stripe checkout, bookings | MERGED |
| T12 | Lawyer Registration + Pending | Verification flow | MERGED |
| T13 | Lawyer Dashboard + Clients | Stats, client management | MERGED |
| T14 | Lawyer Availability + Tracker + News | Calendar, weighted tracker | MERGED |
| T15 | Admin Dashboard + User Management | Platform stats, user CRUD | MERGED |
| T16 | Admin Lawyer + Visa + News Management | Approvals, content management | MERGED |
| T17 | Error Handling + Loading States | Skeletons, error boundaries | MERGED |
| T18 | Responsive Design + UI Polish | Mobile, dark mode | MERGED |
| T19 | Build Fix — Zero TypeScript Errors | All TS errors resolved | VERIFIED |
| T20 | Integration Test — All Routes Working | Playwright E2E tests | VERIFIED |
| B1 | 50 Pages Batch 1 | User Experience pages | MERGED |
| B2 | 50 Pages Batch 2 | User + Lawyer pages | MERGED |
| B3 | 50 Pages Batch 3 | Lawyer + Admin pages | MERGED |
| B4 | 50 Pages Batch 4 | Admin pages | MERGED |
| B5 | 50 Pages Batch 5 | Public Resource pages | MERGED |

## TASK QUEUE (Current Sprint)
Each cron job picks the FIRST task with status=QUEUED, fires it to Jules, and marks it FIRED.

| # | Task Name | Scope | Status |
|---|-----------|-------|--------|
| A1 | Fix Alignment Issue #20 | Booking interface field mismatches | QUEUED |
| A2 | Fix Alignment Issue #21 | LawyerProfile column mismatches | QUEUED |
| A3 | Fix Alignment Issue #22 | LawyerDashboard wrong column query | QUEUED |
| A4 | Fix Alignment Issue #18 | useProfile hook wrong column name | QUEUED |
| A5 | Fix Alignment Issue #19 | Dashboard non-existent scheduled_at | QUEUED |
| A6-A22 | Fix Remaining Issues | Various type/field mismatches | QUEUED |
| R1 | Reschedule Consultations | User-initiated reschedule flow | QUEUED |
| R2 | Cancel Consultations | Cancellation with refund | QUEUED |
| RD | Lawyer Revenue Dashboard | Monthly earnings, statistics | QUEUED |

## CRON AGENT INSTRUCTIONS

On each cron run:
1. Read this file (TASK-QUEUE.md)
2. Check alignment issues in AGENTS.md
3. Pick FIRST task in TASK QUEUE with status=QUEUED
4. Fire it to Jules with detailed prompt
5. Add to CURRENT JULES SESSIONS, mark QUEUED task as FIRED
6. Report progress to telegram

## CREDENTIALS
- Jules API key: /home/openclaw/.openclaw/workspace/.jules-api-key
- Supabase: /home/openclaw/.openclaw/workspace/.env.supabase
- GitHub: gh CLI (authenticated as mrmaligi)
- Repo: mrmaligi/yourvisasite_bolt4.6
- Jules source: sources/github/mrmaligi2007/yourvisasite_bolt4.6

---
*Last Updated: February 25, 2026*
