import { IntegrationsLayout } from '../IntegrationsLayout';

export function ApiDocs() {
  return (
    <IntegrationsLayout>
      <div className="space-y-6">
        <div>
           <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">API Documentation</h2>
           <p className="text-neutral-500">Manage generated API documentation.</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
           <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Documentation is automatically generated from the OpenAPI specification.
           </p>

           <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 font-mono text-sm">
              <p className="text-purple-600">openapi: 3.0.0</p>
              <p className="text-blue-600">info:</p>
              <p className="pl-4">title: VisaBuild API</p>
              <p className="pl-4">version: 1.0.0</p>
              <p className="text-blue-600">paths:</p>
              <p className="pl-4">/visas:</p>
              <p className="pl-8">get:</p>
              <p className="pl-12">summary: List all visas</p>
           </div>
        </div>
      </div>
    </IntegrationsLayout>
  );
}
