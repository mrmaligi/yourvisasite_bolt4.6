import { History, RotateCcw, Clock, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserHistoryV2() {
  const history = [
    { id: 1, action: 'Viewed Partner Visa Guide', type: 'page', date: '2024-03-20 10:30 AM' },
    { id: 2, action: 'Downloaded Document Checklist', type: 'download', date: '2024-03-19 2:15 PM' },
    { id: 3, action: 'Updated Profile Information', type: 'update', date: '2024-03-18 9:00 AM' },
    { id: 4, action: 'Searched for Student Visa', type: 'search', date: '2024-03-17 4:30 PM' },
    { id: 5, action: 'Viewed Lawyer Profile', type: 'page', date: '2024-03-16 11:45 AM' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'download': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'update': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'search': return <History className="w-5 h-5 text-amber-600" />;
      default: return <Clock className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Browsing History</h1>
            <p className="text-slate-600">Your recent activity on VisaBuild</p>
          </div>
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {history.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{item.action}</p>
                </div>
                <span className="text-sm text-slate-500">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
