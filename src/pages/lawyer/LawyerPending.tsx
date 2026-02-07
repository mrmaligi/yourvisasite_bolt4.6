import { useNavigate } from 'react-router-dom';
import { Clock, Mail, Scale } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';

export function LawyerPending() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center py-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Registration Submitted
          </h1>

          <p className="text-neutral-600 mb-6">
            Your lawyer registration is pending admin verification.
          </p>

          <div className="bg-neutral-50 rounded-lg p-4 mb-6 space-y-3 text-left">
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Verification in Progress
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  Our admin team is reviewing your credentials and verification documents.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Email Notification
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  You'll receive an email once your application is approved or if additional information is needed.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-neutral-500 mb-6">
            Verification typically takes 1-3 business days. You can check back here anytime.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Return Home
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Check Status
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
