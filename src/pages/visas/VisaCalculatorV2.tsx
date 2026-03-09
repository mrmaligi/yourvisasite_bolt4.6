import { Calculator, DollarSign, Clock, Info } from 'lucide-react';
import { useState } from 'react';

export function VisaCalculatorV2() {
  const [visaType, setVisaType] = useState('partner');
  const [applicants, setApplicants] = useState(1);

  const fees = {
    base: visaType === 'partner' ? 7850 : visaType === 'skilled' ? 4115 : 650,
    additional: (applicants - 1) * 2000,
  };

  const total = fees.base + fees.additional;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Visa Fee Calculator</h1>
          <p className="text-slate-400">Estimate your visa application costs</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white border border-slate-200 p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Visa Type</label>
              <select 
                value={visaType} 
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200"
              >
                <option value="partner">Partner Visa (820/801)</option>
                <option value="skilled">Skilled Independent (189)</option>
                <option value="student">Student Visa (500)</option>
                <option value="visitor">Visitor Visa (600)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Number of Applicants</label>
              <input 
                type="number" 
                min="1" 
                value={applicants}
                onChange={(e) => setApplicants(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-200"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">Fee Breakdown</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Base Application Fee</span>
                <span className="font-medium">${fees.base.toLocaleString()}</span>
              </div>
              
              {applicants > 1 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Additional Applicants</span>
                  <span className="font-medium">${fees.additional.toLocaleString()}</span>
                </div>
              )}
              
              <div className="border-t border-slate-200 pt-2 flex justify-between">
                <span className="font-semibold text-slate-900">Total Estimated Cost</span>
                <span className="font-bold text-xl text-blue-600">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-slate-500">
            <Info className="w-4 h-4 mt-0.5" />
            <p>This is an estimate only. Actual fees may vary based on individual circumstances.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
