import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, User, Search, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Booking {
  id: string;
  clientName: string;
  lawyerName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  type: string;
}

const MOCK_BOOKINGS: Booking[] = [
  { id: '1', clientName: 'Sarah Johnson', lawyerName: 'Michael Chen', date: '2024-03-25', time: '10:00 AM', status: 'confirmed', type: 'Partner Visa' },
  { id: '2', clientName: 'Bob Wilson', lawyerName: 'Jane Doe', date: '2024-03-26', time: '2:00 PM', status: 'pending', type: 'Skilled Migration' },
  { id: '3', clientName: 'Alice Smith', lawyerName: 'Not assigned', date: '2024-03-27', time: '11:00 AM', status: 'pending', type: 'Student Visa' },
];

export function BookingsV2() {
  const [bookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [search, setSearch] = useState('');

  const filteredBookings = bookings.filter(b => 
    b.clientName.toLowerCase().includes(search.toLowerCase()) ||
    b.lawyerName.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
  };

  return (
    <>
      <Helmet>
        <title>Bookings | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
                <p className="text-slate-600">Manage consultation bookings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Bookings', value: stats.total },
              { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600' },
              { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className={`text-2xl font-bold ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Client</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Lawyer</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Date & Time</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">{booking.clientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{booking.lawyerName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {booking.date}
                          <Clock className="w-4 h-4 ml-2" />
                          {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs">{booking.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          booking.status === 'confirmed' ? 'success' :
                          booking.status === 'pending' ? 'warning' : 'danger'
                        }>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
