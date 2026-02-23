import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export function ExportData() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Export Data</h1>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Export Data Overview</h2>
          </CardHeader>
          <CardBody>
            <p>Content for Export Data goes here.</p>
          </CardBody>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
