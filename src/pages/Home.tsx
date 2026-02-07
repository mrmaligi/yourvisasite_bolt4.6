import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to VisaSite
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your comprehensive platform for visa information, processing times, and premium guides.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link to="/signup">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Features</h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need for your visa journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Visa Information</CardTitle>
                <CardDescription>
                  Comprehensive database of visa types and requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access detailed information about different visa categories, requirements, and application processes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Times</CardTitle>
                <CardDescription>
                  Real-time tracking of visa processing times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get up-to-date information on visa processing times based on real user submissions and data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Premium Guides</CardTitle>
                <CardDescription>
                  Step-by-step premium content for successful applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Unlock detailed guides and expert tips to maximize your chances of visa approval.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of users who trust VisaSite for their visa journey.
            </p>
            <div className="mt-8">
              <Link to="/products">
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-50">
                  View Premium Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}