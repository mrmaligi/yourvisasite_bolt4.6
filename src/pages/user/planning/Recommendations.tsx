import React from 'react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const Recommendations = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">AI Recommendations</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">Get personalized visa recommendations.</p>
        </div>
        <Button>Action</Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">AI Recommendations</h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-600 dark:text-neutral-300">
            This is the AI Recommendations page. Content for get personalized visa recommendations. goes here.
          </p>
          <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-500">Feature coming soon...</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
