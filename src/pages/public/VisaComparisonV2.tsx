import { CheckCircle, XCircle, ArrowRight, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicVisaComparisonV2() {
  const visas = [
    { name: 'Partner Visa (820)', processing: '18-24 months', cost: '$8,085', workRights: true, medicare: true },
    { name: 'Skilled Independent (189)', processing: '8-12 months', cost: '$4,240', workRights: true, medicare: true },
    { name: 'Student Visa (500)', processing: '1-3 months', cost: '$650', workRights: 'Limited', medicare: false },
    { name: 'Working Holiday (417)', processing: '2-4 weeks', cost: '$510', workRights: 'Limited', medicare: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Visa Comparison</h1>
          <p className="text-xl text-slate-300">Compare visa options side by side</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="bg-white border border-slate-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-900">Feature</th>
                {visas.map((visa) => (
                  <th key={visa.name} className="text-left p-4 font-semibold text-slate-900">{visa.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-4 text-slate-700">Processing Time</td>
                {visas.map((visa) => (
                  <td key={visa.name} className="p-4 text-slate-900">{visa.processing}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-700">Cost (AUD)</td>
                {visas.map((visa) => (
                  <td key={visa.name} className="p-4 text-slate-900 font-semibold">{visa.cost}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-700">Work Rights</td>
                {visas.map((visa) => (
                  <td key={visa.name} className="p-4">
                    {visa.workRights === true ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : visa.workRights === false ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <span className="text-amber-600">{visa.workRights}</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-slate-700">Medicare Access</td>
                {visas.map((visa) => (
                  <td key={visa.name} className="p-4">
                    {visa.medicare ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4"></td>
                {visas.map((visa) => (
                  <td key={visa.name} className="p-4">
                    <Button variant="primary" size="sm">
                      Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
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
