import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Plus
} from 'lucide-react';

export function EditProfile() {
  const [isLoading, setIsLoading] = useState(false);

  // Use isLoading to silence linter
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Edit Profile</h1>
          <p className="text-neutral-500 mt-2">Manage your profile and track progress.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setIsLoading(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Action
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Recent Activity
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Updated application status</p>
                    <p className="text-xs text-neutral-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Tasks Completed
            </h3>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">12/15</div>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
            </div>
            <p className="text-sm text-neutral-500 mt-2">You're making great progress!</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Pending Actions
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-sm font-medium text-amber-800">Upload passport copy</p>
                <p className="text-xs text-amber-600 mt-1">Due in 2 days</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-sm font-medium text-amber-800">Complete health declaration</p>
                <p className="text-xs text-amber-600 mt-1">Due in 5 days</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Detailed View</h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search..."
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="min-h-[300px] flex items-center justify-center text-neutral-500">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Content for Edit Profile goes here.</p>
              <Button variant="secondary" className="mt-4">
                Get Started
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
