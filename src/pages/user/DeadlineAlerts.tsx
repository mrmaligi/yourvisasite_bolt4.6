import { Helmet } from 'react-helmet-async';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export function DeadlineAlerts() {
  const deadlines = [
    { id: 1, title: 'Provide Police Check', date: '2023-11-15', daysLeft: 5, urgency: 'high', type: 'Document' },
    { id: 2, title: 'Health Examination', date: '2023-11-20', daysLeft: 10, urgency: 'medium', type: 'Health' },
    { id: 3, title: 'Visa Expiry (Current)', date: '2024-01-10', daysLeft: 60, urgency: 'low', type: 'Visa' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Deadlines & Alerts | VisaBuild</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Deadlines & Alerts</h1>
        <p className="text-neutral-500 mt-1">Stay on top of critical dates for your application.</p>
      </div>

      <div className="grid gap-4">
        {deadlines.map((item) => (
          <Card key={item.id} className={`border-l-4 ${
            item.urgency === 'high' ? 'border-l-red-500' :
            item.urgency === 'medium' ? 'border-l-yellow-500' :
            'border-l-blue-500'
          }`}>
            <CardBody className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                   item.urgency === 'high' ? 'bg-red-50 text-red-600' :
                   item.urgency === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                   'bg-blue-50 text-blue-600'
                }`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                    <Badge variant={
                      item.urgency === 'high' ? 'danger' :
                      item.urgency === 'medium' ? 'warning' : 'secondary'
                    }>
                      {item.urgency.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">Due Date: {new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  item.daysLeft <= 7 ? 'text-red-600' : 'text-neutral-900 dark:text-white'
                }`}>
                  {item.daysLeft}
                </p>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">Days Left</p>
              </div>
            </CardBody>
          </Card>
        ))}

        {deadlines.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900">No Upcoming Deadlines</h3>
              <p className="text-neutral-500">You're all caught up! We'll notify you if anything changes.</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
