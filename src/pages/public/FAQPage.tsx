import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

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
    category: 'Processing Times',
    question: 'Why are your processing times different from the official website?',
    answer: 'Official processing times show historical averages across all cases. Our data shows real-time community-reported timelines, which can be more accurate for current conditions. We also break down by visa subclass and applicant country.'
  },
  {
    category: 'Lawyers',
    question: 'How do you verify immigration lawyers?',
    answer: 'All lawyers on our platform must provide their Migration Agents Registration Authority (MARA) registration number. We verify this against the official MARA database before they can join.'
  },
  {
    category: 'Lawyers',
    question: 'How much do lawyers charge for consultations?',
    answer: 'Lawyers set their own rates, which typically range from $150-$400 AUD for an initial consultation. You can see each lawyer\'s hourly rate on their profile before booking.'
  },
  {
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment system. We also accept PayPal for certain transactions.'
  },
  {
    category: 'Payments',
    question: 'Can I get a refund on a premium guide?',
    answer: 'Yes, we offer a 7-day money-back guarantee if you are not satisfied with a premium guide. Contact our support team within 7 days of purchase for a full refund.'
  },
  {
    category: 'Account',
    question: 'How do I change my email or password?',
    answer: 'Go to your Dashboard > Settings. You can update your email address, change your password, and manage notification preferences there.'
  },
  {
    category: 'Account',
    question: 'Can I delete my account?',
    answer: 'Yes. Go to Dashboard > Settings > Privacy, and click "Delete Account." This will permanently remove your personal data from our systems, though we retain anonymized usage statistics.'
  },
  {
    category: 'Documents',
    question: 'Is my document upload secure?',
    answer: 'Yes. All documents are encrypted in transit and at rest using industry-standard AES-256 encryption. They are stored in secure cloud storage with strict access controls. Only you and lawyers you explicitly share with can access your documents.'
  },
  {
    category: 'Referrals',
    question: 'How does the referral program work?',
    answer: 'Share your unique referral link with friends. When they sign up and make their first purchase, you both get $20 credit. There is no limit to how many people you can refer!'
  },
];

const categories = ['All', 'General', 'Visas', 'Processing Times', 'Lawyers', 'Payments', 'Account', 'Documents', 'Referrals'];

export function FAQPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(search.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent dark:from-indigo-900/20 rounded-[4rem] blur-3xl"></div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/20 mb-6 text-white transform hover:scale-105 transition-transform duration-300">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Find answers to common questions about VisaBuild, our services, and the Australian immigration process.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-10 max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-neutral-400 dark:text-neutral-500" />
          </div>
          <input
            type="text"
            placeholder="Search for answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-white dark:bg-neutral-800 shadow-lg shadow-neutral-200/50 dark:shadow-none text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-indigo-500 text-lg transition-shadow"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md transform scale-105'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${expandedItems.has(index) ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400 group-hover:bg-indigo-50 dark:group-hover:text-indigo-500'}`}>
                     <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg text-neutral-900 dark:text-white">
                    {faq.question}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${expandedItems.has(index) ? 'rotate-180 bg-neutral-100 dark:bg-neutral-700' : 'bg-transparent'}`}>
                  <ChevronDown className={`w-5 h-5 ${expandedItems.has(index) ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'}`} />
                </div>
              </button>
              {expandedItems.has(index) && (
                <div className="px-6 pb-6 pt-0 pl-[4.5rem] animate-in slide-in-from-top-2 duration-200">
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-300">
              No questions found matching your search.
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 text-center p-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <h3 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-4 relative z-10">
            Still have questions?
          </h3>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 max-w-xl mx-auto relative z-10">
            Can't find the answer you're looking for? Our dedicated support team is ready to assist you.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25 hover:-translate-y-1 relative z-10"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
