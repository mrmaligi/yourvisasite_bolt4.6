import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FileText, Bookmark, FolderOpen, Calendar, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface ActivityItem {
  id: string;
  type: 'purchase' | 'document' | 'booking';
  date: string;
  title: string;
  description: string;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: '1', type: 'purchase', date: '2024-03-20', title: 'Partner Visa Guide', description: 'Purchased premium guide' },
  { id: '2', type: 'document', date: '2024-03-18', title: 'Passport Uploaded', description: 'Document verification pending' },
  { id: '3', type: 'booking', date: '2024-03-15', title: 'Consultation Booked', description: 'With Jane Doe on Mar 25' },
];

export function UserDashboardV2() {
  const [counts] = useState({
    purchases: 3,
    saved: 5,
    documents: 8,
    upcomingBookings: 2
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'document': return <FolderOpen className="w-5 h-5 text-green-600" />;
      case 'booking': return <Calendar className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | VisaBuild</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
                <p className="text-slate-600">Track your visa journey</p>
              </div>
              <Button variant="primary">
                <FileText className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Purchases', value: counts.purchases, icon: FileText, color: 'bg-blue-100 text-blue-600' },
              { label: 'Saved Visas', value: counts.saved, icon: Bookmark, color: 'bg-amber-100 text-amber-600' },
              { label: 'Documents', value: counts.documents, icon: FolderOpen, color: 'bg-green-100 text-green-600' },
              { label: 'Bookings', value: counts.upcomingBookings, icon: Calendar, color: 'bg-purple-100 text-purple-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.color} flex items-center justify-center`}>
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

          <div className="grid md:grid-cols-3 gap-6"
          >
            <div className="md:col-span-2 bg-white border border-slate-200"
            >
              <div className="p-4 border-b border-slate-200 flex items-center justify-between"
003e
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                <Link to="/user/activity" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>
              
              <div className="divide-y divide-slate-200">
                {MOCK_ACTIVITIES.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{activity.title}</p>
                      <p className="text-sm text-slate-600">{activity.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/user/documents" className="flex items-center gap-2 p-2 hover:bg-slate-50">
                    <FolderOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">Upload Documents</span>
                  </Link>
                  <Link to="/user/consultations" className="flex items-center gap-2 p-2 hover:bg-slate-50">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">Book Consultation</span>
                  </Link>
                  <Link to="/user/profile" className="flex items-center gap-2 p-2 hover:bg-slate-50">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">Update Profile</span>
                  </Link>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-700 mb-3">Get personalized guidance from our experts.</p>
                <Button variant="primary" size="sm">
                  Contact Support
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
