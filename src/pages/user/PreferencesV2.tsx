import { Globe, MapPin, Clock, DollarSign } from 'lucide-react';
import { useState } from 'react';

export function UserPreferencesV2() {
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'Australia/Sydney',
    currency: 'AUD',
    dateFormat: 'DD/MM/YYYY',
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Preferences</h1>
          <p className="text-slate-400">Customize your experience</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white border border-slate-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
            <select 
              value={preferences.language}
              onChange={(e) => setPreferences({...preferences, language: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200"
            >
              <option value="en">English</option>
              <option value="zh">中文 (Chinese)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
            <select 
              value={preferences.timezone}
              onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200"
            >
              <option value="Australia/Sydney">Australia/Sydney (GMT+11)</option>
              <option value="Australia/Melbourne">Australia/Melbourne (GMT+11)</option>
              <option value="Australia/Perth">Australia/Perth (GMT+8)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
            <select 
              value={preferences.currency}
              onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200"
            >
              <option value="AUD">Australian Dollar (AUD)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
            <select 
              value={preferences.dateFormat}
              onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div className="pt-4">
            <button className="px-4 py-2 bg-blue-600 text-white">Save Preferences</button>
          </div>
        </div>
      </div>
    </div>
  );
}
