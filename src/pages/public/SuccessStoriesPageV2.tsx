import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Quote, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const stories = [
  {
    id: '1',
    company: 'TechCorp Industries',
    industry: 'Manufacturing',
    quote: 'Implementing this solution transformed our workflow efficiency by 300%. The results exceeded all our expectations.',
    author: 'Michael Chen',
    role: 'Operations Director',
    metric: '300%',
    metricLabel: 'Efficiency Increase',
  },
  {
    id: '2',
    company: 'GreenEnergy Solutions',
    industry: 'Renewable Energy',
    quote: 'We reduced our operational costs significantly while improving our customer satisfaction scores.',
    author: 'Sarah Williams',
    role: 'CEO',
    metric: '45%',
    metricLabel: 'Cost Reduction',
  },
  {
    id: '3',
    company: 'Global Logistics Inc',
    industry: 'Transportation',
    quote: 'The platform streamlined our entire supply chain process. Real-time tracking changed everything.',
    author: 'David Park',
    role: 'Supply Chain Manager',
    metric: '24/7',
    metricLabel: 'Visibility',
  }
];

export function SuccessStoriesPageV2() {
  return (
    <>
      <Helmet>
        <title>Success Stories | VisaBuild</title>
        <meta name="description" content="See how companies are transforming their business with VisaBuild." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <header className="bg-[#2563EB] text-white">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              See how leading companies are transforming their businesses with our platform
            </p>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white p-6 border border-slate-200 text-center">
              <p className="text-4xl font-bold text-[#2563EB]">500+</p>
              <p className="text-slate-600 mt-2">Companies Served</p>
            </div>
            <div className="bg-white p-6 border border-slate-200 text-center">
              <p className="text-4xl font-bold text-[#2563EB]">98%</p>
              <p className="text-slate-600 mt-2">Customer Satisfaction</p>
            </div>
            <div className="bg-white p-6 border border-slate-200 text-center">
              <p className="text-4xl font-bold text-[#2563EB]">$2M+</p>
              <p className="text-slate-600 mt-2">Average Savings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story) => (
              <div key={story.id} className="bg-white border border-slate-200 overflow-hidden">
                <div className="h-48 bg-slate-200 flex items-center justify-center">
                  <div className="w-20 h-20 bg-[#2563EB] text-white flex items-center justify-center text-2xl font-bold">
                    {story.company.charAt(0)}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{story.company}</h3>
                  
                  <div className="relative mb-4">
                    <Quote className="w-8 h-8 text-blue-100 absolute -top-2 -left-2" />
                    <p className="text-slate-600 relative z-10 pl-4">{story.quote}</p>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <p className="font-semibold text-slate-900">{story.author}</p>
                    <p className="text-sm text-slate-600">{story.role}</p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200">
                    <p className="text-2xl font-bold text-[#2563EB]">{story.metric}</p>
                    <p className="text-sm text-slate-600">{story.metricLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white border border-slate-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to write your success story?</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of companies already transforming their business with our solutions.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary">Get Started</Button>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
