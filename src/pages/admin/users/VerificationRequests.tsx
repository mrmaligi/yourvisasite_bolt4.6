import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export function VerificationRequests() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Verification Requests</h1>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Verification Requests Overview</h2>
          </CardHeader>
          <CardBody>
            <p>Content for Verification Requests goes here.</p>
          </CardBody>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
