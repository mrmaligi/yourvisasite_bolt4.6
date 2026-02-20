import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loading } from '../../components/ui/Loading';
import { AILayout } from '../../components/layout/AILayout';

// Lazy load all AI pages
const Chat = lazy(() => import('./assistant/Chat').then(m => ({ default: m.Chat })));
const VisaConsult = lazy(() => import('./assistant/VisaConsult').then(m => ({ default: m.VisaConsult })));
const LegalBot = lazy(() => import('./assistant/LegalBot').then(m => ({ default: m.LegalBot })));
const InterviewCoach = lazy(() => import('./assistant/InterviewCoach').then(m => ({ default: m.InterviewCoach })));
const Translator = lazy(() => import('./assistant/Translator').then(m => ({ default: m.Translator })));
const Summarizer = lazy(() => import('./assistant/Summarizer').then(m => ({ default: m.Summarizer })));
const EmailWriter = lazy(() => import('./assistant/EmailWriter').then(m => ({ default: m.EmailWriter })));
const History = lazy(() => import('./assistant/History').then(m => ({ default: m.History })));
const Feedback = lazy(() => import('./assistant/Feedback').then(m => ({ default: m.Feedback })));
const AssistantSettings = lazy(() => import('./assistant/AssistantSettings').then(m => ({ default: m.AssistantSettings })));
const Scanner = lazy(() => import('./documents/Scanner').then(m => ({ default: m.Scanner })));
const OCR = lazy(() => import('./documents/OCR').then(m => ({ default: m.OCR })));
const Classifier = lazy(() => import('./documents/Classifier').then(m => ({ default: m.Classifier })));
const Extractor = lazy(() => import('./documents/Extractor').then(m => ({ default: m.Extractor })));
const Verifier = lazy(() => import('./documents/Verifier').then(m => ({ default: m.Verifier })));
const DocTranslator = lazy(() => import('./documents/DocTranslator').then(m => ({ default: m.DocTranslator })));
const Generator = lazy(() => import('./documents/Generator').then(m => ({ default: m.Generator })));
const Editor = lazy(() => import('./documents/Editor').then(m => ({ default: m.Editor })));
const Comparison = lazy(() => import('./documents/Comparison').then(m => ({ default: m.Comparison })));
const Audit = lazy(() => import('./documents/Audit').then(m => ({ default: m.Audit })));
const Dashboard = lazy(() => import('./automation/Dashboard').then(m => ({ default: m.Dashboard })));
const Builder = lazy(() => import('./automation/Builder').then(m => ({ default: m.Builder })));
const Templates = lazy(() => import('./automation/Templates').then(m => ({ default: m.Templates })));
const Active = lazy(() => import('./automation/Active').then(m => ({ default: m.Active })));
const Logs = lazy(() => import('./automation/Logs').then(m => ({ default: m.Logs })));
const Integrations = lazy(() => import('./automation/Integrations').then(m => ({ default: m.Integrations })));
const Triggers = lazy(() => import('./automation/Triggers').then(m => ({ default: m.Triggers })));
const Notifications = lazy(() => import('./automation/Notifications').then(m => ({ default: m.Notifications })));
const Approvals = lazy(() => import('./automation/Approvals').then(m => ({ default: m.Approvals })));
const Analytics = lazy(() => import('./automation/Analytics').then(m => ({ default: m.Analytics })));
const Eligibility = lazy(() => import('./smart/Eligibility').then(m => ({ default: m.Eligibility })));
const Prediction = lazy(() => import('./smart/Prediction').then(m => ({ default: m.Prediction })));
const Recommendation = lazy(() => import('./smart/Recommendation').then(m => ({ default: m.Recommendation })));
const Timeline = lazy(() => import('./smart/Timeline').then(m => ({ default: m.Timeline })));
const Budget = lazy(() => import('./smart/Budget').then(m => ({ default: m.Budget })));
const Risk = lazy(() => import('./smart/Risk').then(m => ({ default: m.Risk })));
const Competitor = lazy(() => import('./smart/Competitor').then(m => ({ default: m.Competitor })));
const Trends = lazy(() => import('./smart/Trends').then(m => ({ default: m.Trends })));
const Pathway = lazy(() => import('./smart/Pathway').then(m => ({ default: m.Pathway })));
const Location = lazy(() => import('./smart/Location').then(m => ({ default: m.Location })));
const Anomaly = lazy(() => import('./ml/Anomaly').then(m => ({ default: m.Anomaly })));
const Fraud = lazy(() => import('./ml/Fraud').then(m => ({ default: m.Fraud })));
const Sentiment = lazy(() => import('./ml/Sentiment').then(m => ({ default: m.Sentiment })));
const Classification = lazy(() => import('./ml/Classification').then(m => ({ default: m.Classification })));
const Extraction = lazy(() => import('./ml/Extraction').then(m => ({ default: m.Extraction })));
const MLTranslation = lazy(() => import('./ml/MLTranslation').then(m => ({ default: m.MLTranslation })));
const MLOCR = lazy(() => import('./ml/MLOCR').then(m => ({ default: m.MLOCR })));
const Speech = lazy(() => import('./ml/Speech').then(m => ({ default: m.Speech })));
const Vision = lazy(() => import('./ml/Vision').then(m => ({ default: m.Vision })));
const Training = lazy(() => import('./ml/Training').then(m => ({ default: m.Training })));

export function AIRoutes() {
  return (
    <Routes>
      <Route element={<AILayout />}>
        <Route index element={<Navigate to="assistant/chat" replace />} />
        <Route path="assistant/chat" element={<Suspense fallback={<Loading />}><Chat /></Suspense>} />
        <Route path="assistant/visa-consult" element={<Suspense fallback={<Loading />}><VisaConsult /></Suspense>} />
        <Route path="assistant/legal-bot" element={<Suspense fallback={<Loading />}><LegalBot /></Suspense>} />
        <Route path="assistant/interview-coach" element={<Suspense fallback={<Loading />}><InterviewCoach /></Suspense>} />
        <Route path="assistant/translator" element={<Suspense fallback={<Loading />}><Translator /></Suspense>} />
        <Route path="assistant/summarizer" element={<Suspense fallback={<Loading />}><Summarizer /></Suspense>} />
        <Route path="assistant/email-writer" element={<Suspense fallback={<Loading />}><EmailWriter /></Suspense>} />
        <Route path="assistant/history" element={<Suspense fallback={<Loading />}><History /></Suspense>} />
        <Route path="assistant/feedback" element={<Suspense fallback={<Loading />}><Feedback /></Suspense>} />
        <Route path="assistant/settings" element={<Suspense fallback={<Loading />}><AssistantSettings /></Suspense>} />
        <Route path="documents/scanner" element={<Suspense fallback={<Loading />}><Scanner /></Suspense>} />
        <Route path="documents/ocr" element={<Suspense fallback={<Loading />}><OCR /></Suspense>} />
        <Route path="documents/classifier" element={<Suspense fallback={<Loading />}><Classifier /></Suspense>} />
        <Route path="documents/extractor" element={<Suspense fallback={<Loading />}><Extractor /></Suspense>} />
        <Route path="documents/verifier" element={<Suspense fallback={<Loading />}><Verifier /></Suspense>} />
        <Route path="documents/translator" element={<Suspense fallback={<Loading />}><DocTranslator /></Suspense>} />
        <Route path="documents/generator" element={<Suspense fallback={<Loading />}><Generator /></Suspense>} />
        <Route path="documents/editor" element={<Suspense fallback={<Loading />}><Editor /></Suspense>} />
        <Route path="documents/comparison" element={<Suspense fallback={<Loading />}><Comparison /></Suspense>} />
        <Route path="documents/audit" element={<Suspense fallback={<Loading />}><Audit /></Suspense>} />
        <Route path="automation/dashboard" element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>} />
        <Route path="automation/builder" element={<Suspense fallback={<Loading />}><Builder /></Suspense>} />
        <Route path="automation/templates" element={<Suspense fallback={<Loading />}><Templates /></Suspense>} />
        <Route path="automation/active" element={<Suspense fallback={<Loading />}><Active /></Suspense>} />
        <Route path="automation/logs" element={<Suspense fallback={<Loading />}><Logs /></Suspense>} />
        <Route path="automation/integrations" element={<Suspense fallback={<Loading />}><Integrations /></Suspense>} />
        <Route path="automation/triggers" element={<Suspense fallback={<Loading />}><Triggers /></Suspense>} />
        <Route path="automation/notifications" element={<Suspense fallback={<Loading />}><Notifications /></Suspense>} />
        <Route path="automation/approvals" element={<Suspense fallback={<Loading />}><Approvals /></Suspense>} />
        <Route path="automation/analytics" element={<Suspense fallback={<Loading />}><Analytics /></Suspense>} />
        <Route path="smart/eligibility" element={<Suspense fallback={<Loading />}><Eligibility /></Suspense>} />
        <Route path="smart/prediction" element={<Suspense fallback={<Loading />}><Prediction /></Suspense>} />
        <Route path="smart/recommendation" element={<Suspense fallback={<Loading />}><Recommendation /></Suspense>} />
        <Route path="smart/timeline" element={<Suspense fallback={<Loading />}><Timeline /></Suspense>} />
        <Route path="smart/budget" element={<Suspense fallback={<Loading />}><Budget /></Suspense>} />
        <Route path="smart/risk" element={<Suspense fallback={<Loading />}><Risk /></Suspense>} />
        <Route path="smart/competitor" element={<Suspense fallback={<Loading />}><Competitor /></Suspense>} />
        <Route path="smart/trends" element={<Suspense fallback={<Loading />}><Trends /></Suspense>} />
        <Route path="smart/pathway" element={<Suspense fallback={<Loading />}><Pathway /></Suspense>} />
        <Route path="smart/location" element={<Suspense fallback={<Loading />}><Location /></Suspense>} />
        <Route path="ml/anomaly" element={<Suspense fallback={<Loading />}><Anomaly /></Suspense>} />
        <Route path="ml/fraud" element={<Suspense fallback={<Loading />}><Fraud /></Suspense>} />
        <Route path="ml/sentiment" element={<Suspense fallback={<Loading />}><Sentiment /></Suspense>} />
        <Route path="ml/classification" element={<Suspense fallback={<Loading />}><Classification /></Suspense>} />
        <Route path="ml/extraction" element={<Suspense fallback={<Loading />}><Extraction /></Suspense>} />
        <Route path="ml/translation" element={<Suspense fallback={<Loading />}><MLTranslation /></Suspense>} />
        <Route path="ml/ocr" element={<Suspense fallback={<Loading />}><MLOCR /></Suspense>} />
        <Route path="ml/speech" element={<Suspense fallback={<Loading />}><Speech /></Suspense>} />
        <Route path="ml/vision" element={<Suspense fallback={<Loading />}><Vision /></Suspense>} />
        <Route path="ml/training" element={<Suspense fallback={<Loading />}><Training /></Suspense>} />
      </Route>
    </Routes>
  );
}
