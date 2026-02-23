# Jules Prompts for mrmaligi/yourvisasite_bolt4.6
# Copy each prompt and paste into https://jules.google.com/repo/github/mrmaligi/yourvisasite_bolt4.6/overview
# Click "New Session" → Paste prompt → Submit

================================================================================
PRIORITY 1: DASHBOARD ENHANCEMENTS (5 tasks)
================================================================================

--- TASK 1: Enhance User Dashboard ---
Completely redesign src/pages/user/UserDashboard.tsx for visa applicants.

ADD:
- Recharts line chart showing visa application trends over time
- Document upload progress tracker with visual progress bars
- Real-time activity feed using Supabase subscriptions
- Upcoming consultations calendar widget
- Notifications bell icon with unread badge count
- Quick action cards: "Book Lawyer", "Upload Document", "Take Visa Quiz"
- Recommended visas section with match percentage scores
- Recent saved visas list
- Mobile-responsive card layout

Use blue theme colors. Make it look like a professional applicant portal.

--- TASK 2: Enhance Lawyer Dashboard ---
Redesign src/pages/lawyer/LawyerDashboard.tsx for migration lawyers.

ADD:
- Recharts bar chart showing weekly/monthly earnings
- Client management table with status indicators
- Performance metrics: response time, satisfaction rate, completion rate
- Availability toggle widget (online/offline)
- Document review queue with pending items
- Marketing reach analytics (views, clicks, conversions)
- Verification status banner
- Profile completion progress bar

Use green theme colors. Make it look professional for lawyers.

--- TASK 3: Enhance Admin Dashboard ---
Redesign src/pages/admin/AdminDashboard.tsx for administrators.

ADD:
- Recharts line chart for user growth over time
- Recharts pie chart for revenue breakdown by source
- Pending lawyer verifications table with approve/reject buttons
- Recent user registrations table
- System health monitoring widget (DB status, API status)
- Quick moderation actions (approve content, ban user, etc)
- Platform statistics cards with trend indicators
- Export data to CSV/JSON functionality
- Alert notifications for issues

Use purple theme colors. Make it a comprehensive admin console.

--- TASK 4: Add Data Visualization ---
Add comprehensive charts and graphs throughout the app using Recharts.

IMPLEMENT:
- User Dashboard: Application progress over time, visa popularity chart
- Lawyer Dashboard: Earnings chart, client acquisition funnel
- Admin Dashboard: User growth, revenue trends, platform analytics
- Public Pages: Processing time averages by visa type

Ensure all charts are responsive and work in dark mode.

--- TASK 5: Add Real-time Features ---
Implement real-time updates using Supabase subscriptions.

ADD:
- Real-time notifications for new bookings, messages, updates
- Live activity feeds on dashboards
- Real-time document upload progress
- Live chat indicator for lawyer availability
- Instant notification when visa status changes

================================================================================
PRIORITY 2: TRACKER REDESIGN (5 tasks)
================================================================================

--- TASK 6: Visual Timeline for Tracker ---
Redesign the visa application tracker with a visual timeline.

CREATE:
- Step-by-step timeline: Received → Processing → Assessment → Decision
- Visual progress indicator showing current step
- Color coding: gray (pending), blue (current), green (complete), red (refused)
- Estimated completion date prediction
- Expandable details for each step
- Mobile-optimized vertical timeline

--- TASK 7: Tracker Submission Form ---
Redesign the tracker submission form to be user-friendly.

ADD:
- Multi-step wizard instead of long form
- Auto-save draft functionality
- Visual calendar picker for dates
- Document upload checklist
- Real-time validation
- Progress indicator showing form completion
- Mobile-responsive layout

--- TASK 8: Tracker Results Display ---
Improve how tracker results are displayed.

ADD:
- Filter by visa type, country, date range, outcome
- Sortable table with clear column headers
- Expandable rows showing full timeline details
- Average processing time chart
- Success rate statistics
- Pagination for large result sets
- Export results to CSV

--- TASK 9: Lawyer Tracker View ---
Create enhanced tracker view for lawyers.

ADD:
- Client applications list with status
- Quick update buttons for processing stages
- Document review interface
- Client communication history
- Timeline editor for manual updates
- Bulk actions for multiple applications

--- TASK 10: Admin Tracker Management ---
Create comprehensive tracker management for admins.

ADD:
- Moderation queue for new tracker entries
- Verify/reject submission buttons
- Bulk verification tools
- Analytics on tracker data accuracy
- Flag suspicious entries
- Export tracker data for reporting

================================================================================
PRIORITY 3: UI/UX IMPROVEMENTS (10 tasks)
================================================================================

--- TASK 11: Add Dark Mode Toggle ---
Implement a global dark mode toggle with persistence.

- Toggle button in navbar
- Save preference to localStorage
- Update all components to respect theme
- Smooth transition between themes
- Ensure all colors have dark variants

--- TASK 12: Mobile Navigation ---
Implement mobile-friendly navigation.

- Hamburger menu for mobile
- Slide-out drawer with navigation
- Bottom tab bar for key sections
- Touch-friendly button sizes
- Swipe gestures where appropriate

--- TASK 13: Add Loading Skeletons ---
Add skeleton loading screens throughout the app.

- Dashboard skeletons
- List view skeletons
- Card skeletons
- Table skeletons
- Smooth fade-in transitions

--- TASK 14: Add Toast Notifications ---
Implement a global toast notification system.

- Success, error, warning, info toasts
- Auto-dismiss with countdown
- Action buttons in toasts
- Position: top-right
- Stack multiple notifications

--- TASK 15: Form Validation ---
Add comprehensive form validation.

- Real-time validation
- Clear error messages
- Field-level validation
- Form-level validation
- Password strength indicator

--- TASK 16: Add Breadcrumbs ---
Add breadcrumb navigation for better wayfinding.

- Show current location in hierarchy
- Clickable links to parent pages
- Responsive (hide on mobile)
- Consistent across all pages

--- TASK 17: Infinite Scroll ---
Implement infinite scroll for long lists.

- Visa search results
- Forum topics
- Lawyer directory
- Activity feeds
- Loading indicator at bottom

--- TASK 18: Add Search Autocomplete ---
Add autocomplete to search fields.

- Global search autocomplete
- Recent searches
- Popular searches
- Suggestions as you type
- Keyboard navigation

--- TASK 19: File Upload Progress ---
Enhance file upload experience.

- Progress bars for uploads
- Drag-and-drop support
- File type validation
- Preview before upload
- Cancel upload option

--- TASK 20: Add Keyboard Shortcuts ---
Add keyboard shortcuts for power users.

- Cmd/Ctrl+K for search
- Escape to close modals
- Arrow keys for navigation
- ? to show shortcut help

================================================================================
PRIORITY 4: ERROR FIXES & STABILITY (10 tasks)
================================================================================

--- TASK 21: Fix TypeScript Strict Errors ---
Enable strict TypeScript mode and fix all errors.

- Set strict: true in tsconfig.json
- Fix all type errors
- Add proper return types
- Fix implicit any warnings

--- TASK 22: Fix Console Warnings ---
Fix all React console warnings.

- Unique key warnings
- Deprecated lifecycle methods
- Prop type warnings
- Missing dependency warnings

--- TASK 23: Fix Memory Leaks ---
Audit and fix memory leaks.

- Unsubscribe from Supabase listeners
- Clear timers and intervals
- Cancel pending API calls
- Clean up event listeners

--- TASK 24: Fix Race Conditions ---
Fix race conditions in async operations.

- Proper loading states
- Cancel outdated requests
- Debounce rapid actions
- Sequential vs parallel handling

--- TASK 25: Fix Mobile Layout Issues ---
Test and fix all mobile responsive issues.

- Test on actual devices
- Fix overflow issues
- Fix touch targets
- Fix font sizes

--- TASK 26: Fix Navigation State ---
Fix browser back button issues.

- Proper history management
- Scroll restoration
- State persistence
- Query parameter handling

--- TASK 27: Add Error Boundaries ---
Add comprehensive error handling.

- Error boundaries for routes
- Fallback UI components
- Error reporting
- Retry mechanisms

--- TASK 28: Fix Form Reset Issues ---
Fix forms not resetting properly.

- Clear form after submit
- Reset validation state
- Clear file inputs
- Handle cancel action

--- TASK 29: Fix Date Formatting ---
Standardize date formatting across app.

- Consistent date format
- Timezone handling
- Relative dates (2 days ago)
- Locale-aware formatting

--- TASK 30: Fix Image Loading ---
Handle image loading errors gracefully.

- Fallback images
- Lazy loading
- Loading placeholders
- Error states

================================================================================
PRIORITY 5: CHECKS & AUDITS (10 tasks)
================================================================================

--- TASK 31: Security Audit ---
Audit for security vulnerabilities.

- Check all API endpoints
- Review RLS policies
- Check for XSS vulnerabilities
- Validate all inputs
- Review auth flows

--- TASK 32: Performance Audit ---
Run Lighthouse and fix issues.

- First Contentful Paint
- Time to Interactive
- Cumulative Layout Shift
- Bundle size optimization

--- TASK 33: Accessibility Audit ---
Run automated accessibility tests.

- ARIA labels
- Keyboard navigation
- Color contrast
- Screen reader support

--- TASK 34: Code Quality Check ---
Run ESLint and Prettier.

- Fix all linting errors
- Format all files
- Enforce consistent style
- Remove unused code

--- TASK 35: Mobile Testing ---
Test all pages on mobile.

- iOS Safari
- Android Chrome
- Responsive breakpoints
- Touch interactions

--- TASK 36: Cross-Browser Testing ---
Test in all major browsers.

- Chrome
- Firefox
- Safari
- Edge

--- TASK 37: Dependency Audit ---
Audit npm dependencies.

- Check for vulnerabilities (npm audit)
- Update outdated packages
- Remove unused dependencies
- Check license compatibility

--- TASK 38: Build Verification ---
Verify production build works.

- No build errors
- All assets included
- Environment variables set
- Service worker functional

--- TASK 39: SEO Check ---
Verify SEO best practices.

- Meta tags on all pages
- Sitemap.xml
- Robots.txt
- Structured data

--- TASK 40: Test Coverage Check ---
Check test coverage.

- Identify untested code
- Add unit tests
- Add integration tests
- Set coverage thresholds

================================================================================
PRIORITY 6: SQL & DATABASE (10 tasks)
================================================================================

--- TASK 41: RLS Policy Audit ---
Review all RLS policies for security.

- Check user can only access own data
- Verify lawyer policies
- Check admin access levels
- Test edge cases

--- TASK 42: Index Optimization ---
Optimize database indexes.

- Add indexes for frequent queries
- Remove unused indexes
- Analyze query performance
- Check slow query logs

--- TASK 43: Query Performance ---
Optimize slow queries.

- Identify N+1 queries
- Add proper joins
- Use materialized views
- Cache frequent queries

--- TASK 44: Foreign Key Check ---
Verify all foreign keys.

- Check ON DELETE behavior
- Verify referential integrity
- Add missing constraints
- Document relationships

--- TASK 45: Migration Check ---
Verify all migrations.

- Run migrations in order
- Check for conflicts
- Test rollback
- Document changes

--- TASK 46: Data Integrity Check ---
Check for data issues.

- Find orphaned records
- Check for duplicates
- Validate required fields
- Fix inconsistencies

--- TASK 47: Backup Strategy ---
Review backup strategy.

- Automated backups configured
- Test restore process
- Point-in-time recovery
- Disaster recovery plan

--- TASK 48: Scaling Assessment ---
Assess for 1M user scaling.

- Connection pooling
- Read replicas
- Caching strategy
- Rate limiting

--- TASK 49: SQL Security Audit ---
Audit SQL for injection vulnerabilities.

- Parameterized queries
- Input sanitization
- Least privilege principle
- Audit logging

--- TASK 50: Database Documentation ---
Document database schema.

- Entity relationship diagram
- Table descriptions
- Column definitions
- Index documentation

================================================================================
END OF PROMPTS
================================================================================
