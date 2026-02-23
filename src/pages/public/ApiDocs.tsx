import { Helmet } from 'react-helmet-async';
import { Code, Terminal, Key } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ApiDocs() {
  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>API Documentation | VisaBuild</title>
        <meta name="description" content="Integrate VisaBuild's immigration data into your application." />
      </Helmet>

      <section className="bg-neutral-900 py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Terminal className="w-16 h-16 mx-auto mb-6 text-primary-400" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">VisaBuild API</h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-8">
            Programmatic access to Australia's most comprehensive visa database.
            Real-time processing times, eligibility criteria, and more.
          </p>
          <div className="flex gap-4 justify-center">
             <Button size="lg" className="bg-primary-600 hover:bg-primary-700">Get API Key</Button>
             <Button size="lg" variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">Read Docs</Button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-[250px_1fr] gap-12">
        <aside className="hidden md:block">
           <h3 className="font-bold mb-4 text-neutral-900 dark:text-white uppercase text-sm tracking-wider">Reference</h3>
           <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
             <li className="font-medium text-primary-600 dark:text-primary-400 cursor-pointer">Introduction</li>
             <li className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">Authentication</li>
             <li className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">Visas Endpoint</li>
             <li className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">Processing Times</li>
             <li className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">Eligibility Check</li>
           </ul>
        </aside>

        <div className="space-y-12">
           <section>
              <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white flex items-center">
                 <Key className="w-6 h-6 mr-2 text-primary-500" /> Authentication
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                 All API requests must be authenticated using a Bearer token in the header.
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg font-mono text-sm overflow-x-auto text-neutral-800 dark:text-neutral-200">
                 Authorization: Bearer YOUR_API_KEY
              </div>
           </section>

           <section>
              <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white flex items-center">
                 <Code className="w-6 h-6 mr-2 text-primary-500" /> Example Request
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                 Fetch details for a specific visa subclass.
              </p>
              <div className="bg-neutral-900 p-6 rounded-lg font-mono text-sm overflow-x-auto text-green-400">
                 <div className="mb-2 text-neutral-500"># GET /v1/visas/189</div>
                 <span className="text-purple-400">curl</span> https://api.visabuild.com/v1/visas/189 \<br/>
                 &nbsp;&nbsp;-H <span className="text-yellow-300">"Authorization: Bearer YOUR_KEY"</span>
              </div>
           </section>
        </div>
      </section>
    </div>
  );
}
