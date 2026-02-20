import React from 'react';
import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';
import { Briefcase, FileText, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MobileDashboardHome() {
  const navigate = useNavigate();

  return (
    <MobileLayout title="Dashboard" showBack={false}>
      <div className="space-y-4">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back!</h2>
          <p className="text-gray-500 dark:text-gray-400">Here's what's happening with your visas.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <MobileCard className="mb-0 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
            <div className="flex flex-col items-center p-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mb-2">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">2</span>
              <span className="text-xs text-blue-600 dark:text-blue-400">Active Applications</span>
            </div>
          </MobileCard>
          <MobileCard className="mb-0 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800">
            <div className="flex flex-col items-center p-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">5</span>
              <span className="text-xs text-purple-600 dark:text-purple-400">Documents</span>
            </div>
          </MobileCard>
        </div>

        {/* Action Cards */}
        <MobileCard title="Track Application" subtitle="Latest updates on your visa">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <p className="text-sm font-medium">Subclass 189 - Processing</p>
          </div>
          <MobileButton onClick={() => navigate('/mobile/tracker-status')}>View Details</MobileButton>
        </MobileCard>

        <MobileCard title="Recent Notifications">
           <div className="space-y-3">
             <div className="flex gap-3 items-start border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
               <Bell className="w-5 h-5 text-yellow-500 mt-0.5" />
               <div>
                 <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Document Required</p>
                 <p className="text-xs text-gray-500">Please upload your passport copy.</p>
               </div>
             </div>
             <div className="flex gap-3 items-start">
               <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
               <div>
                 <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Application Received</p>
                 <p className="text-xs text-gray-500">Your application has been received.</p>
               </div>
             </div>
           </div>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}
