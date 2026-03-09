import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Plus, Briefcase } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const ALL_SPECIALIZATIONS = [
  'Skilled Migration',
  'Partner Visas',
  'Student Visas',
  'Employer Sponsored',
  'Citizenship',
  'Business Visas',
  'Refugee & Humanitarian',
  'Appeals & Tribunals',
  'Visitor Visas',
  'Family Visas',
];

export function SpecializationsV2() {
  const [selected, setSelected] = useState<string[]>([
    'Skilled Migration',
    'Partner Visas',
    'Employer Sponsored',
  ]);

  const toggleSpecialization = (spec: string) => {
    setSelected(prev => 
      prev.includes(spec) 
        ? prev.filter(s => s !== spec)
        : [...prev, spec]
    );
  };

  return (
    <>
      <Helmet>
        <title>Specializations | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Specializations</h1>
                <p className="text-slate-600">Select your areas of expertise</p>
              </div>
              <Button variant="primary">
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{selected.length}</p>
                <p className="text-sm text-slate-600">Selected Specializations</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Specializations</h2>

            <div className="grid md:grid-cols-2 gap-3">
              {ALL_SPECIALIZATIONS.map((spec) => {
                const isSelected = selected.includes(spec);
                return (
                  <button
                    key={spec}
                    onClick={() => toggleSpecialization(spec)}
                    className={`flex items-center justify-between p-4 border text-left transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-500' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                      {spec}
                    </span>
                    
                    {isSelected ? (
                      <Badge variant="success">Selected</Badge>
                    ) : (
                      <Plus className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
