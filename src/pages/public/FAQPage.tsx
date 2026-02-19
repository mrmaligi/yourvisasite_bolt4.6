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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            Find answers to common questions about VisaBuild
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            placeholder="Search for answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {faq.question}
                  </span>
                </div>
                {expandedItems.has(index) ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>
              {expandedItems.has(index) && (
                <CardBody className="pt-0 pb-6 px-6 pl-14">
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {faq.answer}
                  </p>
                </CardBody>
              )}
            </Card>
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
        <div className="mt-12 text-center p-8 bg-primary-50 dark:bg-primary-900/20 rounded-2xl">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
