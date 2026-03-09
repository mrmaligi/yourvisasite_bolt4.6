import { Heart, Clock, Bookmark, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserFavoritesV2() {
  const favorites = [
    { id: 1, type: 'visa', title: 'Partner Visa (820/801)', subtitle: 'Family Stream', savedAt: '2024-03-20' },
    { id: 2, type: 'article', title: 'How to Prepare for Your Visa Interview', subtitle: 'Blog Article', savedAt: '2024-03-18' },
    { id: 3, type: 'guide', title: 'Document Checklist', subtitle: 'PDF Guide', savedAt: '2024-03-15' },
    { id: 4, type: 'lawyer', title: 'Jane Smith', subtitle: 'Partner Visa Specialist', savedAt: '2024-03-10' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'visa': return <div className="w-10 h-10 bg-blue-100 flex items-center justify-center"><span className="text-blue-600 font-bold">V</span></div>;
      case 'article': return <div className="w-10 h-10 bg-green-100 flex items-center justify-center"><span className="text-green-600 font-bold">A</span></div>;
      case 'guide': return <div className="w-10 h-10 bg-amber-100 flex items-center justify-center"><span className="text-amber-600 font-bold">G</span></div>;
      case 'lawyer': return <div className="w-10 h-10 bg-purple-100 flex items-center justify-center"><span className="text-purple-600 font-bold">L</span></div>;
      default: return <div className="w-10 h-10 bg-slate-100 flex items-center justify-center"><Bookmark className="w-5 h-5 text-slate-600" /></div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Favorites</h1>
          <p className="text-slate-600">Items you've bookmarked for later</p>
        </div>

        <div className="space-y-4">
          {favorites.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getIcon(item.type)}
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.subtitle} • Saved {item.savedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600"><ExternalLink className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-red-600"><Heart className="w-4 h-4 fill-current" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
