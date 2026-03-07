import React, { useState } from 'react';
import { PremiumSection, PremiumCTA, PremiumPricingCard } from '@/components/premium/PremiumSection';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, DollarSign, Heart, Users, FileCheck } from 'lucide-react';

// Example: Partner Visa Premium Page
const PartnerVisaPremiumPage = () => {
  const [hasAccess, setHasAccess] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Visas</span>
            <span>/</span>
            <span>Family Visas</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Partner Visa</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Australian Partner Visa
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl">
            Reunite with your partner in Australia. Complete guide for Subclass 820/801, 
            309/100, and 300 visas with step-by-step instructions.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Free Preview Content */}
            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                What is a Partner Visa?
              </h2>
              
              <p className="text-gray-700 mb-4">
                Partner visas allow the partner or spouse of an Australian citizen, 
                Australian permanent resident or eligible New Zealand citizen to live in Australia.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-2">Onshore (820/801)</h3>
                  <p className="text-sm text-blue-700">For applicants already in Australia</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-green-900 mb-2">Offshore (309/100)</h3>
                  <p className="text-sm text-green-700">For applicants outside Australia</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-purple-900 mb-2">Prospective Marriage (300)</h3>
                  <p className="text-sm text-purple-700">For engaged couples</p>
                </div>
              </div>
            </section>

            {/* Premium Content Section */}
            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <PremiumSection 
                title="Complete Application Guide"
                isPremium={true}
                hasAccess={hasAccess}
                previewLength={2}
              >
                {/* This content will be shown as preview, then locked */}
                
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Step-by-Step Application Process</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Check VEVO</h4>
                        <p className="text-gray-600 text-sm">
                          Verify your current visa status. Look for Condition 8503 which prevents onshore applications.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Gather Documents</h4>
                        <p className="text-gray-600 text-sm">
                          Start with documents that take longest: police clearances, health exams, relationship evidence.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Complete Form 80</h4>
                        <p className="text-gray-600 text-sm">
                          Character assessment form covering family, residential, travel, work, and criminal history.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold">Create Immi Account</h4>
                        <p className="text-gray-600 text-sm">
                          Register at online.immi.gov.au - this is where you'll submit your application.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                        5
                      </div>
                      <div>
                        <h4 className="font-semibold">Complete Application</h4>
                        <p className="text-gray-600 text-sm">
                          Fill out all sections accurately. You can save and return later.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                        6
                      </div>
                      <div>
                        <h4 className="font-semibold">Pay & Submit</h4>
                        <p className="text-gray-600 text-sm">
                          Visa fee ($4,550 for most partner visas). Keep your TRN for linking sponsor application.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                        7
                      </div>
                      <div>
                        <h4 className="font-semibold">Sponsor Completes Form</h4>
                        <p className="text-gray-600 text-sm">
                          Your Australian partner submits sponsorship application using your TRN.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                        8
                      </div>
                      <div>
                        <h4 className="font-semibold">Upload Documents</h4>
                        <p className="text-gray-600 text-sm">
                          Maximum 100 documents per person. Continue adding over time if needed.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
                    <h4 className="font-bold text-amber-900 mb-4">📋 Complete Document Checklists</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-amber-800 mb-2">Applicant Documents:</h5>
                        <ul className="space-y-1 text-sm text-amber-700">
                          <li>• Passport & birth certificate</li>
                          <li>• Relationship evidence</li>
                          <li>• Health examinations</li>
                          <li>• Police checks</li>
                          <li>• Form 80 completed</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-amber-800 mb-2">Sponsor Documents:</h5>
                        <ul className="space-y-1 text-sm text-amber-700">
                          <li>• Proof of citizenship/PR</li>
                          <li>• Employment evidence</li>
                          <li>• Financial documents</li>
                          <li>• Accommodation evidence</li>
                          <li>• Character documents</li>
                        </ul>
                      </div>
                    </div>
                  </div㸼
                  
                  <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="font-bold text-green-900 mb-4">📊 Evidence Requirements Detail</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-green-800">1. Financial Aspects</h5>
                        <p className="text-sm text-green-700">
                          Show financial interdependence: joint bank accounts, shared bills, joint loans, 
                          major purchases together, wills naming each other.
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-green-800">2. Nature of Household</h3e
                        <p className="text-sm text-green-700">
                          Evidence you live together: joint lease, utility bills, correspondence to same address, 
                          shared responsibilities.
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-green-800">3. Social Context</h5>
                        <p className="text-sm text-green-700">
                          Photos together, social media, statements from friends/family (Form 888), 
                          joint travel, shared social activities.
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-green-800">4. Commitment</h5>
                        <p className="text-sm text-green-700">
                          Duration of relationship, joint plans, shared financial goals, 
                          life insurance, evidence of shared decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-4">⏱️ Processing Times & Costs</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-blue-200">
                            <th className="text-left py-2 text-blue-800">Visa Type</th>
                            <th className="text-left py-2 text-blue-800">90% Processed</th>
                            <th className="text-left py-2 text-blue-800">Fee (AUD)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-2">Subclass 820/801</td>
                            <td className="py-2">14 months</td>
                            <td className="py-2">$4,550</td>
                          </tr>
                          <tr>
                            <td className="py-2">Subclass 309/100</td>
                            <td className="py-2">21 months</td>
                            <td className="py-2">$4,550</td>
                          </tr>
                          <tr>
                            <td className="py-2">Subclass 300</td>
                            <td className="py-2">21 months</td>
                            <td className="py-2">$9,095</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="font-bold text-gray-900 mb-4">❓ Frequently Asked Questions</h4>
                    
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h5 className="font-semibold mb-2">Do we need to be married?</h5>
                        <p className="text-gray-600">
                          No. De facto relationships (12+ months) are equally valid. Relationship registration 
                          can reduce the 12-month requirement.
                        </p>
                      </div>
                      
                      <div className="border-b pb-4">
                        <h5 className="font-semibold mb-2">How long must we have been together?</h5>
                        <p className="text-gray-600">
                          Married: No minimum if genuine. De facto: 12 months (can be waived if registered 
                          or compelling circumstances). Prospective Marriage: No minimum but must marry within 9 months.
                        </p>
                      </div>
                      
                      <div className="border-b pb-4">
                        <h5 className="font-semibold mb-2">Can I work while waiting?</h5>
                        <p className="text-gray-600">
                          Yes. Once temporary partner visa is granted, you have full work rights.
                        </p>
                      </div>
                      
                      <div className="border-b pb-4">
                        <h5 className="font-semibold mb-2">What if my visa expires while waiting?</h5>
                        <p className="text-gray-600">
                          You'll receive a Bridging Visa A (BVA) when your current visa expires, 
                          allowing you to stay lawfully until a decision is made.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumSection>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <PremiumPricingCard />
            
            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold mb-4">Quick Links</h3>
              
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <FileCheck className="w-4 h-4" />
                    Document Checklist
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Clock className="w-4 h-4" />
                    Current Processing Times
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <DollarSign className="w-4 h-4" />
                    Fee Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Users className="w-4 h-4" />
                    Find a Lawyer
                  </a>
                </li>
              </ul>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Important</h4>
                  <p className="text-sm text-amber-700">
                    Visa requirements change frequently. Always check the 
                    <a href="https://immi.homeaffairs.gov.au" className="underline" target="_blank" rel="noopener noreferrer">
                      Department of Home Affairs
                    </a> website for the most current information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerVisaPremiumPage;
