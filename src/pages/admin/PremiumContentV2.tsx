import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, FileText, Download, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface PremiumItem {
  id: string;
  title: string;
  type: 'guide' | 'checklist' | 'template';
  visaName: string;
  isPublished: boolean;
  downloads: number;
}

const MOCK_ITEMS: PremiumItem[] = [
  { id: '1', title: 'Partner Visa Complete Guide', type: 'guide', visaName: 'Partner Visa (820)', isPublished: true, downloads: 1250 },
  { id: '2', title: 'Document Checklist', type: 'checklist', visaName: 'Skilled Independent (189)', isPublished: true, downloads: 890 },
  { id: '3', title: 'Relationship Statement Template', type: 'template', visaName: 'Partner Visa (820)', isPublished: false, downloads: 0 },
];

export function PremiumContentV2() {
  const [items] = useState<PremiumItem[]>(MOCK_ITEMS);
  const [search, setSearch] = useState('');

  const filteredItems = items.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: items.length,
    published: items.filter(i => i.isPublished).length,
    totalDownloads: items.reduce((acc, i) => acc + i.downloads, 0),
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'checklist': return <FileText className="w-5 h-5 text-green-500" />;
      case 'template': return <FileText className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
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
              { label: 'Total Items', value: stats.total },
              { label: 'Published', value: stats.published, color: 'text-green-600' },
              { label: 'Total Downloads', value: stats.totalDownloads.toLocaleString(), color: 'text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-slate-200 p-4">
                <p className={`text-2xl font-bold ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Content</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Visa</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Downloads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(item.type)}
                          <div>
                            <p className="font-medium text-slate-900">{item.title}</p>
                            <p className="text-sm text-slate-500 capitalize">{item.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{item.visaName}</td>
                      <td className="px-6 py-4">
                        <Badge variant={item.isPublished ? 'success' : 'warning'}>
                          {item.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{item.downloads}</span>
                        </div>
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
