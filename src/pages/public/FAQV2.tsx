import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'General',
    question: 'What is VisaBuild?',
    answer: 'VisaBuild is a platform that helps people navigate the Australian immigration system. We provide visa information, processing time data, step-by-step guides, and connections to verified immigration lawyers.'
  },
  {
    category: 'General',
    question: 'Is VisaBuild free to use?',
    answer: 'Yes! Basic visa information, our processing time tracker, and lawyer directory are completely free. We charge for premium visa guides ($49) which include detailed step-by-step instructions and document checklists.'
  },
  {
    category: 'Visas',
    question: 'How do I know which visa to apply for?',
    answer: 'Take our free 2-minute eligibility quiz! Answer a few questions about your situation and we will recommend the best visa options for you with personalized eligibility scores.'
  },
  {
    category: 'Visas',
    question: 'Are your visa guides up to date?',
    answer: 'We update our content regularly based on official Department of Home Affairs announcements. Our team monitors policy changes and updates guides within 48 hours of major changes.'
  },
  {
    category: 'Processing Times',
    question: 'Where do you get your processing time data?',
    answer: 'Our processing times come from two sources: (1) Users who voluntarily share their timeline after getting a decision, and (2) Official Department of Home Affairs data. Lawyer-verified submissions carry more weight in our calculations.'
  },
  {
    category: 'Lawyers',
    question: 'How do you verify immigration lawyers?',
    answer: 'All lawyers on our platform must provide their Migration Agents Registration Authority (MARA) registration number. We verify this against the official MARA database before they can join.'
  },
  {
    category: 'Premium',
    question: 'What is included in premium guides?',
    answer: 'Premium guides include detailed step-by-step instructions, document checklists, template examples, common mistakes to avoid, and direct links to official forms. They are designed to help you prepare a complete application.'
  },
  {
    category: 'Account',
    question: 'How do I track my visa application?',
    answer: 'Create a free account and use our Tracker feature. You can log key milestones, upload documents, set deadline reminders, and view estimated processing times based on similar applications.'
  }
];

const categories = ['All', 'General', 'Visas', 'Processing Times', 'Lawyers', 'Premium', 'Account'];

export function FAQV2() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <Helmet>
        <title>FAQ | VisaBuild</title>
        <meta name="description" content="Find answers to common questions about Australian visas, processing times, and our platform." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find answers to common questions about Australian visas and our platform
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search - SQUARE */}
          <div className="bg-white border border-slate-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Categories - SQUARE */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium border transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items - SQUARE */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openItems.includes(index);
              return (
                <div 
                  key={index} 
                  className="bg-white border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">{faq.category}</Badge>
                      <span className="font-medium text-slate-900">{faq.question}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-4 border-t border-slate-100">
                      <p className="text-slate-700 pt-4 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-white border border-slate-200">
              <p className="text-slate-600">No questions found matching your search.</p>
            </div>
          )}

          {/* Contact CTA - SQUARE */}
          <div className="mt-8 bg-blue-600 text-white p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Still have questions?</h3>
                  <p className="text-blue-100 text-sm">Our support team is here to help</p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
