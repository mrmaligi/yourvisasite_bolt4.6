import { UserX, Ban, AlertTriangle, MessageSquare, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserBlockedV2() {
  const blocked = [
    { id: 1, name: 'Spam User 123', type: 'User', blockedAt: '2024-03-20', reason: 'Spam messages' },
    { id: 2, name: 'Fake Lawyer', type: 'Lawyer', blockedAt: '2024-03-15', reason: 'Suspicious activity' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Blocked Users</h1>
          <p className="text-slate-600">Manage users you've blocked</p>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Blocked List</h2>
          </div>
          
          {blocked.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {blocked.map((user) => (
                <div key={user.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                        <Ban className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.type} • Blocked on {user.blockedAt}</p>
                        <p className="text-xs text-slate-400">Reason: {user.reason}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Unblock</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <UserX className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">You haven't blocked any users</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
