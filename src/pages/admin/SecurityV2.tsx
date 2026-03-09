import { Shield, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminSecurityV2() {
  const audits = [
    { id: 1, event: 'Failed login attempt', user: 'john@example.com', ip: '192.168.1.100', severity: 'Low', time: '2 min ago' },
    { id: 2, event: 'Password changed', user: 'jane@example.com', ip: '192.168.1.101', severity: 'Info', time: '15 min ago' },
    { id: 3, event: 'Suspicious activity detected', user: 'admin@visabuild.com', ip: '10.0.0.50', severity: 'High', time: '1 hour ago' },
    { id: 4, event: 'API key regenerated', user: 'api@visabuild.com', ip: '172.16.0.20', severity: 'Medium', time: '2 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Security</h1>
          <p className="text-slate-400">Monitor security events and audit logs</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-6">
            <Shield className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-slate-600">Security Score</p>
            <p className="text-2xl font-bold text-slate-900">94/100</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <AlertTriangle className="w-6 h-6 text-amber-600 mb-2" />
            <p className="text-sm text-slate-600">Active Alerts</p>
            <p className="text-2xl font-bold text-slate-900">3</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6">
            <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm text-slate-600">Last Scan</p>
            <p className="text-2xl font-bold text-slate-900">2h ago</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Security Audit Log</h2>
          </div>
          
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Event</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">User</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">IP Address</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Severity</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {audits.map((audit) => (
                <tr key={audit.id}>
                  <td className="p-4">{audit.event}</td>
                  <td className="p-4">{audit.user}</td>
                  <td className="p-4 font-mono text-sm">{audit.ip}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      audit.severity === 'High' ? 'bg-red-100 text-red-700' :
                      audit.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      audit.severity === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{audit.severity}</span>
                  </td>
                  <td className="p-4">{audit.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
