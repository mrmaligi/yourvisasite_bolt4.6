import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface TrackerEntry {
  id: string;
  visa: string;
  subclass: string;
  outcome: 'approved' | 'refused' | 'withdrawn' | 'pending';
  processingDays: number;
  applicationDate: string;
}

const MOCK_ENTRIES: TrackerEntry[] = [
  { id: '1', visa: 'Partner Visa', subclass: '820', outcome: 'approved', processingDays: 180, applicationDate: '2023-09-15' },
  { id: '2', visa: 'Skilled Independent', subclass: '189', outcome: 'pending', processingDays: 90, applicationDate: '2024-01-10' },
  { id: '3', visa: 'Student Visa', subclass: '500', outcome: 'approved', processingDays: 45, applicationDate: '2023-11-20' },
];

export function LawyerTrackerV2() {
  const [entries] = useState<TrackerEntry[]>(MOCK_ENTRIES);

  const stats = {
    total: entries.length,
    approved: entries.filter(e => e.outcome === 'approved').length,
    pending: entries.filter(e => e.outcome === 'pending').length,
    refused: entries.filter(e => e.outcome === 'refused').length,
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'refused': return <Badge variant="danger">Refused</Badge>;
      default: return <Badge variant="secondary">{outcome}</Badge>;
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'refused': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <TrendingUp className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>My Tracker | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Tracker</h1>
                <p className="text-slate-600">Track your client visa applications</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
              { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Refused', value: stats.refused, icon: XCircle, color: 'bg-red-100 text-red-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Visa</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Outcome</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Processing Days</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getOutcomeIcon(entry.outcome)}
                          <div>
                            <p className="font-medium text-slate-900">{entry.visa}</p>
                            <p className="text-sm text-slate-500">Subclass {entry.subclass}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getOutcomeBadge(entry.outcome)}</td>
                      <td className="px-6 py-4 text-slate-700">{entry.processingDays} days</td>
                      <td className="px-6 py-4 text-slate-600">{entry.applicationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
