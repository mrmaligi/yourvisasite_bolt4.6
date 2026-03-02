import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, Files, PenTool, Plus } from 'lucide-react';
import { AdminDashboardLayout } from '../../components/layout/AdminDashboardLayout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

export function Content() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AdminDashboardLayout>
      <Helmet>
        <title>Content CMS | VisaBuild</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Content Management</h1>
                <p className="text-neutral-600 dark:text-neutral-300">Overview of platform content.</p>
            </div>
            <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New
            </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))
            ) : (
                <>
                    <Link to="/admin/pages">
                        <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
                            <CardBody className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                    <Files className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">Static Pages</p>
                                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">12</h3>
                                </div>
                            </CardBody>
                        </Card>
                    </Link>
                    <Link to="/admin/blog">
                        <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
                            <CardBody className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                    <PenTool className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">Blog Posts</p>
                                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">45</h3>
                                </div>
                            </CardBody>
                        </Card>
                    </Link>
                    <Link to="/admin/visas">
                        <Card className="hover:border-primary-500 transition-colors cursor-pointer h-full">
                            <CardBody className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                    <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">Visa Guides</p>
                                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">28</h3>
                                </div>
                            </CardBody>
                        </Card>
                    </Link>
                </>
            )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Activity</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-700 last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium text-neutral-900 dark:text-white">Updated "Partner Visa Guide"</p>
                                <p className="text-xs text-neutral-500">By Admin • 2 hours ago</p>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                        </div>
                    ))}
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Quick Actions</h2>
                </CardHeader>
                <CardBody className="space-y-3">
                    <Button variant="secondary" className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Page
                    </Button>
                    <Button variant="secondary" className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Write Blog Post
                    </Button>
                    <Button variant="secondary" className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Visa Guide
                    </Button>
                </CardBody>
            </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
