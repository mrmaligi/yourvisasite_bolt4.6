import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

export function DocumentProgress() {
  const { user } = useAuth();
  const [docCount, setDocCount] = useState(0);
  const totalRequired = 10; // Mock target

  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      const { count } = await supabase
        .from('user_documents')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      setDocCount(count || 0);
    };
    fetchCount();
  }, [user]);

  const progress = Math.min(100, Math.round((docCount / totalRequired) * 100));

  return (
    <Card className="border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-neutral-800">
      <CardHeader>
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Document Progress
        </h2>
      </CardHeader>
      <CardBody>
        <div className="flex items-end justify-between mb-2">
          <span className="text-3xl font-bold text-blue-600">{progress}%</span>
          <span className="text-sm text-neutral-500 mb-1">{docCount} of {totalRequired} uploaded</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2.5 dark:bg-neutral-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-neutral-500 mt-4">
          Complete your profile by uploading required documents for faster processing.
        </p>
      </CardBody>
    </Card>
  );
}
