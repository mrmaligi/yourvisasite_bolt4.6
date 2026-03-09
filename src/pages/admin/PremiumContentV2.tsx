import { FileText, Upload, Plus, Search, MoreVertical } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PremiumContentV2() {
  const content = [
    { id: 1, title: 'Partner Visa Complete Guide', type: 'PDF', size: '4.2 MB', downloads: 1250, price: '$49' },
    { id: 2, title: 'Document Checklist Bundle', type: 'ZIP', size: '2.1 MB', downloads: 890, price: '$29' },
    { id: 3, title: 'Interview Preparation Video', type: 'MP4', size: '156 MB', downloads: 567, price: '$39' },
    { id: 4, title: 'Sponsorship Letter Templates', type: 'DOCX', size: '1.8 MB', downloads: 2100, price: '$19' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <div className="w-10 h-10 bg-red-100 flex items-center justify-center"><span className="text-xs font-bold text-red-600">PDF</span></div>;
      case 'ZIP': return <div className="w-10 h-10 bg-amber-100 flex items-center justify-center"><span className="text-xs font-bold text-amber-600">ZIP</span></div>;
      case 'MP4': return <div className="w-10 h-10 bg-purple-100 flex items-center justify-center"><span className="text-xs font-bold text-purple-600">MP4</span></div>;
      default: return <div className="w-10 h-10 bg-blue-100 flex items-center justify-center"><span className="text-xs font-bold text-blue-600">DOC</span></div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Premium Content</h1>
            <p className="text-slate-600">Manage premium downloadable content</p>
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Items', value: '24' },
            { label: 'Total Downloads', value: '8,450' },
            { label: 'Revenue', value: '$12,400' },
            { label: 'Avg. Price', value: '$32' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-4">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {content.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getIcon(item.type)}
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.type} • {item.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{item.price}</p>
                    <p className="text-sm text-slate-500">{item.downloads} downloads</p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
