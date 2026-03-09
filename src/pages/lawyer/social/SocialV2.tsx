import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Linkedin, Twitter, Facebook, Share2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
  icon: 'linkedin' | 'twitter' | 'facebook';
}

const MOCK_ACCOUNTS: SocialAccount[] = [
  { id: '1', platform: 'LinkedIn', username: 'Jane Doe', connected: true, icon: 'linkedin' },
  { id: '2', platform: 'Twitter / X', username: '', connected: false, icon: 'twitter' },
  { id: '3', platform: 'Facebook', username: '', connected: false, icon: 'facebook' },
];

export function SocialV2() {
  const [accounts] = useState<SocialAccount[]>(MOCK_ACCOUNTS);
  const [autoPost, setAutoPost] = useState(true);

  const stats = {
    connected: accounts.filter(a => a.connected).length,
    total: accounts.length,
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'linkedin': return <Linkedin className="w-6 h-6 text-blue-700" />;
      case 'twitter': return <Twitter className="w-6 h-6 text-sky-500" />;
      case 'facebook': return <Facebook className="w-6 h-6 text-blue-600" />;
      default: return <Share2 className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Social Media | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Social Media</h1>
                <p className="text-slate-600">Connect your profiles</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.connected}/{stats.total}</p>
                <p className="text-sm text-slate-600">Accounts Connected</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Connected Accounts</h2>
              
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.id} className={`flex items-center gap-4 p-4 border ${
                    account.connected ? 'border-slate-200' : 'border-slate-200 opacity-60'
                  }`}>
                    <div className="w-12 h-12 bg-slate-100 flex items-center justify-center">
                      {getIcon(account.icon)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{account.platform}</h3>
                      <p className="text-sm text-slate-500">{account.connected ? `Connected as ${account.username}` : 'Not connected'}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {account.connected ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <Button variant="outline" size="sm">Disconnect</Button>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-slate-400" />
                          <Button variant="primary" size="sm">Connect</Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Auto-Post Settings</h2>
              
              <p className="text-slate-600 mb-4">Automatically share your new blog posts and achievements.</p>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-900">Share New Content</span>
                <button
                  onClick={() => setAutoPost(!autoPost)}
                  className={`w-12 h-6 transition-colors ${
                    autoPost ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white mt-0.5 transition-all ${
                    autoPost ? 'ml-6' : 'ml-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
