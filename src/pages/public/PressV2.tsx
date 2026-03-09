import { Helmet } from 'react-helmet-async';
import { Download, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const PRESS_RELEASES = [
  { id: 1, title: 'VisaBuild Launches New Platform', date: 'Oct 01, 2024', category: 'Launch' },
  { id: 2, title: 'Partnership with Top Law Firms', date: 'Sep 15, 2024', category: 'Partnership' },
  { id: 3, title: 'Reaching 10,000 Successful Applications', date: 'Aug 28, 2024', category: 'Milestone' },
];

const RESOURCES = [
  { name: 'Brand Guidelines', size: '2.4 MB' },
  { name: 'Logo Pack', size: '5.1 MB' },
  { name: 'Founder Photos', size: '12.3 MB' },
];

export function PressV2() {
  return (
    <>
      <Helmet>
        <title>Press & Media | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <div className="bg-slate-100 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Newspaper className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Newsroom</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Latest updates, stories, and resources for media.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16">
          {/* Press Releases */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Press Releases</h2>
            <Button variant="outline">View Archive <ArrowRight className="ml-2 w-4 h-4" /></Button>
          </div>

          <div className="space-y-4 mb-16">
            {PRESS_RELEASES.map((item) => (
              <Link key={item.id} to="#" className="block">
                <div className="bg-white border border-slate-200 p-6 hover:border-blue-400 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">{item.category}</Badge>
                        <span className="text-sm text-slate-500">{item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Media Resources */}
          <div className="bg-white border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Media Resources</h2>
            
            <div className="space-y-3">
              {RESOURCES.map((resource) => (
                <div key={resource.name} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">{resource.name}</p>
                    <p className="text-sm text-slate-500">{resource.size}</p>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
