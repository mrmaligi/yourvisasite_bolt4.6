import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export function APIKeys() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">A P I Keys</h1>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">A P I Keys Overview</h2>
          </CardHeader>
          <CardBody>
            <p>Content for A P I Keys goes here.</p>
          </CardBody>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
