import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Visa {
  id: string;
  subclass: string;
  name: string;
  category: string;
  processingTime: string;
  cost: number;
  requirements: string[];
}

const MOCK_VISAS: Visa[] = [
  { 
    id: '1', 
    subclass: '820', 
    name: 'Partner Visa', 
    category: 'Family',
    processingTime: '18-24 months',
    cost: 7850,
    requirements: ['Relationship proof', 'Health check', 'Character check']
  },
  { 
    id: '2', 
    subclass: '189', 
    name: 'Skilled Independent', 
    category: 'Work',
    processingTime: '8-12 months',
    cost: 4640,
    requirements: ['Skills assessment', 'Points test', 'English test']
  },
];

export function VisaComparisonV2() {
  const [searchParams] = useSearchParams();
  const [visas] = useState<Visa[]>(MOCK_VISAS);

  if (visas.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-slate-900">No visas selected</h2>
          <p className="text-slate-600 mb-8">Please select at least two visas to compare.</p>
          <Button variant="primary">Browse Visas</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Compare Visas | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/visas" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Visas
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mb-8">Compare Visas</h1>

          <div className="bg-white border border-slate-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-slate-600">Feature</th>
                  {visas.map((visa) => (
                    <th key={visa.id} className="text-left px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{visa.name}</p>
                        <Badge variant="primary">Subclass {visa.subclass}</Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-700">Category</td>
                  {visas.map((visa) => (
                    <td key={visa.id} className="px-6 py-4 text-slate-600">{visa.category}</td>
                  ))}
                </tr>
                
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-700">Processing Time</td>
                  {visas.map((visa) => (
                    <td key={visa.id} className="px-6 py-4 text-slate-600">{visa.processingTime}</td>
                  ))}
                </tr>
                
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-700">Cost (AUD)</td>
                  {visas.map((visa) => (
                    <td key={visa.id} className="px-6 py-4 text-slate-900 font-semibold">
                      ${visa.cost.toLocaleString()}
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-700 align-top">Requirements</td>
                  {visas.map((visa) => (
                    <td key={visa.id} className="px-6 py-4">
                      <ul className="space-y-2">
                        {visa.requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-600">
                            <Check className="w-4 h-4 text-green-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="px-6 py-4"></td>
                  {visas.map((visa) => (
                    <td key={visa.id} className="px-6 py-4">
                      <Button variant="primary" size="sm">
                        View Details
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
