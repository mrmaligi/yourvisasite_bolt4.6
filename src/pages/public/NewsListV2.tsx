import { Newspaper, Clock, ArrowRight, User } from 'lucide-react';

export function NewsListV2() {
  const articles = [
    { title: 'New Partner Visa Changes Announced', date: 'Mar 20, 2024', category: 'Policy', author: 'Migration Team', readTime: '5 min' },
    { title: 'Skilled Occupation List Updated', date: 'Mar 18, 2024', category: 'Updates', author: 'Jane Smith', readTime: '3 min' },
    { title: 'Student Visa Processing Times Improve', date: 'Mar 15, 2024', category: 'News', author: 'John Doe', readTime: '4 min' },
    { title: 'New Regional Visa Pathways Explained', date: 'Mar 12, 2024', category: 'Guides', author: 'Sarah Lee', readTime: '7 min' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">News & Updates</h1>
          <p className="text-slate-400">Latest immigration news and policy changes</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="space-y-6">
          {articles.map((article, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 cursor-pointer hover:border-blue-600">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">{article.category}</span>
                    <span className="text-sm text-slate-500">{article.date}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{article.title}</h3>

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime} read</span>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
