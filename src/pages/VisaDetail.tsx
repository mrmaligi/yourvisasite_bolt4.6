import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  DollarSign, 
  FileCheck, 
  Users, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Star,
  Download,
  MessageCircle,
  ChevronRight,
  Heart,
  Briefcase,
  GraduationCap,
  Globe,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { PremiumSection } from '@/components/premium/PremiumSection';

const VisaDetail = () => {
  const { subclass } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch from API
  const visaData: Record<string, any> = {
    '820': {
      subclass: '820/801',
      name: 'Partner Visa',
      fullName: 'Partner Visa (Subclasses 820 and 801)',
      category: 'partner',
      description: 'The Partner visa allows the partner or spouse of an Australian citizen, Australian permanent resident or eligible New Zealand citizen to live in Australia.',
      overview: 'This is a two-stage visa process. First, you are granted a temporary visa (subclass 820) which allows you to stay in Australia. Approximately 2 years after applying, if your relationship is ongoing, you may be assessed for the permanent visa (subclass 801).',
      processingTime: '14-21 months',
      cost: '$4,550',
      stay: 'Temporary then permanent',
      location: 'Australia (onshore)',
      hasPremium: true,
      gradient: 'from-rose-500 to-pink-600',
      requirements: [
        'Be married to or in a de facto relationship with an Australian citizen, permanent resident, or eligible NZ citizen',
        'Your partner must sponsor you',
        'Meet health and character requirements',
        'Have no outstanding debts to the Australian Government',
        'Be in Australia when you apply and when the temporary visa is granted'
      ],
      steps: [
        'Gather required documents',
        'Complete the online application',
        'Pay the visa application charge',
        'Submit sponsorship application',
        'Attend health examinations',
        'Provide biometrics if requested',
        'Wait for decision'
      ],
      documents: [
        'Identity documents (passport, birth certificate)',
        'Relationship evidence',
        'Character documents (police checks)',
        'Health examination results',
        'Sponsor documents',
        'Form 80 (character assessment)',
        'Form 888 (statutory declarations from friends/family)'
      ]
    },
    '309': {
      subclass: '309/100',
      name: 'Partner Visa (Offshore)',
      fullName: 'Partner Visa (Subclasses 309 and 100)',
      category: 'partner',
      description: 'For partners outside Australia to join their Australian partner.',
      processingTime: '21 months',
      cost: '$4,550',
      stay: 'Temporary then permanent',
      location: 'Outside Australia (offshore)',
      hasPremium: true,
      gradient: 'from-rose-500 to-pink-600',
      requirements: [
        'Be outside Australia when applying',
        'Be married or in de facto relationship',
        'Partner must be Australian citizen, PR, or eligible NZ citizen',
        'Meet health and character requirements'
      ],
      steps: [
        'Prepare documents offshore',
        'Submit application online',
        'Pay visa fee',
        'Complete health checks',
        'Wait for temporary visa grant',
        'Travel to Australia',
        'Apply for permanent visa after 2 years'
      ],
      documents: [
        'Passport and identity documents',
        'Relationship evidence',
        'Police clearances',
        'Health examination',
        'Sponsor documents',
        'English test results (if required)'
      ]
    }
  };

  const visa = (subclass ? visaData[subclass] : undefined) || visaData['820'];

  const categoryIcons: Record<string, any> = {
    partner: Heart,
    skilled: Briefcase,
    student: GraduationCap,
    visitor: Globe
  };

  const CategoryIcon = categoryIcons[visa.category] || Globe;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
            <ChevronRight className="w-4 h-4" />
            <button onClick={() => navigate('/visas')} className="hover:text-blue-600">Visas</button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{visa.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-white/20 text-white border-0">
                Subclass {visa.subclass}
              </Badge>
              {visa.hasPremium && (
                <Badge className="bg-amber-500 text-white">
                  <Star className="w-3 h-3 mr-1" /> Premium Guide Available
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {visa.name}
            </h1>

            <p className="text-xl text-blue-100 max-w-2xl mb-8">
              {visa.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50"
                onClick={() => navigate('/lawyers')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Find a Lawyer
              </Button>
              
              {visa.hasPremium && (
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => navigate(`/visas/partner/premium`)}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Get Premium Guide
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Info Bar */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            <div className="p-6">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Processing Time</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{visa.processingTime}</p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Cost</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{visa.cost}</p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Stay</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{visa.stay}</p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Location</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{visa.location}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="process">Process</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">About this Visa</h2>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {visa.overview}
                      </p>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-900 mb-1">Important Notice</p>
                          <p className="text-sm text-amber-700">
                            Visa requirements and fees change frequently. Always check the 
                            <a href="https://immi.homeaffairs.gov.au" className="underline" target="_blank" rel="noopener noreferrer">
                              Department of Home Affairs website
                            </a> for the most current information.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="requirements">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">Eligibility Requirements</h2>
                      
                      <div className="space-y-4">
                        {(visa as any).requirements?.map((req: string, index: number) => (
                          <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-blue-600">{index + 1}</span>
                            </div>
                            <p className="text-gray-700">{req}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="process">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">Application Process</h2>
                      
                      <div className="space-y-6">
                        {visa.steps.map((step, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                {index + 1}
                              </div>
                              {index < visa.steps.length - 1 && (
                                <div className="w-0.5 h-full bg-blue-200 my-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <p className="text-gray-700 font-medium">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">Required Documents</h2>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {visa.documents.map((doc, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                            <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">{doc}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Premium Card */}
              {visa.hasPremium && (
                <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5" />
                      <span className="font-semibold">Premium Guide</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">Complete DIY Guide</h3>
                    
                    <p className="text-white/90 mb-4 text-sm">
                      Get our comprehensive 40+ page guide with step-by-step instructions, 
                      document templates, and expert tips.
                    </p>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold">$149</span>
                      <span className="line-through text-white/60">$499</span>
                      <Badge className="bg-white/20 text-white">70% OFF</Badge>
                    </div>
                    
                    <Button 
                      className="w-full bg-white text-amber-600 hover:bg-gray-100"
                      onClick={() => navigate('/premium')}
                    >
                      Get Instant Access
                    </Button>
                    
                    <p className="text-xs text-white/80 text-center mt-4">
                      100% money-back guarantee
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-gray-900">Quick Actions</h3>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/lawyers')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Find a Migration Lawyer
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Checklist
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Community
                  </Button>
                </CardContent>
              </Card>

              {/* Related Visas */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Related Visas</h3>
                  
                  <div className="space-y-3">
                    <button 
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => navigate('/visas/309')}
                    >
                      <p className="font-medium">Partner Visa (Offshore)</p>
                      <p className="text-sm text-gray-500">Subclass 309/100</p>
                    </button>
                    
                    <button 
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => navigate('/visas/300')}
                    >
                      <p className="font-medium">Prospective Marriage</p>
                      <p className="text-sm text-gray-500">Subclass 300</p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisaDetail;
