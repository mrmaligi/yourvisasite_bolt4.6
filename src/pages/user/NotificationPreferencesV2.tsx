import { Bell, Mail, MessageSquare, CheckSquare, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

export function NotificationPreferencesV2() {
  const [settings, setSettings] = useState({
    emailUpdates: true,
    smsAlerts: false,
    marketingEmails: true,
    caseUpdates: true,
    appointmentReminders: true,
    newsletter: false,
  });

  const toggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Notification Preferences</h1>
          <p className="text-slate-400">Control how you receive notifications</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {[
              { key: 'emailUpdates', label: 'Email Updates', desc: 'Receive updates about your account via email', icon: Mail },
              { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Get important alerts via text message', icon: MessageSquare },
              { key: 'caseUpdates', label: 'Case Updates', desc: 'Notifications about your visa application status', icon: CheckSquare },
              { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Reminders for upcoming consultations', icon: Bell },
              { key: 'marketingEmails', label: 'Marketing Emails', desc: 'News, tips, and promotional offers', icon: Mail },
              { key: 'newsletter', label: 'Newsletter', desc: 'Weekly immigration news and updates', icon: Mail },
            ].map((item) => (
              <div key={item.key} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-slate-400" />
                  
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggle(item.key)}
                  className={`w-12 h-6 flex items-center ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 bg-white mx-0.5 transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
