import { Search, Clock, X } from 'lucide-react';

export function UserSearchHistoryV2() {
  const history = [
    { id: 1, query: 'partner visa requirements', date: 'Mar 20, 2024', time: '10:30 AM' },
    { id: 2, query: 'skilled migration 189', date: 'Mar 18, 2024', time: '2:15 PM' },
    { id: 3, query: 'document checklist', date: 'Mar 15, 2024', time: '9:00 AM' },
    { id: 4, query: 'visa fees 2024', date: 'Mar 10, 2024', time: '4:45 PM' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Search History</h1>
          <p className="text-slate-400">Your recent searches</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {history.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <Search className="w-5 h-5 text-slate-400" />
                
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{item.query}</p>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="w-3 h-3" /> {item.date} at {item.time}
                  </div>
                </div>
                
                <button className="p-2 text-slate-400 hover:text-red-600"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
