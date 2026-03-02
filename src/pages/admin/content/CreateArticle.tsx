import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export function CreateArticle() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Create Article</h1>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Create Article Overview</h2>
          </CardHeader>
          <CardBody>
            <p>Content for Create Article goes here.</p>
          </CardBody>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
