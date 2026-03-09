import { CheckCircle, XCircle, HelpCircle, ArrowRight, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicChecklistsV2() {
  const checklists = [
    { name: 'Partner Visa 820', items: 24, completed: 0 },
    { name: 'Skilled Independent 189', items: 18, completed: 0 },
    { name: 'Student Visa 500', items: 12, completed: 0 },
    { name: 'Visitor Visa 600', items: 8, completed: 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Visa Checklists</h1>
          <p className="text-xl text-slate-300">Stay organized with our comprehensive checklists</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {checklists.map((list) => (
            <div key={list.name} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{list.name}</h3>
                  <p className="text-slate-500">{list.items} items</p>
                  
                  <div className="mt-4">
                    <div className="h-2 bg-slate-100">
                      <div className="h-2 bg-green-500" style={{ width: '0%' }} />
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="mt-4">
                    View Checklist
                    <ArrowRight className="w-4 h-4 ml-1" />
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
