import { Star, Trash2, ExternalLink, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserFavoritesV2() {
  const favorites = [
    { id: 1, title: 'Partner Visa Guide', type: 'Guide', date: 'Mar 20, 2024' },
    { id: 2, title: 'Document Checklist', type: 'Resource', date: 'Mar 18, 2024' },
    { id: 3, title: 'Immigration Lawyer Directory', type: 'Page', date: 'Mar 15, 2024' },
    { id: 4, title: 'Visa Fee Calculator', type: 'Tool', date: 'Mar 10, 2024' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Favorites</h1>
          <p className="text-slate-400">Your saved items</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {favorites.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                
                <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-400" />
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.type} • Saved {item.date}</p>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600"><ExternalLink className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
