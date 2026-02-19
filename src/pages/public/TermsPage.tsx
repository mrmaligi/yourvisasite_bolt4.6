export function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-8">
          Terms of Service
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 mb-8">
          Last updated: February 19, 2026
        </p>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              By accessing or using VisaBuild, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              VisaBuild provides information about Australian visas, processing times, and 
              connects users with registered immigration lawyers. We do not provide legal 
              advice. All information is for educational purposes only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              3. Not Legal Advice
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              <strong>Important:</strong> Nothing on this website constitutes legal advice. 
              VisaBuild is not a law firm. Our guides, articles, and tools are for informational 
              purposes only. Always consult with a registered migration agent or lawyer for 
              advice specific to your situation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              4. User Accounts
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              To access certain features, you must create an account. You are responsible for 
              maintaining the confidentiality of your account credentials and for all activities 
              that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              5. Premium Content
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Premium visa guides are available for purchase. All sales are subject to our 
              refund policy. We offer a 7-day money-back guarantee if you are not satisfied 
              with your purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              6. Lawyer Services
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Lawyers listed on our platform are independent professionals. VisaBuild acts 
              as a marketplace connecting users with lawyers. We are not responsible for the 
              quality of legal services provided. All fee arrangements are between you and 
              the lawyer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              7. Privacy
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Your privacy is important to us. Please review our{' '}
              <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>{' '}
              to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              VisaBuild shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              9. Changes to Terms
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              We may modify these terms at any time. We will notify users of significant 
              changes via email or through the platform. Continued use after changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              10. Contact
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@visabuild.com" className="text-primary-600 hover:underline">
                legal@visabuild.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
