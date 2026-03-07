import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  FileText, 
  Video, 
  Phone,
  ChevronRight,
  HelpCircle,
  Mail,
  ExternalLink
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: number;
  popular: boolean;
}

const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of using VisaBuild',
    icon: <BookOpen className="w-6 h-6" />,
    articles: 12,
    popular: true
  },
  {
    id: 'visa-guides',
    title: 'Visa Guides',
    description: 'Detailed guides for all visa types',
    icon: <FileText className="w-6 h-6" />,
    articles: 48,
    popular: true
  },
  {
    id: 'account',
    title: 'Account & Billing',
    description: 'Manage your account and payments',
    icon: <HelpCircle className="w-6 h-6" />,
    articles: 8,
    popular: false
  },
  {
    id: 'consultations',
    title: 'Lawyer Consultations',
    description: 'How to book and manage consultations',
    icon: <MessageCircle className="w-6 h-6" />,
    articles: 6,
    popular: true
  }
];

const popularArticles = [
  { title: 'How to choose the right visa', category: 'Visa Guides', views: '12.5k' },
  { title: 'Document checklist for Partner Visa', category: 'Visa Guides', views: '8.2k' },
  { title: 'Processing times explained', category: 'Getting Started', views: '6.8k' },
  { title: 'How to book a consultation', category: 'Consultations', views: '5.4k' }
];

const quickLinks = [
  { title: 'Video Tutorials', icon: <Video className="w-4 h-4" />, url: '/resources/webinars' },
  { title: 'Contact Support', icon: <Mail className="w-4 h-4" />, url: '/contact' },
  { title: 'Schedule a Call', icon: <Phone className="w-4 h-4" />, url: '/booking' }
];

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Simulate search results
      setSearchResults([
        'How to track your visa application',
        'Understanding visa requirements',
        'Document upload guidelines'
      ]);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <>
      <Helmet>
        <title>Help Center | VisaBuild</title>
        <meta name="description" content="Get help with VisaBuild. Browse articles, guides, and FAQs about Australian visas and immigration." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                How can we help you?
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                Search our knowledge base or browse categories to find answers to your questions
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for articles, guides, or FAQs..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
                      >
                        <Search className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 dark:text-slate-200">{result}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {quickLinks.map((link) => (
                  <a
                    key={link.title}
                    href={link.url}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                  >
                    {link.icon}
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Browse by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpCategories.map((category) => (
              <Card 
                key={category.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
              >
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {category.title}
                        </h3>
                        {category.popular && (
                          <Badge variant="primary" className="text-xs">Popular</Badge>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {category.articles} articles
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              Popular Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularArticles.map((article, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                >
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {article.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-sm">{article.views} views</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Still need help?
                </h2>
                <p className="text-blue-100">
                  Our support team is available Monday to Friday, 9am - 6pm AEST
                </p>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="secondary" 
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button 
                  className="bg-blue-700 text-white hover:bg-blue-800 border border-blue-500"
                  onClick={() => window.location.href = '/booking'}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Book a Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
