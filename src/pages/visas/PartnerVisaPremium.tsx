import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PremiumSection, PremiumPricingCard } from '@/components/premium/PremiumSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, DollarSign, Heart, Users, FileCheck, ArrowLeft, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { extractSubclassFromSlug, createVisaSlug } from '@/lib/url-utils';
import type { Visa } from '@/types/database';

interface VisaContent {
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  documents: {
    applicant: string[];
    sponsor: string[];
  };
  evidence: Array<{
    category: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

// Default content for Partner Visa
const defaultPartnerContent: VisaContent = {
  steps: [
    { number: 1, title: 'Check VEVO', description: 'Verify your current visa status. Look for Condition 8503 which prevents onshore applications.' },
    { number: 2, title: 'Gather Documents', description: 'Start with documents that take longest: police clearances, health exams, relationship evidence.' },
    { number: 3, title: 'Complete Form 80', description: 'Character assessment form covering family, residential, travel, work, and criminal history.' },
    { number: 4, title: 'Create Immi Account', description: 'Register at online.immi.gov.au - this is where you\'ll submit your application.' },
    { number: 5, title: 'Complete Application', description: 'Fill out all sections accurately. You can save and return later.' },
    { number: 6, title: 'Pay & Submit', description: 'Visa fee ($4,550 for most partner visas). Keep your TRN for linking sponsor application.' },
    { number: 7, title: 'Sponsor Completes Form', description: 'Your Australian partner submits sponsorship application using your TRN.' },
    { number: 8, title: 'Upload Documents', description: 'Maximum 100 documents per person. Continue adding over time if needed.' },
  ],
  documents: {
    applicant: ['Passport & birth certificate', 'Relationship evidence', 'Health examinations', 'Police checks', 'Form 80 completed'],
    sponsor: ['Proof of citizenship/PR', 'Employment evidence', 'Financial documents', 'Accommodation evidence', 'Character documents'],
  },
  evidence: [
    { category: 'Financial Aspects', description: 'Show financial interdependence: joint bank accounts, shared bills, joint loans, major purchases together, wills naming each other.' },
    { category: 'Nature of Household', description: 'Evidence you live together: joint lease, utility bills, correspondence to same address, shared responsibilities.' },
    { category: 'Social Context', description: 'Photos together, social media, statements from friends/family (Form 888), joint travel, shared social activities.' },
    { category: 'Commitment', description: 'Duration of relationship, joint plans, shared financial goals, life insurance, evidence of shared decisions.' },
  ],
  faqs: [
    { question: 'Do we need to be married?', answer: 'No. De facto relationships (12+ months) are equally valid. Relationship registration can reduce the 12-month requirement.' },
    { question: 'How long must we have been together?', answer: 'Married: No minimum if genuine. De facto: 12 months (can be waived if registered or compelling circumstances). Prospective Marriage: No minimum but must marry within 9 months.' },
    { question: 'Can I work while waiting?', answer: 'Yes. Once temporary partner visa is granted, you have full work rights.' },
    { question: 'What if my visa expires while waiting?', answer: 'You\'ll receive a Bridging Visa A (BVA) when your current visa expires, allowing you to stay lawfully until a decision is made.' },
  ],
};

const VisaPremiumPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [visa, setVisa] = useState<Visa | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<VisaContent>(defaultPartnerContent);

  // Extract subclass from slug
  const subclass = slug ? extractSubclassFromSlug(slug) : null;

  useEffect(() => {
    const fetchVisa = async () => {
      if (!subclass) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('visas')
        .select('*')
        .eq('subclass', subclass)
        .single();

      if (data) {
        setVisa(data);
        // Check if user has purchased premium access
        if (user) {
          const { data: purchase } = await supabase
            .from('premium_purchases')
            .select('*')
            .eq('visa_id', data.id)
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .single();
          
          if (purchase) {
            setHasAccess(true);
          }
        }
      }
      setLoading(false);
    };

    fetchVisa();
  }, [subclass, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!visa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Visa Not Found</h1>
          <p className="text-gray-600 mb-6">The visa you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/visas">Browse All Visas</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/visas" className="hover:text-blue-600">Visas</Link>
            <span>/</span>
            <Link to={`/visas/${createVisaSlug(visa.name, visa.subclass)}`} className="hover:text-blue-600">
              {visa.category.charAt(0).toUpperCase() + visa.category.slice(1)} Visas
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{visa.name}</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge>Subclass {visa.subclass}</Badge>
                <Badge className="bg-amber-500 text-white">
                  <Lock className="w-3 h-3 mr-1" />
                  PREMIUM
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {visa.name} - Complete Guide
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl">
                {visa.summary || `Comprehensive step-by-step guide for ${visa.name} with document checklists, 
                templates, and expert tips to help you successfully navigate the application process.`}
              </p>
            </div>

            {!hasAccess && (
              <Button variant="outline" asChild className="hidden md:flex">
                <Link to={`/visas/${createVisaSlug(visa.name, visa.subclass)}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Overview
                </Link>
              </Button>
            )}
          </div>
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
                About This Visa
              </h2>
              
              <p className="text-gray-700 mb-4">{visa.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-2">Processing Time</h3>
                  <p className="text-sm text-blue-700">{visa.processing_time || 'Varies by application'}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-green-900 mb-2">Visa Cost</h3>
                  <p className="text-sm text-green-700">{visa.cost_aud || 'Contact for pricing'}</p>
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
                visaId={visa.id}
                onPurchase={() => window.location.href = '/checkout?visa=' + visa.id}
              >
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Step-by-Step Application Process</h3>
                  
                  <div className="space-y-4">
                    {content.steps.map((step) => (
                      <div key={step.number} className="flex gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                          {step.number}
                        </div>
                        <div>
                          <h4 className="font-semibold">{step.title}</h4>
                          <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
                    <h4 className="font-bold text-amber-900 mb-4">📋 Complete Document Checklists</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-amber-800 mb-2">Applicant Documents:</h5>
                        <ul className="space-y-1 text-sm text-amber-700">
                          {content.documents.applicant.map((doc, i) => (
                            <li key={i}>• {doc}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-amber-800 mb-2">Sponsor Documents:</h5>
                        <ul className="space-y-1 text-sm text-amber-700">
                          {content.documents.sponsor.map((doc, i) => (
                            <li key={i}>• {doc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="font-bold text-green-900 mb-4">📊 Evidence Requirements Detail</h4>
                    
                    <div className="space-y-4">
                      {content.evidence.map((item, i) => (
                        <div key={i}>
                          <h5 className="font-semibold text-green-800">{i + 1}. {item.category}</h5>
                          <p className="text-sm text-green-700">{item.description}</p>
                        </div>
                      ))}
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
                      {content.faqs.map((faq, i) => (
                        <div key={i} className="border-b pb-4">
                          <h5 className="font-semibold mb-2">{faq.question}</h5>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      ))}
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
                  <Link to="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <FileCheck className="w-4 h-4" />
                    Document Checklist
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Clock className="w-4 h-4" />
                    Current Processing Times
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <DollarSign className="w-4 h-4" />
                    Fee Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/lawyers" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Users className="w-4 h-4" />
                    Find a Lawyer
                  </Link>
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
                    Visa requirements change frequently. Always check the{' '}
                    <a href="https://immi.homeaffairs.gov.au" className="underline" target="_blank" rel="noopener noreferrer">
                      Department of Home Affairs
                    </a>{' '}
                    website for the most current information.
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

export default VisaPremiumPage;
