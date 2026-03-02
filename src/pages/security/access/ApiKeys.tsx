import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function ApiKeys() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">Api Keys</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 mb-4">Manage your access settings here.</p>
          <Button>Action</Button>
        </CardBody>
      </Card>
    </div>
  );
}
