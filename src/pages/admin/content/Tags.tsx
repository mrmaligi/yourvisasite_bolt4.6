import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export function Tags() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Tags</h1>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Tags Overview</h2>
          </CardHeader>
          <CardBody>
            <p>Content for Tags goes here.</p>
          </CardBody>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
