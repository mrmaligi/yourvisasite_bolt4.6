import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export function AutomatedResponses() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Automated Responses</h1>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Automated Responses Overview</h2>
          </CardHeader>
          <CardBody>
            <p>Content for Automated Responses goes here.</p>
          </CardBody>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
