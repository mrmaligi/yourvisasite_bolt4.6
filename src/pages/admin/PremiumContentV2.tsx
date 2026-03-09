import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface ContentItem {
  id: string;
  title: string;
  type: 'guide' | 'checklist' | 'template';
  visa: string;
  isPublished: boolean;
  downloads: number;
}

const MOCK_CONTENT: ContentItem[] = [
  { id: '1', title: 'Partner Visa Complete Guide', type: 'guide', visa: 'Partner Visa (820)', isPublished: true, downloads: 1250 },
  { id: '2', title: 'Document Checklist', type: 'checklist', visa: 'Skilled Independent (189)', isPublished: true, downloads: 890 },
  { id: '3', title: 'Statement Template', type: 'template', visa: 'Partner Visa (820)', isPublished: false, downloads: 0 },
];

export function PremiumContentV2() {
  const [content] = useState<ContentItem[]>(MOCK_CONTENT);

  const stats = {
    total: content.length,
    published: content.filter(c => c.isPublished).length,
    totalDownloads: content.reduce((sum, c) => sum + c.downloads, 0),
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      guide: 'bg-blue-100 text-blue-700',
      checklist: 'bg-green-100 text-green-700',
      template: 'bg-purple-100 text-purple-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium ${colors[type] || 'bg-slate-100 text-slate-700'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Premium Content | VisaBuild Admin</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Premium Content</h1>
                <p className="text-slate-600">Manage premium guides and resources</p>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Items', value: stats.total, icon: FileText },
              { label: 'Published', value: stats.published, icon: Download },
              { label: 'Downloads', value: stats.totalDownloads.toLocaleString(), icon: ExternalLink },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Title</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Visa</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Downloads</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {content.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{item.title}</p>
                      </td>
                      <td className="px-6 py-4">{getTypeBadge(item.type)}</td>
                      <td className="px-6 py-4 text-slate-700">{item.visa}</td>
                      <td className="px-6 py-4">
                        <Badge variant={item.isPublished ? 'success' : 'secondary'}>
                          {item.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{item.downloads}</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
