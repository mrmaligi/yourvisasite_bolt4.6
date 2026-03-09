import { Search, Clock, X, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserSearchHistoryV2() {
  const searches = [
    { id: 1, query: 'partner visa requirements', date: '2024-03-20', results: 156 },
    { id: 2, query: 'skilled migration points calculator', date: '2024-03-19', results: 42 },
    { id: 3, query: 'document checklist 820 visa', date: '2024-03-18', results: 23 },
    { id: 4, query: 'processing times 2024', date: '2024-03-17', results: 89 },
    { id: 5, query: 'best immigration lawyers sydney', date: '2024-03-16', results: 34 },
  ];

  const trending = [
    'Partner visa processing time',
    'Skills assessment',
    'English test requirements',
    'Health examination',
    'Police clearance',
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Search History</h1>
              <p className="text-slate-600">Your recent searches on VisaBuild</p>
            </div>

            <div className="bg-white border border-slate-200">
              <div className="divide-y divide-slate-200">
                {searches.map((search) => (
                  <div key={search.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">{search.query}</p>
                        <p className="text-sm text-slate-500">{search.results} results • {search.date}</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-slate-900">Trending Searches</h2>
              </div>
              <div className="space-y-2">
                {trending.map((term, i) => (
                  <button key={i} className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    {i + 1}. {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
