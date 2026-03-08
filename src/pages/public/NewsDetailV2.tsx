import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

const article = {
  title: "Major Platform Update Released: New Features and Improvements",
  author: "Sarah Johnson",
  date: "March 8, 2026",
  category: "Product Updates",
  content: [
    "We are excited to announce the release of our biggest platform update yet. This release includes significant performance improvements, new collaboration tools, and enhanced security features.",
    "The update focuses on three main areas: speed, security, and collaboration. Users will notice up to 40% faster load times across all dashboard views, thanks to our new caching architecture.",
    "New collaboration features include real-time document editing, inline commenting, and improved notification systems. Teams can now work together more efficiently than ever before.",
    "Security enhancements include two-factor authentication improvements, advanced encryption for file storage, and automated threat detection systems."
  ],
  tags: ["Update", "Features", "Security", "Performance"]
};

export function NewsDetailV2() {
  return (
    <>
      <Helmet>
        <title>{article.title} | VisaBuild News</title>
        <meta name="description" content={article.content[0]} />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <Link to="/news" className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>
            
            <Badge variant="primary" className="mb-4">{article.category}</Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              {article.title}
            </h1>
            
            <div className="mt-6 flex items-center gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <article className="bg-white border border-slate-200 p-8 md:p-12">
            <div className="max-w-none">
              {article.content.map((paragraph, index) => (
                <p key={index} className="text-lg text-slate-700 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </article>

          <div className="mt-8 bg-slate-100 border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Subscribe to updates</h3>
            <p className="text-slate-600 mb-4">Get the latest news delivered to your inbox.</p>
            <div className="flex gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button variant="primary">Subscribe</Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
