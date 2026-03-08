import { Helmet } from 'react-helmet-async';
import { 
  BookOpen, 
  FileText, 
  CheckSquare, 
  Video, 
  Mic, 
  Calendar, 
  Users, 
  Newspaper, 
  Code,
  ChevronRight,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';

const categories = [
  { 
    name: 'Guides', 
    icon: BookOpen, 
    path: '/resources/guides', 
    description: 'Step-by-step immigration guides',
    count: '24 guides'
  },
  { 
    name: 'Checklists', 
    icon: CheckSquare, 
    path: '/resources/checklists', 
    description: 'Downloadable document checklists',
    count: '18 checklists'
  },
  { 
    name: 'Templates', 
    icon: FileText, 
    path: '/resources/templates', 
    description: 'Professional document templates',
    count: '35 templates'
  },
  { 
    name: 'Webinars', 
    icon: Video, 
    path: '/resources/webinars', 
    description: 'Expert video sessions',
    count: '42 videos'
  },
  { 
    name: 'Podcast', 
    icon: Mic, 
    path: '/resources/podcast', 
    description: 'Immigration insights on the go',
    count: '56 episodes'
  },
  { 
    name: 'Events', 
    icon: Calendar, 
    path: '/resources/events', 
    description: 'Community meetups and workshops',
    count: '12 upcoming'
  }
];

const featuredResources = [
  {
    title: 'Partner Visa Complete Guide',
    type: 'Guide',
    description: 'Everything you need to know about 820/801 and 309/100 visas',
    downloads: '2.4k'
  },
  {
    title: 'Document Checklist Template',
    type: 'Template',
    description: 'Organize your visa application documents efficiently',
    downloads: '1.8k'
  },
  {
    title: 'Skills Assessment Explained',
    type: 'Video',
    description: 'Understanding the skills assessment process for skilled visas',
    downloads: '956'
  }
];

export function ResourcesV2() {
  return (
    <>
      <Helmet>
        <title>Resources | VisaBuild</title>
        <meta name="description" content="Access our comprehensive library of immigration resources including guides, checklists, templates, and webinars." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero - SQUARE */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <Badge variant="primary" className="mb-4 bg-blue-600">Resource Hub</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Everything You Need</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Guides, templates, checklists, and more to help you navigate your visa journey.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Categories Grid - SQUARE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {categories.map((category, idx) => (
              <Link
                key={idx}
                to={category.path}
                className="bg-white border border-slate-200 p-6 hover:border-blue-400 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{category.name}</h3>
                <p className="text-slate-600 text-sm mb-3">{category.description}</p>
                
                <Badge variant="secondary" className="text-xs">{category.count}</Badge>
              </Link>
            ))}
          </div>

          {/* Featured Resources - SQUARE */}
          <div className="bg-white border border-slate-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Featured Resources</h2>
            
            <div className="space-y-4">
              {featuredResources.map((resource, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary" className="text-xs">{resource.type}</Badge>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {resource.downloads} downloads
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{resource.title}</h3>
                    <p className="text-slate-600 text-sm">{resource.description}</p>
                  </div>
                  
                  <button className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                    Access
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/partners" 
              className="bg-white border border-slate-200 p-4 flex items-center gap-3 hover:border-blue-400 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">Partners</div>
                <div className="text-sm text-slate-600">Trusted migration partners</div>
              </div>
            </Link>

            <Link 
              to="/press" 
              className="bg-white border border-slate-200 p-4 flex items-center gap-3 hover:border-blue-400 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">Press</div>
                <div className="text-sm text-slate-600">Media resources and news</div>
              </div>
            </Link>

            <Link 
              to="/api-docs" 
              className="bg-white border border-slate-200 p-4 flex items-center gap-3 hover:border-blue-400 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                <Code className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">API Docs</div>
                <div className="text-sm text-slate-600">Developer documentation</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
