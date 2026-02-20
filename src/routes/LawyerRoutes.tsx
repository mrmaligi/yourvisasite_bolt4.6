import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LawyerDashboardLayout } from '../components/layout/LawyerDashboardLayout';

// Profile & Marketing
const EnhancedProfile = lazy(() => import('../pages/lawyer/profile/EnhancedProfile').then(m => ({ default: m.EnhancedProfile })));
const EditProfile = lazy(() => import('../pages/lawyer/profile/EditProfile').then(m => ({ default: m.EditProfile })));
const SEOSettings = lazy(() => import('../pages/lawyer/profile/SEOSettings').then(m => ({ default: m.SEOSettings })));
const ClientReviews = lazy(() => import('../pages/lawyer/reviews/ClientReviews').then(m => ({ default: m.ClientReviews })));
const RespondReviews = lazy(() => import('../pages/lawyer/reviews/RespondReviews').then(m => ({ default: m.RespondReviews })));
const Testimonials = lazy(() => import('../pages/lawyer/testimonials/Testimonials').then(m => ({ default: m.Testimonials })));
const Portfolio = lazy(() => import('../pages/lawyer/portfolio/Portfolio').then(m => ({ default: m.Portfolio })));
const Specializations = lazy(() => import('../pages/lawyer/specializations/Specializations').then(m => ({ default: m.Specializations })));
const Achievements = lazy(() => import('../pages/lawyer/achievements/Achievements').then(m => ({ default: m.Achievements })));
const VerificationStatus = lazy(() => import('../pages/lawyer/verification/VerificationStatus').then(m => ({ default: m.VerificationStatus })));

// Practice Management
const PracticeAnalytics = lazy(() => import('../pages/lawyer/analytics/PracticeAnalytics').then(m => ({ default: m.PracticeAnalytics })));
const RevenueAnalytics = lazy(() => import('../pages/lawyer/analytics/RevenueAnalytics').then(m => ({ default: m.RevenueAnalytics })));
const ClientAnalytics = lazy(() => import('../pages/lawyer/analytics/ClientAnalytics').then(m => ({ default: m.ClientAnalytics })));
const PerformanceMetrics = lazy(() => import('../pages/lawyer/analytics/PerformanceMetrics').then(m => ({ default: m.PerformanceMetrics })));
const Billing = lazy(() => import('../pages/lawyer/billing/Billing').then(m => ({ default: m.Billing })));
const Invoices = lazy(() => import('../pages/lawyer/billing/Invoices').then(m => ({ default: m.Invoices })));
const Payments = lazy(() => import('../pages/lawyer/billing/Payments').then(m => ({ default: m.Payments })));
const Contracts = lazy(() => import('../pages/lawyer/contracts/Contracts').then(m => ({ default: m.Contracts })));
const ContractEditor = lazy(() => import('../pages/lawyer/contracts/ContractEditor').then(m => ({ default: m.ContractEditor })));
const DocumentManagement = lazy(() => import('../pages/lawyer/documents/DocumentManagement').then(m => ({ default: m.DocumentManagement })));

// Client Management
const DetailedClientView = lazy(() => import('../pages/lawyer/clients/DetailedClientView').then(m => ({ default: m.DetailedClientView })));
const ClientOnboarding = lazy(() => import('../pages/lawyer/clients/ClientOnboarding').then(m => ({ default: m.ClientOnboarding })));
const ClientCommunication = lazy(() => import('../pages/lawyer/clients/ClientCommunication').then(m => ({ default: m.ClientCommunication })));
const CaseManagement = lazy(() => import('../pages/lawyer/cases/CaseManagement').then(m => ({ default: m.CaseManagement })));
const CaseDetail = lazy(() => import('../pages/lawyer/cases/CaseDetail').then(m => ({ default: m.CaseDetail })));
const CaseKanban = lazy(() => import('../pages/lawyer/cases/CaseKanban').then(m => ({ default: m.CaseKanban })));
const CaseTimeline = lazy(() => import('../pages/lawyer/cases/CaseTimeline').then(m => ({ default: m.CaseTimeline })));
const ClientNotes = lazy(() => import('../pages/lawyer/notes/ClientNotes').then(m => ({ default: m.ClientNotes })));
const NoteDetail = lazy(() => import('../pages/lawyer/notes/NoteDetail').then(m => ({ default: m.NoteDetail })));
const TaskManagement = lazy(() => import('../pages/lawyer/tasks/TaskManagement').then(m => ({ default: m.TaskManagement })));

// Growth & Marketing
const MarketingDashboard = lazy(() => import('../pages/lawyer/marketing/MarketingDashboard').then(m => ({ default: m.MarketingDashboard })));
const Campaigns = lazy(() => import('../pages/lawyer/marketing/Campaigns').then(m => ({ default: m.Campaigns })));
const LeadCapture = lazy(() => import('../pages/lawyer/leads/LeadCapture').then(m => ({ default: m.LeadCapture })));
const LeadManagement = lazy(() => import('../pages/lawyer/leads/LeadManagement').then(m => ({ default: m.LeadManagement })));
const LeadNurture = lazy(() => import('../pages/lawyer/leads/LeadNurture').then(m => ({ default: m.LeadNurture })));
const WebsiteBuilder = lazy(() => import('../pages/lawyer/website/WebsiteBuilder').then(m => ({ default: m.WebsiteBuilder })));
const SocialMedia = lazy(() => import('../pages/lawyer/social/SocialMedia').then(m => ({ default: m.SocialMedia })));
const ContentMarketing = lazy(() => import('../pages/lawyer/content/ContentMarketing').then(m => ({ default: m.ContentMarketing })));
const ReferralProgram = lazy(() => import('../pages/lawyer/referrals/ReferralProgram').then(m => ({ default: m.ReferralProgram })));
const Advertising = lazy(() => import('../pages/lawyer/advertising/Advertising').then(m => ({ default: m.Advertising })));

// Advanced Features
const TeamManagement = lazy(() => import('../pages/lawyer/team/TeamManagement').then(m => ({ default: m.TeamManagement })));
const RolePermissions = lazy(() => import('../pages/lawyer/team/RolePermissions').then(m => ({ default: m.RolePermissions })));
const TeamSchedule = lazy(() => import('../pages/lawyer/team/TeamSchedule').then(m => ({ default: m.TeamSchedule })));
const WorkflowAutomation = lazy(() => import('../pages/lawyer/automation/WorkflowAutomation').then(m => ({ default: m.WorkflowAutomation })));
const DocumentTemplates = lazy(() => import('../pages/lawyer/templates/DocumentTemplates').then(m => ({ default: m.DocumentTemplates })));
const CustomForms = lazy(() => import('../pages/lawyer/forms/CustomForms').then(m => ({ default: m.CustomForms })));
const CustomReports = lazy(() => import('../pages/lawyer/reports/CustomReports').then(m => ({ default: m.CustomReports })));
const IntegrationsHub = lazy(() => import('../pages/lawyer/integrations/IntegrationsHub').then(m => ({ default: m.IntegrationsHub })));
const ApiAccess = lazy(() => import('../pages/lawyer/api/ApiAccess').then(m => ({ default: m.ApiAccess })));
const AdvancedSettings = lazy(() => import('../pages/lawyer/settings/AdvancedSettings').then(m => ({ default: m.AdvancedSettings })));

export function LawyerRoutes() {
  return (
    <Routes>
      <Route element={<LawyerDashboardLayout />}>
        {/* Profile & Marketing */}
        <Route path="profile/enhanced" element={<EnhancedProfile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="profile/seo" element={<SEOSettings />} />
        <Route path="reviews" element={<ClientReviews />} />
        <Route path="reviews/respond" element={<RespondReviews />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="specializations" element={<Specializations />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="verification" element={<VerificationStatus />} />

        {/* Practice Management */}
        <Route path="analytics" element={<PracticeAnalytics />} />
        <Route path="analytics/revenue" element={<RevenueAnalytics />} />
        <Route path="analytics/clients" element={<ClientAnalytics />} />
        <Route path="analytics/performance" element={<PerformanceMetrics />} />
        <Route path="billing" element={<Billing />} />
        <Route path="billing/invoices" element={<Invoices />} />
        <Route path="billing/payments" element={<Payments />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="contracts/editor" element={<ContractEditor />} />
        <Route path="documents" element={<DocumentManagement />} />

        {/* Client Management */}
        <Route path="clients/detailed" element={<DetailedClientView />} />
        <Route path="clients/onboarding" element={<ClientOnboarding />} />
        <Route path="clients/communication" element={<ClientCommunication />} />
        <Route path="cases" element={<CaseManagement />} />
        <Route path="cases/kanban" element={<CaseKanban />} />
        <Route path="cases/timeline" element={<CaseTimeline />} />
        <Route path="cases/:id" element={<CaseDetail />} />
        <Route path="notes" element={<ClientNotes />} />
        <Route path="notes/:id" element={<NoteDetail />} />
        <Route path="tasks" element={<TaskManagement />} />

        {/* Growth & Marketing */}
        <Route path="marketing" element={<MarketingDashboard />} />
        <Route path="marketing/campaigns" element={<Campaigns />} />
        <Route path="lead-capture" element={<LeadCapture />} />
        <Route path="leads" element={<LeadManagement />} />
        <Route path="leads/nurture" element={<LeadNurture />} />
        <Route path="website" element={<WebsiteBuilder />} />
        <Route path="social" element={<SocialMedia />} />
        <Route path="content" element={<ContentMarketing />} />
        <Route path="referrals" element={<ReferralProgram />} />
        <Route path="advertising" element={<Advertising />} />

        {/* Advanced Features */}
        <Route path="team" element={<TeamManagement />} />
        <Route path="team/roles" element={<RolePermissions />} />
        <Route path="team/schedule" element={<TeamSchedule />} />
        <Route path="automation" element={<WorkflowAutomation />} />
        <Route path="templates" element={<DocumentTemplates />} />
        <Route path="forms" element={<CustomForms />} />
        <Route path="reports" element={<CustomReports />} />
        <Route path="integrations" element={<IntegrationsHub />} />
        <Route path="api" element={<ApiAccess />} />
        <Route path="settings/advanced" element={<AdvancedSettings />} />
      </Route>
    </Routes>
  );
}
