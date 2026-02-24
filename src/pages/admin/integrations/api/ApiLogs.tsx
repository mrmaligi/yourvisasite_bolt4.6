import { IntegrationsLayout } from '../IntegrationsLayout';

export function ApiLogs() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">API Logs</h2>
           <p className="text-neutral-500">Detailed request and response logs.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                 <div key={i} className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                          <span className="font-mono text-sm text-neutral-700 dark:text-neutral-300">/api/v1/users/me</span>
                       </div>
                       <span className="text-xs text-neutral-400">2023-10-25 14:30:{10 + i}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs text-neutral-500">
                       <div>Status: <span className="text-green-600">200 OK</span></div>
                       <div>Latency: {45 + i * 10}ms</div>
                       <div>IP: 192.168.1.{i}</div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
