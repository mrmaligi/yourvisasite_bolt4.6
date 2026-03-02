import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export function Backup() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Backup</h1>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Backup Overview</h2>
          </CardHeader>
          <CardBody>
            <p>Content for Backup goes here.</p>
          </CardBody>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
