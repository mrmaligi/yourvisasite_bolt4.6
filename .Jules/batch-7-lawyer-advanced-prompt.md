================================================================================
BATCH 7: ADVANCED LAWYER FEATURES (Pages 61-70)
Project: yourvisasite_bolt4.6
================================================================================

Create 10 advanced lawyer feature pages for the VisaBuild platform.

PAGES TO CREATE:

--- PAGE 61: CasePipeline ---
File: src/pages/lawyer/cases/CasePipeline.tsx
Path: /lawyer/pipeline
Description: Visual case pipeline board
Features:
- Kanban-style board
- Customizable columns (New, In Progress, Review, etc.)
- Drag-and-drop case cards
- Case filtering by type
- Case priority indicators
- Pipeline statistics
- Bulk actions

--- PAGE 62: TimeTracking ---
File: src/pages/lawyer/billing/TimeTracking.tsx
Path: /lawyer/time
Description: Billable hours tracker
Features:
- Timer with start/stop
- Manual time entry
- Client/project selection
- Time categorization
- Running timers list
- Daily/weekly timesheets
- Time rounding options

--- PAGE 63: Invoicing ---
File: src/pages/lawyer/billing/Invoicing.tsx
Path: /lawyer/invoices
Description: Client invoicing system
Features:
- Create new invoices
- Invoice templates
- Line item management
- Tax calculations
- Discount application
- Invoice preview (PDF)
- Send invoice via email

--- PAGE 64: ExpenseClaims ---
File: src/pages/lawyer/billing/ExpenseClaims.tsx
Path: /lawyer/expenses
Description: Business expense tracking
Features:
- Expense entry form
- Receipt upload
- Expense categories
- Client billable toggle
- Mileage tracking
- Expense reports
- Reimbursement workflow

--- PAGE 65: DocumentAutomation ---
File: src/pages/lawyer/content/DocumentAutomation.tsx
Path: /lawyer/automation
Description: Document auto-generation
Features:
- Template library
- Variable insertion
- Client data merge
- Batch document generation
- Preview before generate
- Download all as zip
- Template builder

--- PAGE 66: ClientPortal ---
File: src/pages/lawyer/clients/ClientPortal.tsx
Path: /lawyer/portal
Description: Branded client portal
Features:
- Portal customization
- Brand colors/logo
- Custom domain setup
- Portal preview
- Client access management
- Portal analytics
- Message broadcast

--- PAGE 67: AppointmentTypes ---
File: src/pages/lawyer/scheduling/AppointmentTypes.tsx
Path: /lawyer/appointment-types
Description: Configurable booking types
Features:
- Create appointment types
- Duration settings
- Buffer time config
- Price per type
- Custom intake forms
- Color coding
- Availability per type

--- PAGE 68: CancellationPolicy ---
File: src/pages/lawyer/scheduling/CancellationPolicy.tsx
Path: /lawyer/cancellation
Description: Cancellation rules setup
Features:
- Free cancellation window
- Cancellation fees
- Reschedule policy
- Late cancellation rules
- No-show policy
- Policy preview
- Client notification settings

--- PAGE 69: BufferTime ---
File: src/pages/lawyer/scheduling/BufferTime.tsx
Path: /lawyer/buffer
Description: Between-appointment buffers
Features:
- Before appointment buffer
- After appointment buffer
- Different buffers per type
- Travel time consideration
- Buffer override options
- Visual calendar preview
- Smart buffer suggestions

--- PAGE 70: TeamScheduling ---
File: src/pages/lawyer/team/TeamScheduling.tsx
Path: /lawyer/team-schedule
Description: Multi-lawyer scheduling
Features:
- Team member list
- Individual schedules
- Shared availability view
- Handoff notes between lawyers
- Team capacity planning
- Coverage management
- Team analytics

TECHNICAL REQUIREMENTS:
1. Use TypeScript with proper interfaces
2. Drag-and-drop library (react-beautiful-dnd or @dnd-kit)
3. PDF generation for invoices
4. Real-time updates for scheduling
5. Complex form handling
6. Permission-based access control
7. Billing calculations with precision

DATABASE REQUIREMENTS:
- lawyer_cases: case management
- time_entries: time tracking
- invoices: invoice records
- invoice_items: line items
- expenses: expense tracking
- appointment_types: custom types
- team_schedules: team availability

COMPONENTS TO CREATE:
- KanbanBoard component
- Timer component
- InvoicePreview component
- AppointmentTypeCard component
- TeamMemberCard component

================================================================================
