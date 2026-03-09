import { FileText, CheckCircle, Clock, Download, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicPressV2() {
  const releases = [
    { id: 1, title: 'VisaBuild Raises $10M Series A Funding', date: 'March 15, 2024', excerpt: 'Investment will accelerate platform development and expand team...' },
    { id: 2, title: 'New Partnership with Leading Migration Law Firm', date: 'March 1, 2024', excerpt: 'Strategic alliance to provide comprehensive visa services...' },
    { id: 3, title: 'VisaBuild Launches Mobile App', date: 'February 20, 2024', excerpt: 'New iOS and Android apps bring visa services to mobile...' },
  ];

  const stats = [
    { label: 'Users Helped', value: '50,000+' },
    { label: 'Success Rate', value: '95%' },
    { label: 'Countries Served', value: '120+' },
    { label: 'Team Members', value: '150+' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Press & Media</h1>
          <p className="text-xl text-slate-300">News, press releases, and media resources</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-6 text-center">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-6">Press Releases</h2>
        
        <div className="space-y-4 mb-12">
          {releases.map((release) => (
            <div key={release.id} className="bg-white border border-slate-200 p-6">
              <span className="text-sm text-slate-500">{release.date}</span>
              <h3 className="font-semibold text-slate-900 text-lg mt-1 mb-2">{release.title}</h3>
              <p className="text-slate-600 mb-4">{release.excerpt}</p>
              <button className="text-blue-600 font-medium flex items-center gap-1 hover:underline">
                Read More
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Media Inquiries</h3>
          <p className="text-blue-700 mb-4">For press inquiries, please contact our media relations team.</p>
          <a href="mailto:press@visabuild.com" className="text-blue-600 font-medium hover:underline">press@visabuild.com</a>
        </div>
      </div>
    </div>
  );
}
