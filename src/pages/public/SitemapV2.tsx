import { FileText, AlertCircle, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PublicSitemapV2() {
  const sections = [
    {
      title: 'Visas',
      links: ['Partner Visa', 'Skilled Visa', 'Student Visa', 'Visitor Visa', 'Business Visa'],
    },
    {
      title: 'Resources',
      links: ['Guides', 'Templates', 'Checklists', 'Webinars', 'Podcast'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Partners', 'Contact'],
    },
    {
      title: 'Support',
      links: ['Help Center', 'FAQs', 'Blog', 'Community', 'Status'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Sitemap</h1>
          <p className="text-slate-600 mt-2">Navigate all pages on VisaBuild</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="bg-white border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">{section.title}</h2>
              
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-600 hover:text-blue-600">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
