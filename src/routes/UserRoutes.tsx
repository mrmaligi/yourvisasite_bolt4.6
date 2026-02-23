import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserDashboardLayout } from '../components/layout/UserDashboardLayout';

const Welcome = lazy(() => import('../pages/user/onboarding/Welcome').then(m => ({ default: m.Welcome })));
const Tour = lazy(() => import('../pages/user/onboarding/Tour').then(m => ({ default: m.Tour })));
const GettingStarted = lazy(() => import('../pages/user/onboarding/GettingStarted').then(m => ({ default: m.GettingStarted })));
const Preferences = lazy(() => import('../pages/user/onboarding/Preferences').then(m => ({ default: m.Preferences })));
const Complete = lazy(() => import('../pages/user/onboarding/Complete').then(m => ({ default: m.Complete })));
const VisaRoadmap = lazy(() => import('../pages/user/dashboard/VisaRoadmap').then(m => ({ default: m.VisaRoadmap })));
const DocumentChecklist = lazy(() => import('../pages/user/dashboard/DocumentChecklist').then(m => ({ default: m.DocumentChecklist })));
const ApplicationTimeline = lazy(() => import('../pages/user/dashboard/ApplicationTimeline').then(m => ({ default: m.ApplicationTimeline })));
const DeadlineAlerts = lazy(() => import('../pages/user/dashboard/DeadlineAlerts').then(m => ({ default: m.DeadlineAlerts })));
const Milestones = lazy(() => import('../pages/user/dashboard/Milestones').then(m => ({ default: m.Milestones })));
const ProgressDashboard = lazy(() => import('../pages/user/dashboard/ProgressDashboard').then(m => ({ default: m.ProgressDashboard })));
const Tasks = lazy(() => import('../pages/user/dashboard/Tasks').then(m => ({ default: m.Tasks })));
const Reminders = lazy(() => import('../pages/user/dashboard/Reminders').then(m => ({ default: m.Reminders })));
const Calendar = lazy(() => import('../pages/user/dashboard/Calendar').then(m => ({ default: m.Calendar })));
const Activity = lazy(() => import('../pages/user/dashboard/Activity').then(m => ({ default: m.Activity })));
const Profile = lazy(() => import('../pages/user/profile/Profile').then(m => ({ default: m.Profile })));
const EditProfile = lazy(() => import('../pages/user/profile/EditProfile').then(m => ({ default: m.EditProfile })));
const Notifications = lazy(() => import('../pages/user/profile/Notifications').then(m => ({ default: m.Notifications })));
const NotificationSettings = lazy(() => import('../pages/user/profile/NotificationSettings').then(m => ({ default: m.NotificationSettings })));
const Billing = lazy(() => import('../pages/user/profile/Billing').then(m => ({ default: m.Billing })));
const Invoices = lazy(() => import('../pages/user/profile/Invoices').then(m => ({ default: m.Invoices })));
const PaymentMethods = lazy(() => import('../pages/user/profile/PaymentMethods').then(m => ({ default: m.PaymentMethods })));
const Security = lazy(() => import('../pages/user/profile/Security').then(m => ({ default: m.Security })));
const Logins = lazy(() => import('../pages/user/profile/Logins').then(m => ({ default: m.Logins })));
const PrivacySettings = lazy(() => import('../pages/user/profile/PrivacySettings').then(m => ({ default: m.PrivacySettings })));
const HelpCenter = lazy(() => import('../pages/user/support/HelpCenter').then(m => ({ default: m.HelpCenter })));
const Article = lazy(() => import('../pages/user/support/Article').then(m => ({ default: m.Article })));
const Category = lazy(() => import('../pages/user/support/Category').then(m => ({ default: m.Category })));
const LiveChat = lazy(() => import('../pages/user/support/LiveChat').then(m => ({ default: m.LiveChat })));
const Feedback = lazy(() => import('../pages/user/support/Feedback').then(m => ({ default: m.Feedback })));
const ReportIssue = lazy(() => import('../pages/user/support/ReportIssue').then(m => ({ default: m.ReportIssue })));
const ContactSupport = lazy(() => import('../pages/user/support/ContactSupport').then(m => ({ default: m.ContactSupport })));
const FAQ = lazy(() => import('../pages/user/support/FAQ').then(m => ({ default: m.FAQ })));
const Tutorials = lazy(() => import('../pages/user/support/Tutorials').then(m => ({ default: m.Tutorials })));
const Community = lazy(() => import('../pages/user/support/Community').then(m => ({ default: m.Community })));
const Documents = lazy(() => import('../pages/user/documents/Documents').then(m => ({ default: m.Documents })));
const Upload = lazy(() => import('../pages/user/documents/Upload').then(m => ({ default: m.Upload })));
const Organize = lazy(() => import('../pages/user/documents/Organize').then(m => ({ default: m.Organize })));
const Share = lazy(() => import('../pages/user/documents/Share').then(m => ({ default: m.Share })));
const Notes = lazy(() => import('../pages/user/documents/Notes').then(m => ({ default: m.Notes })));
const NoteDetail = lazy(() => import('../pages/user/documents/NoteDetail').then(m => ({ default: m.NoteDetail })));
const Expenses = lazy(() => import('../pages/user/documents/Expenses').then(m => ({ default: m.Expenses })));
const ExpenseReport = lazy(() => import('../pages/user/documents/ExpenseReport').then(m => ({ default: m.ExpenseReport })));
const Templates = lazy(() => import('../pages/user/documents/Templates').then(m => ({ default: m.Templates })));
const TemplateDetail = lazy(() => import('../pages/user/documents/TemplateDetail').then(m => ({ default: m.TemplateDetail })));
const Messages = lazy(() => import('../pages/user/messages/Messages').then(m => ({ default: m.Messages })));
const Conversation = lazy(() => import('../pages/user/messages/Conversation').then(m => ({ default: m.Conversation })));
const ConsultationsHistory = lazy(() => import('../pages/user/messages/ConsultationsHistory').then(m => ({ default: m.ConsultationsHistory })));
const SavedLawyers = lazy(() => import('../pages/user/messages/SavedLawyers').then(m => ({ default: m.SavedLawyers })));
const MyReviews = lazy(() => import('../pages/user/messages/MyReviews').then(m => ({ default: m.MyReviews })));

export function UserRoutes() {
  return (
    <Routes>
      {/* Onboarding Routes - Standalone */}
      <Route path="welcome" element={<Welcome />} />
      <Route path="tour" element={<Tour />} />
      <Route path="getting-started" element={<GettingStarted />} />
      <Route path="onboarding/preferences" element={<Preferences />} />
      <Route path="onboarding/complete" element={<Complete />} />

      {/* Dashboard Routes - With Layout */}
      <Route element={<UserDashboardLayout />}>
        {/* Core Dashboard Pages */}
        <Route path="visa-roadmap" element={<VisaRoadmap />} />
        <Route path="document-checklist" element={<DocumentChecklist />} />
        <Route path="application-timeline" element={<ApplicationTimeline />} />
        <Route path="deadline-alerts" element={<DeadlineAlerts />} />
        <Route path="milestones" element={<Milestones />} />
        <Route path="progress-dashboard" element={<ProgressDashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="activity" element={<Activity />} />

        {/* Profile Pages */}
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="notifications/settings" element={<NotificationSettings />} />
        <Route path="billing" element={<Billing />} />
        <Route path="billing/invoices" element={<Invoices />} />
        <Route path="billing/payment-methods" element={<PaymentMethods />} />
        <Route path="security" element={<Security />} />
        <Route path="security/logins" element={<Logins />} />
        <Route path="privacy-settings" element={<PrivacySettings />} />

        {/* Support Pages */}
        <Route path="help-center" element={<HelpCenter />} />
        <Route path="help-center/article/:slug" element={<Article />} />
        <Route path="help-center/category/:category" element={<Category />} />
        <Route path="live-chat" element={<LiveChat />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="report-issue" element={<ReportIssue />} />
        <Route path="contact-support" element={<ContactSupport />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="tutorials" element={<Tutorials />} />
        <Route path="community" element={<Community />} />

        {/* Document Pages */}
        <Route path="documents" element={<Documents />} />
        <Route path="documents/upload" element={<Upload />} />
        <Route path="documents/organize" element={<Organize />} />
        <Route path="documents/share" element={<Share />} />
        <Route path="notes" element={<Notes />} />
        <Route path="notes/:id" element={<NoteDetail />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="expenses/report" element={<ExpenseReport />} />
        <Route path="templates" element={<Templates />} />
        <Route path="templates/:id" element={<TemplateDetail />} />

        {/* Communication Pages */}
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:id" element={<Conversation />} />
        <Route path="consultations/history" element={<ConsultationsHistory />} />
        <Route path="lawyers/saved" element={<SavedLawyers />} />
        <Route path="reviews/my-reviews" element={<MyReviews />} />
      </Route>
    </Routes>
  );
}
