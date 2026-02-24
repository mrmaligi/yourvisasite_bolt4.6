import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export function Maintenance() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Maintenance</h1>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Maintenance Overview</h2>
          </CardHeader>
          <CardBody>
            <p>Content for Maintenance goes here.</p>
          </CardBody>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
