import { lazy } from 'react';
import { Route } from 'react-router-dom';

const MobileAbout = lazy(() => import('../pages/mobile/MobileAbout'));
const MobileCalculator = lazy(() => import('../pages/mobile/MobileCalculator'));
const MobileChecklist = lazy(() => import('../pages/mobile/MobileChecklist'));
const MobileCommunityHome = lazy(() => import('../pages/mobile/MobileCommunityHome'));
const MobileContact = lazy(() => import('../pages/mobile/MobileContact'));
const MobileCreatePost = lazy(() => import('../pages/mobile/MobileCreatePost'));
const MobileCurrencyConverter = lazy(() => import('../pages/mobile/MobileCurrencyConverter'));
const MobileDashboardHome = lazy(() => import('../pages/mobile/MobileDashboardHome'));
const MobileEditProfile = lazy(() => import('../pages/mobile/MobileEditProfile'));
const MobileError = lazy(() => import('../pages/mobile/MobileError'));
const MobileFeedback = lazy(() => import('../pages/mobile/MobileFeedback'));
const MobileForgotPassword = lazy(() => import('../pages/mobile/MobileForgotPassword'));
const MobileForumTopic = lazy(() => import('../pages/mobile/MobileForumTopic'));
const MobileLawyerBooking = lazy(() => import('../pages/mobile/MobileLawyerBooking'));
const MobileLawyerChat = lazy(() => import('../pages/mobile/MobileLawyerChat'));
const MobileLawyerProfile = lazy(() => import('../pages/mobile/MobileLawyerProfile'));
const MobileLawyerReviews = lazy(() => import('../pages/mobile/MobileLawyerReviews'));
const MobileLawyerSearch = lazy(() => import('../pages/mobile/MobileLawyerSearch'));
const MobileLogin = lazy(() => import('../pages/mobile/MobileLogin'));
const MobileMaintenance = lazy(() => import('../pages/mobile/MobileMaintenance'));
const MobileMap = lazy(() => import('../pages/mobile/MobileMap'));
const MobileNewsDetail = lazy(() => import('../pages/mobile/MobileNewsDetail'));
const MobileNewsFeed = lazy(() => import('../pages/mobile/MobileNewsFeed'));
const MobileNotFound = lazy(() => import('../pages/mobile/MobileNotFound'));
const MobileNotifications = lazy(() => import('../pages/mobile/MobileNotifications'));
const MobileOffline = lazy(() => import('../pages/mobile/MobileOffline'));
const MobileOnboardingComplete = lazy(() => import('../pages/mobile/MobileOnboardingComplete'));
const MobileOnboardingStep1 = lazy(() => import('../pages/mobile/MobileOnboardingStep1'));
const MobileOnboardingStep2 = lazy(() => import('../pages/mobile/MobileOnboardingStep2'));
const MobileOnboardingStep3 = lazy(() => import('../pages/mobile/MobileOnboardingStep3'));
const MobilePrivacy = lazy(() => import('../pages/mobile/MobilePrivacy'));
const MobileProfile = lazy(() => import('../pages/mobile/MobileProfile'));
const MobileRegister = lazy(() => import('../pages/mobile/MobileRegister'));
const MobileResetPassword = lazy(() => import('../pages/mobile/MobileResetPassword'));
const MobileSettings = lazy(() => import('../pages/mobile/MobileSettings'));
const MobileTerms = lazy(() => import('../pages/mobile/MobileTerms'));
const MobileTrackerDocuments = lazy(() => import('../pages/mobile/MobileTrackerDocuments'));
const MobileTrackerHome = lazy(() => import('../pages/mobile/MobileTrackerHome'));
const MobileTrackerMessages = lazy(() => import('../pages/mobile/MobileTrackerMessages'));
const MobileTrackerStatus = lazy(() => import('../pages/mobile/MobileTrackerStatus'));
const MobileTrackerTimeline = lazy(() => import('../pages/mobile/MobileTrackerTimeline'));
const MobileTranslation = lazy(() => import('../pages/mobile/MobileTranslation'));
const MobileUpdate = lazy(() => import('../pages/mobile/MobileUpdate'));
const MobileVerifyEmail = lazy(() => import('../pages/mobile/MobileVerifyEmail'));
const MobileVisaAssessment = lazy(() => import('../pages/mobile/MobileVisaAssessment'));
const MobileVisaCompare = lazy(() => import('../pages/mobile/MobileVisaCompare'));
const MobileVisaDetail = lazy(() => import('../pages/mobile/MobileVisaDetail'));
const MobileVisaEligibility = lazy(() => import('../pages/mobile/MobileVisaEligibility'));
const MobileVisaSearch = lazy(() => import('../pages/mobile/MobileVisaSearch'));
const MobileWelcome = lazy(() => import('../pages/mobile/MobileWelcome'));

export const MobileRoutes = (
  <>
    <Route path="about" element={<MobileAbout />} />
    <Route path="calculator" element={<MobileCalculator />} />
    <Route path="checklist" element={<MobileChecklist />} />
    <Route path="community-home" element={<MobileCommunityHome />} />
    <Route path="contact" element={<MobileContact />} />
    <Route path="create-post" element={<MobileCreatePost />} />
    <Route path="currency-converter" element={<MobileCurrencyConverter />} />
    <Route path="dashboard" element={<MobileDashboardHome />} />
    <Route path="edit-profile" element={<MobileEditProfile />} />
    <Route path="error" element={<MobileError />} />
    <Route path="feedback" element={<MobileFeedback />} />
    <Route path="forgot-password" element={<MobileForgotPassword />} />
    <Route path="forum-topic" element={<MobileForumTopic />} />
    <Route path="lawyer-booking" element={<MobileLawyerBooking />} />
    <Route path="lawyer-chat" element={<MobileLawyerChat />} />
    <Route path="lawyer-profile" element={<MobileLawyerProfile />} />
    <Route path="lawyer-reviews" element={<MobileLawyerReviews />} />
    <Route path="lawyer-search" element={<MobileLawyerSearch />} />
    <Route path="login" element={<MobileLogin />} />
    <Route path="maintenance" element={<MobileMaintenance />} />
    <Route path="map" element={<MobileMap />} />
    <Route path="news-detail" element={<MobileNewsDetail />} />
    <Route path="news-feed" element={<MobileNewsFeed />} />
    <Route path="not-found" element={<MobileNotFound />} />
    <Route path="notifications" element={<MobileNotifications />} />
    <Route path="offline" element={<MobileOffline />} />
    <Route path="onboarding-complete" element={<MobileOnboardingComplete />} />
    <Route path="onboarding-step1" element={<MobileOnboardingStep1 />} />
    <Route path="onboarding-step2" element={<MobileOnboardingStep2 />} />
    <Route path="onboarding-step3" element={<MobileOnboardingStep3 />} />
    <Route path="privacy" element={<MobilePrivacy />} />
    <Route path="profile" element={<MobileProfile />} />
    <Route path="register" element={<MobileRegister />} />
    <Route path="reset-password" element={<MobileResetPassword />} />
    <Route path="settings" element={<MobileSettings />} />
    <Route path="terms" element={<MobileTerms />} />
    <Route path="tracker-documents" element={<MobileTrackerDocuments />} />
    <Route path="tracker-home" element={<MobileTrackerHome />} />
    <Route path="tracker-messages" element={<MobileTrackerMessages />} />
    <Route path="tracker-status" element={<MobileTrackerStatus />} />
    <Route path="tracker-timeline" element={<MobileTrackerTimeline />} />
    <Route path="translation" element={<MobileTranslation />} />
    <Route path="update" element={<MobileUpdate />} />
    <Route path="verify-email" element={<MobileVerifyEmail />} />
    <Route path="visa-assessment" element={<MobileVisaAssessment />} />
    <Route path="visa-compare" element={<MobileVisaCompare />} />
    <Route path="visa-detail" element={<MobileVisaDetail />} />
    <Route path="visa-eligibility" element={<MobileVisaEligibility />} />
    <Route path="visa-search" element={<MobileVisaSearch />} />
    <Route path="welcome" element={<MobileWelcome />} />
  </>
);
