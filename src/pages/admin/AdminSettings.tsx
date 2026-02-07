import { Card, CardContent, CardHeader } from '../../components/ui/card';

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Admin Settings</h1>
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-neutral-900">Platform Configuration</h2>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 text-sm">
            Core platform settings such as pricing and tracker parameters are managed under the Pricing section.
            Additional configuration options will be available here as the platform grows.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
