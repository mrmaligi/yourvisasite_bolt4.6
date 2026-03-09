import { Scale, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function VisaComparisonV2() {
  const visas = [
    { name: 'Partner Visa', subclass: '820/801', processing: '12-18 months', cost: '$7,850', work: true, medicare: true },
    { name: 'Skilled Independent', subclass: '189', processing: '8-12 months', cost: '$4,115', work: true, medicare: true },
    { name: 'Student Visa', subclass: '500', processing: '1-3 months', cost: '$650', work: 'Limited', medicare: false },
    { name: 'Visitor Visa', subclass: '600', processing: '1-4 weeks', cost: '$150', work: false, medicare: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Compare Visas</h1>
          <p className="text-slate-400">Compare different visa options side by side</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="bg-white border border-slate-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Feature</th>
                {visas.map((visa) => (
                  <th key={visa.subclass} className="text-center p-4 text-sm font-medium text-slate-900">
                    <div>{visa.name}</div>
                    <div className="text-xs text-slate-500">{visa.subclass}</div>
                  </th>
                ))}
              </tr>
            </thead>            
            <tbody className="divide-y divide-slate-200">              
              <tr>
                <td className="p-4 text-slate-600">Processing Time</td>
                {visas.map((visa) => (
                  <td key={visa.subclass} className="p-4 text-center">{visa.processing}</td>
                ))}
              </tr>              
              <tr>
                <td className="p-4 text-slate-600">Cost (AUD)</td>
                {visas.map((visa) => (
                  <td key={visa.subclass} className="p-4 text-center font-medium">{visa.cost}</td>
                ))}
              </tr>              
              <tr>
                <td className="p-4 text-slate-600">Work Rights</td>
                {visas.map((visa) => (
                  <td key={visa.subclass} className="p-4 text-center">
                    {visa.work === true ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> :
                     visa.work === false ? <XCircle className="w-5 h-5 text-red-500 mx-auto" /> :
                     <span className="text-sm">{visa.work}</span>}
                  </td>
                ))}
              </tr>              
              <tr>
                <td className="p-4 text-slate-600">Medicare</td>
                {visas.map((visa) => (
                  <td key={visa.subclass} className="p-4 text-center">
                    {visa.medicare ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> :
                     <XCircle className="w-5 h-5 text-red-500 mx-auto" />}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
