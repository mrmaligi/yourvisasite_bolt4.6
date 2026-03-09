import { FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function CreateArticleV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create Article</h1>
            <p className="text-slate-600">Write a new article</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Save Draft</Button>
            <Button variant="primary">Publish</Button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" placeholder="Enter article title" className="w-full px-3 py-2 border border-slate-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
            <input type="text" placeholder="article-url-slug" className="w-full px-3 py-2 border border-slate-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select className="w-full px-3 py-2 border border-slate-200">
              <option>Select category</option>
              <option>Partner Visas</option>
              <option>Skilled Migration</option>
              <option>Student Visas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea placeholder="Write your article content..." className="w-full px-3 py-2 border border-slate-200 h-96" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
            <textarea placeholder="Brief summary..." className="w-full px-3 py-2 border border-slate-200 h-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
