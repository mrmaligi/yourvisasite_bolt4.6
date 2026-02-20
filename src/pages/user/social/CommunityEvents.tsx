import React from 'react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const CommunityEvents = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Events Calendar</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">Upcoming community events and webinars.</p>
        </div>
        <Button>Action</Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">Events Calendar</h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-600 dark:text-neutral-300">
            This is the Events Calendar page. Content for upcoming community events and webinars. goes here.
          </p>
          <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-500">Feature coming soon...</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
