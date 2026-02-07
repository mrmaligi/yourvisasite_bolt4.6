@@ .. @@
 import { ArrowRight, Shield, Clock, Users, CheckCircle, Star, TrendingUp } from 'lucide-react';
 import { Link } from 'react-router-dom';
 import { Button } from '../components/ui/Button';
+import { PricingCard } from '../components/PricingCard';
+import { STRIPE_PRODUCTS } from '../stripe-config';
 
@@ .. @@
         </div>
       </section>
 
+      {/* Pricing Section */}
+      <section className="py-20 bg-gray-50">
+        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
+          <div className="text-center mb-16">
+            <h2 className="text-3xl font-bold text-gray-900 mb-4">
+              Get Premium Access
+            </h2>
+            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
+              Unlock expert guidance, premium resources, and priority support for your visa journey.
+            </p>
+          </div>
+          
+          <div className="max-w-lg mx-auto">
+            <PricingCard 
+              product={STRIPE_PRODUCTS.visasite}
+              featured={true}
+            />
+          </div>
+        </div>
+      </section>
+
       {/* CTA Section */}
       <section className="py-20 bg-indigo-600">