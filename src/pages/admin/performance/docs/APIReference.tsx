import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function APIReference() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">A P I Reference</h1>
          <p className="text-neutral-600 dark:text-neutral-300">Comprehensive API documentation.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Overview</h2>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-600 dark:text-neutral-300">
            This is the A P I Reference page. Implementation for Comprehensive API documentation. goes here.
          </p>
          <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <p className="text-sm text-neutral-500">
              Placeholder content for APIReference.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
