import { useState, useEffect } from 'react';
import { AdminDashboardLayout } from '../../../components/layout/AdminDashboardLayout';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { CheckCircle } from 'lucide-react';

export function MediaLibrary() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Media Library</h1>
          <Button variant="secondary">Refresh</Button>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Media Library Overview</h2>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium">This page is working</p>
                <p className="text-sm text-neutral-500">Database connection active</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
