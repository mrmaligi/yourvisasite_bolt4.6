import { FileText, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminAuditLogV2() {
  const logs = [
    { id: 1, action: 'User login', user: 'john@example.com', ip: '192.168.1.100', time: '2 min ago', severity: 'info' },
    { id: 2, action: 'Document deleted', user: 'jane@example.com', ip: '192.168.1.101', time: '15 min ago', severity: 'warning' },
    { id: 3, action: 'Password changed', user: 'admin@visabuild.com', ip: '10.0.0.50', time: '1 hour ago', severity: 'info' },
    { id: 4, action: 'Settings updated', user: 'bob@example.com', ip: '172.16.0.20', time: '2 hours ago', severity: 'info' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Audit Log</h1>
            <p className="text-slate-400">System activity and changes</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Action</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">User</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">IP Address</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Time</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="p-4">{log.action}</td>
                  <td className="p-4">{log.user}</td>
                  <td className="p-4 font-mono text-sm">{log.ip}</td>
                  <td className="p-4">{log.time}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium ${
                      log.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
