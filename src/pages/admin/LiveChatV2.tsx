import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Users, Clock, Settings } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function LiveChatV2() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <>
      <Helmet>
        <title>Live Chat | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Live Chat</h1>
                <p className="text-slate-600">Real-time customer support</p>
              </div>
              <Button
                variant={isEnabled ? 'danger' : 'primary'}
                onClick={() => setIsEnabled(!isEnabled)}
              >
                {isEnabled ? 'Disable Chat' : 'Enable Chat'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Active Chats', value: '12', icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
              { label: 'Queue', value: '3', icon: Users, color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Avg Response', value: '2m', icon: Clock, color: 'bg-green-100 text-green-600' },
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

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">Active Conversations</h2>
              </div>
              
              <div className="divide-y divide-slate-200">
                {[
                  { name: 'John Smith', message: 'Question about Partner Visa', time: '2m ago', status: 'active' },
                  { name: 'Sarah Lee', message: 'Document upload issue', time: '5m ago', status: 'waiting' },
                  { name: 'Mike Chen', message: 'Consultation booking', time: '12m ago', status: 'closed' },
                ].map((chat, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{chat.name}</p>
                        <p className="text-sm text-slate-600">{chat.message}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={chat.status === 'active' ? 'success' : chat.status === 'waiting' ? 'warning' : 'secondary'}>
                          {chat.status}
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">{chat.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-slate-400" />
                <h2 className="font-semibold text-slate-900">Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Auto-assign</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Sound alerts</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Desktop notifications</span>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
