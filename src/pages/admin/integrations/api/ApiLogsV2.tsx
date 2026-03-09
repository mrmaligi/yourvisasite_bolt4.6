import { Activity, CheckCircle, AlertCircle } from 'lucide-react';

export function ApiLogsV2() {
  const logs = [
    { id: 1, endpoint: '/api/visas', method: 'GET', status: 200, time: '45ms', timestamp: '2024-03-20 10:30:15' },
    { id: 2, endpoint: '/api/users', method: 'POST', status: 201, time: '120ms', timestamp: '2024-03-20 10:28:42' },
    { id: 3, endpoint: '/api/applications', method: 'GET', status: 500, time: '234ms', timestamp: '2024-03-20 10:25:18' },
    { id: 4, endpoint: '/api/consultations', method: 'PUT', status: 200, time: '89ms', timestamp: '2024-03-20 10:22:05' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">API Logs</h1>
          <p className="text-slate-600">Monitor API activity</p>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Timestamp</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Method</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Endpoint</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 text-slate-600">{log.timestamp}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium ${
                        log.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                        log.method === 'POST' ? 'bg-green-100 text-green-700' :
                        log.method === 'PUT' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">{log.endpoint}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {log.status < 400 ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                        <span className={log.status < 400 ? 'text-green-600' : 'text-red-600'}>{log.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-700">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
