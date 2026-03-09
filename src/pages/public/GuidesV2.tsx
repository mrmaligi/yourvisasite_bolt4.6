import { BookOpen, FileText, Video, Download, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicGuidesV2() {
  const guides = [
    { id: 1, title: 'Complete Partner Visa Guide', type: 'PDF', downloads: 1250, rating: 4.9, image: 'PG' },
    { id: 2, title: 'Skilled Migration Checklist', type: 'PDF', downloads: 890, rating: 4.8, image: 'SM' },
    { id: 3, title: 'Student Visa Webinar', type: 'Video', views: 2340, rating: 4.7, image: 'SV' },
    { id: 4, title: 'Document Templates Pack', type: 'ZIP', downloads: 2100, rating: 4.9, image: 'DT' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Free Guides & Resources</h1>
          <p className="text-xl text-slate-300">Download expert guides to help with your visa journey</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white border border-slate-200 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{guide.image}</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">{guide.type}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">{guide.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{guide.title}</h3>
                
                <p className="text-sm text-slate-500 mb-4">
                  {guide.downloads ? `${guide.downloads.toLocaleString()} downloads` : `${guide.views?.toLocaleString()} views`}
                </p>
                
                <Button variant="primary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Free
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
