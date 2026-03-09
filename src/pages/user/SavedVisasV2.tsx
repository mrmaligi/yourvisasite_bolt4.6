import { Heart, FileText, Clock, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function SavedVisasV2() {
  const saved = [
    { id: 1, name: 'Partner Visa (820/801)', category: 'Family', savedAt: '2024-03-20', price: '$4,550' },
    { id: 2, name: 'Skilled Independent (189)', category: 'Skilled', savedAt: '2024-03-15', price: '$4,240' },
    { id: 3, name: 'Student Visa (500)', category: 'Student', savedAt: '2024-03-10', price: '$650' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Saved Visas</h1>
          <p className="text-slate-600">Your bookmarked visa types</p>
        </div>

        <div className="space-y-4">
          {saved.map((visa) => (
            <div key={visa.id} className="bg-white border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{visa.name}</p>
                    <p className="text-sm text-slate-500">{visa.category} • Saved on {visa.savedAt}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{visa.price}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
