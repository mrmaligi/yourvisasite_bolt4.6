import { useState } from 'react';
import { MessageSquare, Users, Clock, Info } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';

export function LiveChat() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Live Chat</h1>
        <p className="text-neutral-500 mt-1">Real-time customer support chat</p>
      </div>

      <Alert variant="info" className="mb-4">
        <Info className="w-4 h-4" />
        <div>
          <p className="font-medium">Coming Soon</p>
          <p className="text-sm">
            Live chat functionality is currently in development. Support tickets can be used
            for now to handle customer inquiries.
          </p>
        </div>
      </Alert>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">--</p>
                <p className="text-sm text-neutral-500">Active Chats</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">--</p>
                <p className="text-sm text-neutral-500">Avg Response Time</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">--</p>
                <p className="text-sm text-neutral-500">Total Conversations</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Live Chat Settings</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <div>
              <p className="font-medium">Enable Live Chat</p>
              <p className="text-sm text-neutral-500">Allow users to start live chat sessions</p>
            </div>
            <Button variant={isEnabled ? 'default' : 'outline'} onClick={() => setIsEnabled(!isEnabled)}>
              {isEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg opacity-50">
            <div>
              <p className="font-medium">Auto-Assign Chats</p>
              <p className="text-sm text-neutral-500">Automatically assign chats to available agents</p>
            </div>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg opacity-50">
            <div>
              <p className="font-medium">Chat Widget Style</p>
              <p className="text-sm text-neutral-500">Customize the chat widget appearance</p>
            </div>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
