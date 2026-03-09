import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function BookingsV2() {
  const bookings = [
    { id: 1, client: 'John Doe', lawyer: 'Jane Smith', date: '2024-03-25', time: '10:00 AM', status: 'confirmed', type: 'Consultation' },
    { id: 2, client: 'Alice Brown', lawyer: 'Bob Wilson', date: '2024-03-26', time: '2:00 PM', status: 'pending', type: 'Document Review' },
    { id: 3, client: 'Charlie Davis', lawyer: 'Jane Smith', date: '2024-03-27', time: '11:00 AM', status: 'cancelled', type: 'Consultation' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
            <p className="text-slate-600">Manage consultation bookings</p>
          </div>
          <Button variant="primary">View Calendar</Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Today', value: '8' },
            { label: 'This Week', value: '42' },
            { label: 'Pending', value: '12' },
            { label: 'Completed', value: '156' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 p-4">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
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
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">{booking.client}</td>
                    <td className="px-6 py-4 text-slate-700">{booking.lawyer}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {booking.date}
                        <Clock className="w-4 h-4 ml-2" />
                        {booking.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{booking.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : booking.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {booking.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                        {booking.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm">Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
