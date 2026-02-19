export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-8">
          Privacy Policy
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 mb-8">
          Last updated: February 19, 2026
        </p>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-300 mb-4">
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Documents you upload (stored securely)</li>
              <li>Communications with us or lawyers</li>
              <li>Quiz responses and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-300 mb-4">
              <li>Provide and improve our services</li>
              <li>Process payments and prevent fraud</li>
              <li>Connect you with immigration lawyers</li>
              <li>Send you updates and notifications</li>
              <li>Analyze usage patterns to improve our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              3. Document Security
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Documents you upload are encrypted using AES-256 encryption both in transit 
              and at rest. They are stored in secure cloud infrastructure with strict 
              access controls. Only you and lawyers you explicitly authorize can access 
              your documents.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              4. Information Sharing
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-300 mb-4">
              <li>Immigration lawyers you choose to work with</li>
              <li>Service providers (payment processing, hosting, analytics)</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              5. Your Rights
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-300 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              6. Cookies and Tracking
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              We use cookies and similar technologies to improve your experience, 
              remember your preferences, and analyze usage. You can control cookies 
              through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              7. Data Retention
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              We retain your information as long as necessary to provide our services 
              and comply with legal obligations. When you delete your account, we 
              remove your personal data within 30 days, though we may retain 
              anonymized usage statistics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              8. International Data Transfers
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Your information may be transferred to and processed in countries other 
              than your own. We ensure appropriate safeguards are in place to protect 
              your data in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              We may update this privacy policy from time to time. We will notify you 
              of significant changes via email or through the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              10. Contact Us
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              If you have questions about this Privacy Policy, contact us at{' '}
              <a href="mailto:privacy@visabuild.com" className="text-primary-600 hover:underline">
                privacy@visabuild.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
