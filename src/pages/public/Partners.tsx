import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const PARTNER_CATEGORIES = [
  { name: 'Health Insurance', description: 'Compare and choose the best health insurance.', link: '/partners/insurance' },
  { name: 'English Test Providers', description: 'Official partners for English language testing.', link: '/partners/english-test' },
  { name: 'Relocation Services', description: 'Get help moving to Australia.', link: '/partners/relocation' },
  { name: 'Banking and Finance', description: 'Set up your finances before you arrive.', link: '/partners/banking' },
  { name: 'Education Agents', description: 'Find the right course and institution.', link: '/partners/education' },
];

export function Partners() {
  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>Partner Program | VisaBuild</title>
        <meta name="description" content="Become a VisaBuild partner and grow your business." />
      </Helmet>

      <section className="bg-neutral-900 py-24 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Partner with VisaBuild</h1>
        <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-10">
          Join the fastest growing immigration platform in Australia.
          Connect with thousands of qualified applicants.
        </p>
        <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
          Apply Now <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">Why Partner With Us?</h2>
            <div className="space-y-6">
              {[
                "Access to high-intent leads",
                "Verified applicant data",
                "Automated document collection",
                "Integrated payment processing"
              ].map((item, i) => (
                <div key={i} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-4 flex-shrink-0" />
                  <p className="text-lg text-neutral-700 dark:text-neutral-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="dark:bg-neutral-800 dark:border-neutral-700">
            <CardBody className="p-8">
              <h3 className="text-xl font-bold mb-6 text-neutral-900 dark:text-white">Express Interest</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input type="email" placeholder="Work Email" />
                <Input placeholder="Company Name" />
                <Button className="w-full">Submit Application</Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="bg-neutral-50 dark:bg-neutral-800 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-neutral-900 dark:text-white">Our Partner Categories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PARTNER_CATEGORIES.map((cat, index) => (
              <Link key={index} to={cat.link} className="block group">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-neutral-900 dark:border-neutral-700">
                  <CardBody className="p-8">
                    <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{cat.description}</p>
                    <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 font-medium">
                      View Partners <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
