// App.tsx - Updated with all 50 new pages
// This file should be merged with the existing App.tsx

// ==================== NEW PAGE IMPORTS ====================

// User Pages (15 pages) - Pages 1-15
const Welcome = lazy(() => import('./pages/user/Welcome').then(m => ({ default: m.Welcome })));
const Tour = lazy(() => import('./pages/user/Tour').then(m => ({ default: m.Tour })));
const GettingStarted = lazy(() => import('./pages/user/GettingStarted').then(m => ({ default: m.GettingStarted })));
const VisaRoadmap = lazy(() => import('./pages/user/VisaRoadmap').then(m => ({ default: m.VisaRoadmap })));
const DocumentChecklist = lazy(() => import('./pages/user/DocumentChecklist').then(m => ({ default: m.DocumentChecklist })));
const ApplicationTimeline = lazy(() => import('./pages/user/ApplicationTimeline').then(m => ({ default: m.ApplicationTimeline })));
const DeadlineAlerts = lazy(() => import('./pages/user/DeadlineAlerts').then(m => ({ default: m.DeadlineAlerts })));
const Profile = lazy(() => import('./pages/user/Profile').then(m => ({ default: m.Profile })));
const Notifications = lazy(() => import('./pages/user/Notifications').then(m => ({ default: m.Notifications })));
const Billing = lazy(() => import('./pages/user/Billing').then(m => ({ default: m.Billing })));
const Security = lazy(() => import('./pages/user/Security').then(m => ({ default: m.Security })));
const HelpCenter = lazy(() => import('./pages/user/HelpCenter').then(m => ({ default: m.HelpCenter })));
const LiveChat = lazy(() => import('./pages/user/LiveChat').then(m => ({ default: m.LiveChat })));
const Feedback = lazy(() => import('./pages/user/Feedback').then(m => ({ default: m.Feedback })));
const ReportIssue = lazy(() => import('./pages/user/ReportIssue').then(m => ({ default: m.ReportIssue })));

// Lawyer Pages (12 pages) - Pages 16-27
const LawyerProfile = lazy(() => import('./pages/lawyer/Profile').then(m => ({ default: m.Profile })));
const LawyerReviews = lazy(() => import('./pages/lawyer/Reviews').then(m => ({ default: m.Reviews })));
const LawyerAnalytics = lazy(() => import('./pages/lawyer/Analytics').then(m => ({ default: m.Analytics })));
const LawyerBilling = lazy(() => import('./pages/lawyer/Billing').then(m => ({ default: m.Billing })));
const LawyerContracts = lazy(() => import('./pages/lawyer/Contracts').then(m => ({ default: m.Contracts })));
const LawyerTeam = lazy(() => import('./pages/lawyer/Team').then(m => ({ default: m.Team })));
const LawyerClientDetail = lazy(() => import('./pages/lawyer/ClientDetail').then(m => ({ default: m.ClientDetail })));
const LawyerCases = lazy(() => import('./pages/lawyer/Cases').then(m => ({ default: m.Cases })));
const LawyerDocuments = lazy(() => import('./pages/lawyer/Documents').then(m => ({ default: m.Documents })));
const LawyerNotes = lazy(() => import('./pages/lawyer/Notes').then(m => ({ default: m.Notes })));
const LawyerLeadCapture = lazy(() => import('./pages/lawyer/LeadCapture').then(m => ({ default: m.LeadCapture })));
const LawyerTestimonials = lazy(() => import('./pages/lawyer/Testimonials').then(m => ({ default: m.Testimonials })));

// Admin Pages (13 pages) - Pages 28-40
const AdminContent = lazy(() => import('./pages/admin/Content').then(m => ({ default: m.Content })));
const AdminPages = lazy(() => import('./pages/admin/Pages').then(m => ({ default: m.Pages })));
const AdminBlog = lazy(() => import('./pages/admin/Blog').then(m => ({ default: m.Blog })));
const AdminMedia = lazy(() => import('./pages/admin/Media').then(m => ({ default: m.Media })));
const AdminSupportTickets = lazy(() => import('./pages/admin/SupportTickets').then(m => ({ default: m.SupportTickets })));
const AdminLiveChat = lazy(() => import('./pages/admin/LiveChat').then(m => ({ default: m.LiveChat })));
const AdminUserFeedback = lazy(() => import('./pages/admin/UserFeedback').then(m => ({ default: m.UserFeedback })));
const AdminAbuseReports = lazy(() => import('./pages/admin/AbuseReports').then(m => ({ default: m.AbuseReports })));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics').then(m => ({ default: m.Analytics })));
const AdminReports = lazy(() => import('./pages/admin/Reports').then(m => ({ default: m.Reports })));
const AdminAuditLog = lazy(() => import('./pages/admin/AuditLog').then(m => ({ default: m.AuditLog })));
const AdminPerformance = lazy(() => import('./pages/admin/Performance').then(m => ({ default: m.Performance })));
const AdminFinance = lazy(() => import('./pages/admin/Finance').then(m => ({ default: m.Finance })));

// Public Pages (10 pages) - Pages 41-50
const Resources = lazy(() => import('./pages/public/Resources').then(m => ({ default: m.Resources })));
const Guides = lazy(() => import('./pages/public/Guides').then(m => ({ default: m.Guides })));
const Checklists = lazy(() => import('./pages/public/Checklists').then(m => ({ default: m.Checklists })));
const Templates = lazy(() => import('./pages/public/Templates').then(m => ({ default: m.Templates })));
const Webinars = lazy(() => import('./pages/public/Webinars').then(m => ({ default: m.Webinars })));
const Podcast = lazy(() => import('./pages/public/Podcast').then(m => ({ default: m.Podcast })));
const Events = lazy(() => import('./pages/public/Events').then(m => ({ default: m.Events })));
const Partners = lazy(() => import('./pages/public/Partners').then(m => ({ default: m.Partners })));
const Press = lazy(() => import('./pages/public/Press').then(m => ({ default: m.Press })));
const ApiDocs = lazy(() => import('./pages/public/ApiDocs').then(m => ({ default: m.ApiDocs })));

// ==================== ROUTES TO ADD ====================

// Inside the <Routes> component, add these new routes:

{/* User Routes - New Pages */}
<Route path="welcome" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Welcome /></ProtectedRoute>} />
<Route path="tour" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Tour /></ProtectedRoute>} />
<Route path="getting-started" element={<ProtectedRoute allowedRoles={['user', 'admin']}><GettingStarted /></ProtectedRoute>} />
<Route path="visa-roadmap" element={<ProtectedRoute allowedRoles={['user', 'admin']}><VisaRoadmap /></ProtectedRoute>} />
<Route path="document-checklist" element={<ProtectedRoute allowedRoles={['user', 'admin']}><DocumentChecklist /></ProtectedRoute>} />
<Route path="application-timeline" element={<ProtectedRoute allowedRoles={['user', 'admin']}><ApplicationTimeline /></ProtectedRoute>} />
<Route path="deadline-alerts" element={<ProtectedRoute allowedRoles={['user', 'admin']}><DeadlineAlerts /></ProtectedRoute>} />
<Route path="profile" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Profile /></ProtectedRoute>} />
<Route path="notifications" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Notifications /></ProtectedRoute>} />
<Route path="billing" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Billing /></ProtectedRoute>} />
<Route path="security" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Security /></ProtectedRoute>} />
<Route path="help-center" element={<ProtectedRoute allowedRoles={['user', 'admin']}><HelpCenter /></ProtectedRoute>} />
<Route path="live-chat" element={<ProtectedRoute allowedRoles={['user', 'admin']}><LiveChat /></ProtectedRoute>} />
<Route path="feedback" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Feedback /></ProtectedRoute>} />
<Route path="report-issue" element={<ProtectedRoute allowedRoles={['user', 'admin']}><ReportIssue /></ProtectedRoute>} />

{/* Lawyer Routes - New Pages */}
<Route path="lawyer/profile" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerProfile /></ProtectedRoute>} />
<Route path="lawyer/reviews" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerReviews /></ProtectedRoute>} />
<Route path="lawyer/analytics" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerAnalytics /></ProtectedRoute>} />
<Route path="lawyer/billing" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerBilling /></ProtectedRoute>} />
<Route path="lawyer/contracts" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerContracts /></ProtectedRoute>} />
<Route path="lawyer/team" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerTeam /></ProtectedRoute>} />
<Route path="lawyer/client/:id" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerClientDetail /></ProtectedRoute>} />
<Route path="lawyer/cases" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerCases /></ProtectedRoute>} />
<Route path="lawyer/documents" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerDocuments /></ProtectedRoute>} />
<Route path="lawyer/notes" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerNotes /></ProtectedRoute>} />
<Route path="lawyer/lead-capture" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerLeadCapture /></ProtectedRoute>} />
<Route path="lawyer/testimonials" element={<ProtectedRoute allowedRoles={['lawyer']}><LawyerTestimonials /></ProtectedRoute>} />

{/* Admin Routes - New Pages */}
<Route path="admin/content" element={<ProtectedRoute allowedRoles={['admin']}><AdminContent /></ProtectedRoute>} />
<Route path="admin/pages" element={<ProtectedRoute allowedRoles={['admin']}><AdminPages /></ProtectedRoute>} />
<Route path="admin/blog" element={<ProtectedRoute allowedRoles={['admin']}><AdminBlog /></ProtectedRoute>} />
<Route path="admin/media" element={<ProtectedRoute allowedRoles={['admin']}><AdminMedia /></ProtectedRoute>} />
<Route path="admin/support-tickets" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupportTickets /></ProtectedRoute>} />
<Route path="admin/live-chat" element={<ProtectedRoute allowedRoles={['admin']}><AdminLiveChat /></ProtectedRoute>} />
<Route path="admin/user-feedback" element={<ProtectedRoute allowedRoles={['admin']}><AdminUserFeedback /></ProtectedRoute>} />
<Route path="admin/abuse-reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminAbuseReports /></ProtectedRoute>} />
<Route path="admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
<Route path="admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
<Route path="admin/audit-log" element={<ProtectedRoute allowedRoles={['admin']}><AdminAuditLog /></ProtectedRoute>} />
<Route path="admin/performance" element={<ProtectedRoute allowedRoles={['admin']}><AdminPerformance /></ProtectedRoute>} />
<Route path="admin/finance" element={<ProtectedRoute allowedRoles={['admin']}><AdminFinance /></ProtectedRoute>} />

{/* Public Routes - New Pages (add inside PublicLayout) */}
<Route path="resources" element={<Resources />} />
<Route path="guides" element={<Guides />} />
<Route path="checklists" element={<Checklists />} />
<Route path="templates" element={<Templates />} />
<Route path="webinars" element={<Webinars />} />
<Route path="podcast" element={<Podcast />} />
<Route path="events" element={<Events />} />
<Route path="partners" element={<Partners />} />
<Route path="press" element={<Press />} />
<Route path="api-docs" element={<ApiDocs />} />
