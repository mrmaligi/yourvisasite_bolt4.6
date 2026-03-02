import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export function MediaLibrary() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Media Library</h1>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Media Library Overview</h2>
          </CardHeader>
          <CardBody>
            <p>Content for Media Library goes here.</p>
          </CardBody>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
