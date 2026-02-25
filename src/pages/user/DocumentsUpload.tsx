import React from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function DocumentsUpload() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Documents Upload</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage your documents upload here.</p>
        </div>
        <Button>Action</Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Overview</h2>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-600 dark:text-neutral-300">
            This is the Documents Upload page. Content coming soon.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
