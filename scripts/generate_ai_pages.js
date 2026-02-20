import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', 'src');

const pages = [
  // AI Assistant
  { category: 'assistant', name: 'Chat', path: 'chat', title: 'AI Chat Assistant', description: 'Your personal immigration assistant ready to answer your questions.' },
  { category: 'assistant', name: 'VisaConsult', path: 'visa-consult', title: 'Visa Consultation Bot', description: 'Get preliminary advice on visa options based on your profile.' },
  { category: 'assistant', name: 'LegalBot', path: 'legal-bot', title: 'Legal Document Assistant', description: 'Drafting and reviewing legal documents made easy.' },
  { category: 'assistant', name: 'InterviewCoach', path: 'interview-coach', title: 'Interview Coach', description: 'Practice for your visa interview with our AI coach.' },
  { category: 'assistant', name: 'Translator', path: 'translator', title: 'Real-time Translator', description: 'Translate documents and conversations instantly.' },
  { category: 'assistant', name: 'Summarizer', path: 'summarizer', title: 'Document Summarizer', description: 'Get quick summaries of complex immigration documents.' },
  { category: 'assistant', name: 'EmailWriter', path: 'email-writer', title: 'Email Drafter', description: 'Draft professional emails to authorities or lawyers.' },
  { category: 'assistant', name: 'History', path: 'history', title: 'Conversation History', description: 'View and manage your past interactions with the AI.' },
  { category: 'assistant', name: 'Feedback', path: 'feedback', title: 'Feedback & Improvements', description: 'Help us improve the AI by providing feedback.' },
  { category: 'assistant', name: 'AssistantSettings', path: 'settings', title: 'Assistant Settings', description: 'Customize your AI assistant preferences.' },

  // Document AI
  { category: 'documents', name: 'Scanner', path: 'scanner', title: 'Document Scanner', description: 'Scan and digitize your physical documents.' },
  { category: 'documents', name: 'OCR', path: 'ocr', title: 'Optical Character Recognition', description: 'Extract text from images and PDFs.' },
  { category: 'documents', name: 'Classifier', path: 'classifier', title: 'Document Classifier', description: 'Automatically categorize your uploaded documents.' },
  { category: 'documents', name: 'Extractor', path: 'extractor', title: 'Data Extractor', description: 'Extract key information from forms and documents.' },
  { category: 'documents', name: 'Verifier', path: 'verifier', title: 'Authenticity Verifier', description: 'Verify the authenticity of your documents.' },
  { category: 'documents', name: 'DocTranslator', path: 'translator', title: 'Document Translator', description: 'Translate entire documents while preserving formatting.' },
  { category: 'documents', name: 'Generator', path: 'generator', title: 'Document Generator', description: 'Generate cover letters and other required documents.' },
  { category: 'documents', name: 'Editor', path: 'editor', title: 'Smart Document Editor', description: 'Edit your documents with AI assistance.' },
  { category: 'documents', name: 'Comparison', path: 'comparison', title: 'Version Comparison', description: 'Compare different versions of your documents.' },
  { category: 'documents', name: 'Audit', path: 'audit', title: 'Document Audit Trail', description: 'Track changes and access history of your documents.' },

  // Automation Workflows
  { category: 'automation', name: 'Dashboard', path: 'dashboard', title: 'Workflow Dashboard', description: 'Overview of your automation workflows.' },
  { category: 'automation', name: 'Builder', path: 'builder', title: 'Workflow Builder', description: 'Create custom automation workflows visually.' },
  { category: 'automation', name: 'Templates', path: 'templates', title: 'Automation Templates', description: 'Pre-built templates for common immigration tasks.' },
  { category: 'automation', name: 'Active', path: 'active', title: 'Active Workflows', description: 'Monitor currently running automation processes.' },
  { category: 'automation', name: 'Logs', path: 'logs', title: 'Execution Logs', description: 'View detailed logs of workflow executions.' },
  { category: 'automation', name: 'Integrations', path: 'integrations', title: 'App Integrations', description: 'Connect with external tools and services.' },
  { category: 'automation', name: 'Triggers', path: 'triggers', title: 'Event Triggers', description: 'Configure triggers to start your workflows.' },
  { category: 'automation', name: 'Notifications', path: 'notifications', title: 'Notification Rules', description: 'Set up custom notification alerts.' },
  { category: 'automation', name: 'Approvals', path: 'approvals', title: 'Approval Queues', description: 'Manage tasks requiring manual approval.' },
  { category: 'automation', name: 'Analytics', path: 'analytics', title: 'Workflow Analytics', description: 'Analyze the efficiency of your automations.' },

  // Smart Features
  { category: 'smart', name: 'Eligibility', path: 'eligibility', title: 'Smart Eligibility Check', description: 'Advanced AI assessment of your visa eligibility.' },
  { category: 'smart', name: 'Prediction', path: 'prediction', title: 'Success Prediction', description: 'Predict your chances of visa approval.' },
  { category: 'smart', name: 'Recommendation', path: 'recommendation', title: 'Visa Recommendations', description: 'Get personalized visa recommendations.' },
  { category: 'smart', name: 'Timeline', path: 'timeline', title: 'Timeline Predictor', description: 'Estimate your application processing timeline.' },
  { category: 'smart', name: 'Budget', path: 'budget', title: 'Smart Budgeting', description: 'Estimate the total cost of your immigration journey.' },
  { category: 'smart', name: 'Risk', path: 'risk', title: 'Risk Assessment', description: 'Identify potential risks in your application.' },
  { category: 'smart', name: 'Competitor', path: 'competitor', title: 'Global Comparison', description: 'Compare visa options across different countries.' },
  { category: 'smart', name: 'Trends', path: 'trends', title: 'Immigration Trends', description: 'Stay updated with the latest immigration trends.' },
  { category: 'smart', name: 'Pathway', path: 'pathway', title: 'Career Pathway', description: 'Plan your career path in your destination country.' },
  { category: 'smart', name: 'Location', path: 'location', title: 'Location Recommender', description: 'Find the best city for you based on your profile.' },

  // ML Tools
  { category: 'ml', name: 'Anomaly', path: 'anomaly', title: 'Anomaly Detection', description: 'Detect unusual patterns in your data.' },
  { category: 'ml', name: 'Fraud', path: 'fraud', title: 'Fraud Check', description: 'Screen for potential fraud indicators.' },
  { category: 'ml', name: 'Sentiment', path: 'sentiment', title: 'Sentiment Analysis', description: 'Analyze sentiment in reviews and feedback.' },
  { category: 'ml', name: 'Classification', path: 'classification', title: 'ML Classification', description: 'Demo of our machine learning classification models.' },
  { category: 'ml', name: 'Extraction', path: 'extraction', title: 'Entity Extraction', description: 'Extract named entities from text using ML.' },
  { category: 'ml', name: 'MLTranslation', path: 'translation', title: 'Neural Translation', description: 'Advanced neural machine translation tools.' },
  { category: 'ml', name: 'MLOCR', path: 'ocr', title: 'Advanced OCR', description: 'High-precision optical character recognition.' },
  { category: 'ml', name: 'Speech', path: 'speech', title: 'Speech to Text', description: 'Convert spoken language into text.' },
  { category: 'ml', name: 'Vision', path: 'vision', title: 'Computer Vision', description: 'Image analysis and object detection.' },
  { category: 'ml', name: 'Training', path: 'training', title: 'Model Training', description: 'Train custom machine learning models.' },
];

async function generate() {
  console.log('Generating AI pages...');

  // Create base directory
  const aiPagesDir = path.join(rootDir, 'pages', 'ai');
  if (!fs.existsSync(aiPagesDir)) {
    fs.mkdirSync(aiPagesDir, { recursive: true });
  }

  // Generate pages
  for (const page of pages) {
    const categoryDir = path.join(aiPagesDir, page.category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const componentContent = `import { AIPageContainer } from '../../../components/ai/AIPageContainer';

export function ${page.name}() {
  return (
    <AIPageContainer
      title="${page.title}"
      description="${page.description}"
    />
  );
}
`;
    fs.writeFileSync(path.join(categoryDir, `${page.name}.tsx`), componentContent);
    console.log(`Created ${page.category}/${page.name}.tsx`);
  }

  // Generate AIRoutes.tsx
  let routesContent = `import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loading } from '../../components/ui/Loading';
import { AILayout } from '../../components/layout/AILayout';

// Lazy load all AI pages
`;

  pages.forEach(page => {
    routesContent += `const ${page.name} = lazy(() => import('./${page.category}/${page.name}').then(m => ({ default: m.${page.name} })));\n`;
  });

  routesContent += `
export function AIRoutes() {
  return (
    <Routes>
      <Route element={<AILayout />}>
        <Route index element={<Navigate to="assistant/chat" replace />} />
`;

  pages.forEach(page => {
    routesContent += `        <Route path="${page.category}/${page.path}" element={<Suspense fallback={<Loading />}><${page.name} /></Suspense>} />\n`;
  });

  routesContent += `      </Route>
    </Routes>
  );
}
`;

  fs.writeFileSync(path.join(aiPagesDir, 'AIRoutes.tsx'), routesContent);
  console.log('Created AIRoutes.tsx');
}

generate().catch(console.error);
