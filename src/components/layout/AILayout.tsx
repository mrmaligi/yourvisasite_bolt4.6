import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Bot,
  FileText,
  GitBranch,
  Sparkles,
  Cpu,
  Menu,
  MessageSquare,
  History,
  Settings,
  Scan,
  FileCheck,
  Languages,
  FilePen,
  GitCommit,
  Bell,
  CheckCircle,
  BarChart,
  Lightbulb,
  Calendar,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Smile,
  Tags,
  Mic,
  Eye,
  Database,
  Layout
} from 'lucide-react';
import { AISidebar } from './AISidebar';
import { UserMenu } from '../layout/UserMenu'; // Fix path if needed, UserMenu is in components/layout/UserMenu.tsx
import { ThemeToggle } from '../ui/ThemeToggle';
import { Logo } from '../ui/Logo';
import { SearchTrigger } from '../ui/SearchTrigger';

const aiSidebarGroups = [
  {
    title: 'AI Assistant',
    items: [
      { to: '/ai/assistant/chat', label: 'Chat Assistant', icon: MessageSquare },
      { to: '/ai/assistant/visa-consult', label: 'Visa Consult', icon: Bot },
      { to: '/ai/assistant/legal-bot', label: 'Legal Bot', icon: ShieldCheck },
      { to: '/ai/assistant/interview-coach', label: 'Interview Coach', icon: Mic },
      { to: '/ai/assistant/translator', label: 'Translator', icon: Languages },
      { to: '/ai/assistant/summarizer', label: 'Summarizer', icon: FileText },
      { to: '/ai/assistant/email-writer', label: 'Email Writer', icon: FilePen },
      { to: '/ai/assistant/history', label: 'History', icon: History },
      { to: '/ai/assistant/feedback', label: 'Feedback', icon: Smile },
      { to: '/ai/assistant/settings', label: 'Settings', icon: Settings },
    ]
  },
  {
    title: 'Document AI',
    items: [
      { to: '/ai/documents/scanner', label: 'Scanner', icon: Scan },
      { to: '/ai/documents/ocr', label: 'OCR', icon: Eye },
      { to: '/ai/documents/classifier', label: 'Classifier', icon: Tags },
      { to: '/ai/documents/extractor', label: 'Extractor', icon: Database },
      { to: '/ai/documents/verifier', label: 'Verifier', icon: CheckCircle },
      { to: '/ai/documents/translator', label: 'Doc Translator', icon: Languages },
      { to: '/ai/documents/generator', label: 'Generator', icon: FilePen },
      { to: '/ai/documents/editor', label: 'Editor', icon: FileText },
      { to: '/ai/documents/comparison', label: 'Comparison', icon: GitBranch },
      { to: '/ai/documents/audit', label: 'Audit', icon: FileCheck },
    ]
  },
  {
    title: 'Automation',
    items: [
      { to: '/ai/automation/dashboard', label: 'Dashboard', icon: Layout },
      { to: '/ai/automation/builder', label: 'Builder', icon: GitCommit },
      { to: '/ai/automation/templates', label: 'Templates', icon: FileText },
      { to: '/ai/automation/active', label: 'Active', icon: TrendingUp },
      { to: '/ai/automation/logs', label: 'Logs', icon: History },
      { to: '/ai/automation/integrations', label: 'Integrations', icon: GitBranch },
      { to: '/ai/automation/triggers', label: 'Triggers', icon: Sparkles },
      { to: '/ai/automation/notifications', label: 'Notifications', icon: Bell },
      { to: '/ai/automation/approvals', label: 'Approvals', icon: CheckCircle },
      { to: '/ai/automation/analytics', label: 'Analytics', icon: BarChart },
    ]
  },
  {
    title: 'Smart Features',
    items: [
      { to: '/ai/smart/eligibility', label: 'Eligibility', icon: CheckCircle },
      { to: '/ai/smart/prediction', label: 'Prediction', icon: TrendingUp },
      { to: '/ai/smart/recommendation', label: 'Recommendations', icon: Lightbulb },
      { to: '/ai/smart/timeline', label: 'Timeline', icon: Calendar },
      { to: '/ai/smart/budget', label: 'Budget', icon: DollarSign },
      { to: '/ai/smart/risk', label: 'Risk Assessment', icon: AlertTriangle },
      { to: '/ai/smart/competitor', label: 'Comparison', icon: GitBranch },
      { to: '/ai/smart/trends', label: 'Trends', icon: TrendingUp },
      { to: '/ai/smart/pathway', label: 'Pathway', icon: MapPin },
      { to: '/ai/smart/location', label: 'Location', icon: MapPin },
    ]
  },
  {
    title: 'ML Tools',
    items: [
      { to: '/ai/ml/anomaly', label: 'Anomaly Detection', icon: AlertTriangle },
      { to: '/ai/ml/fraud', label: 'Fraud Check', icon: ShieldCheck },
      { to: '/ai/ml/sentiment', label: 'Sentiment', icon: Smile },
      { to: '/ai/ml/classification', label: 'Classification', icon: Tags },
      { to: '/ai/ml/extraction', label: 'Extraction', icon: Database },
      { to: '/ai/ml/translation', label: 'ML Translation', icon: Languages },
      { to: '/ai/ml/ocr', label: 'ML OCR', icon: Eye },
      { to: '/ai/ml/speech', label: 'Speech to Text', icon: Mic },
      { to: '/ai/ml/vision', label: 'Computer Vision', icon: Eye },
      { to: '/ai/ml/training', label: 'Model Training', icon: Cpu },
    ]
  }
];

export function AILayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 transition-colors">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <SearchTrigger variant="icon" />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>

      <div className="flex flex-1 relative">
        <AISidebar
          groups={aiSidebarGroups}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden pb-16 lg:pb-0">
          {/* Desktop Header Actions */}
          <header className="hidden lg:flex items-center justify-end px-8 py-4 bg-transparent gap-3">
             <SearchTrigger className="mr-2" />
             <ThemeToggle />
             <UserMenu />
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Optional: Add mobile nav if needed, but sidebar handles most */}
    </div>
  );
}
