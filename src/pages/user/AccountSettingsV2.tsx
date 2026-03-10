import { User, CreditCard, Bell, Shield, ChevronRight } from 'lucide-react';

export function AccountSettingsV2() {
  const sections = [
    { name: 'Profile Information', icon: User, description: 'Update your personal details' },
    { name: 'Payment Methods', icon: CreditCard, description: 'Manage your cards and billing' },
    { name: 'Notifications', icon: Bell, description: 'Control how you receive updates' },
    { name: 'Security', icon: Shield, description: 'Password and 2FA settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          <p className="text-slate-400">Manage your account preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200">
          <div className="divide-y divide-slate-200">
            {sections.map((section) => (
              <button key={section.name} className="w-full p-6 flex items-center justify-between hover:bg-slate-50 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <p className="font-semibold text-slate-900">{section.name}</p>
                    <p className="text-sm text-slate-500">{section.description}</p>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
