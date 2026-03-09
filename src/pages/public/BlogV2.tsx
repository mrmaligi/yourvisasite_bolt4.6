import { FileText, CheckCircle, AlertCircle, ArrowRight, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicBlogV2() {
  const posts = [
    { id: 1, title: 'New Partner Visa Changes for 2024', excerpt: 'Important updates to the partner visa program...', date: 'Mar 15, 2024', category: 'News', author: 'Jane Smith' },
    { id: 2, title: 'How to Prepare for Your Visa Interview', excerpt: 'Tips and strategies for a successful interview...', date: 'Mar 10, 2024', category: 'Guide', author: 'Bob Wilson' },
    { id: 3, title: 'Understanding Points-Based Visas', excerpt: 'A complete breakdown of the points system...', date: 'Mar 5, 2024', category: 'Education', author: 'Sarah Lee' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">VisaBuild Blog</h1>
          <p className="text-xl text-slate-300">Latest news, guides, and immigration insights</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-slate-200 overflow-hidden">
              <div className="h-48 bg-slate-200" />
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium">{post.category}</span>
                  <span className="text-sm text-slate-500">{post.date}</span>
                </div>
                
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{post.title}</h3>
                <p className="text-slate-600 mb-4">{post.excerpt}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">By {post.author}</span>
                  <button className="text-blue-600 font-medium hover:underline">Read More →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 p-8 text-center">
          <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-blue-900 mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-blue-700 mb-4">Get the latest immigration news and tips delivered to your inbox.</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 px-3 py-2 border border-slate-200" />
            <Button variant="primary">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
