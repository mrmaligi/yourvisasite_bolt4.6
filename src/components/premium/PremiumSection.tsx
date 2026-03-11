import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle, FileText, Download, ChevronRight, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

// Premium Content Section Component
export const PremiumSection = ({ 
  title, 
  description, 
  isPremium = true, 
  hasAccess = false,
  children,
  previewLength = 2,
  visaId,
  onPurchase
}: { title: string; description?: string; isPremium?: boolean; hasAccess?: boolean; children?: React.ReactNode; previewLength?: number; visaId?: string; onPurchase?: () => void; }) => {
  const [showPreview, setShowPreview] = useState(true);
  
  if (!isPremium || hasAccess) {
    return (
      <div className="space-y-4">
        {children}
      </div>
    );
  }

  // Split content for preview
  const contentArray = React.Children.toArray(children);
  const previewContent = contentArray.slice(0, previewLength);
  const lockedContent = contentArray.slice(previewLength);

  return (
    <div className="space-y-4">
      {/* Premium Badge */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="premium" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Star className="w-3 h-3 mr-1" />
          PREMIUM
        </Badge>
        <span className="text-sm text-gray-500">Complete guide with templates & checklists</span>
      </div>

      {/* Preview Content */}
      <div className="space-y-4">
        {previewContent}
      </div>

      {/* Locked Content Overlay */}
      {lockedContent.length > 0 && (
        <div className="relative">
          {/* Blurred preview of locked content */}
          <div className="blur-sm opacity-50 pointer-events-none max-h-48 overflow-hidden">
            {lockedContent.slice(0, 1)}
          </div>
          
          {/* Lock Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/90 to-transparent">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center max-w-md">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Continue Reading
              </h3>
              <p className="text-gray-600 mb-4">
                Get the complete {title} guide with step-by-step instructions, document checklists, and templates.
              </p>
              <PremiumCTA />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Premium Call-to-Action Component
export const PremiumCTA = () => {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <>
      <div className="space-y-3">
        <Button 
          onClick={() => setShowPricing(true)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6"
        >
          <Unlock className="w-5 h-5 mr-2" />
          Unlock Premium Content
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
        
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <span className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            Instant Access
          </span>
          <span className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            100% Refund Guarantee
          </span>
        </div>
      </div>

      {/* Pricing Modal */}
      <Modal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        title="Unlock Complete Partner Visa Guide"
        size="lg"
      >
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Everything you need for a successful partner visa application
          </p>
        </div>
        <PremiumPricingCard />
      </Modal>
    </>
  );
};

// Premium Pricing Card
export const PremiumPricingCard = () => {
  const features = [
    "Complete 40+ page step-by-step guide",
    "Document checklists & templates",
    "Annotated application forms",
    "Relationship evidence examples",
    "Sponsor guide & obligations",
    "Processing time updates",
    "FAQ with real case scenarios",
    "Downloadable PDF version",
    "Email support",
    "Lifetime updates"
  ];

  return (
    <Card className="border-2 border-amber-200 bg-gradient-to-b from-amber-50/50 to-white">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge className="bg-red-500 text-white">70% OFF</Badge>
          <span className="text-gray-400 line-through text-lg">$499</span>
        </div>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold text-gray-900">$149</span>
          <span className="text-gray-500">AUD</span>
        </div>
        <p className="text-green-600 text-sm mt-1">
          Save $350 today
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Features List */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">100% Success Guarantee</p>
            <p className="text-sm text-blue-700">
              If your visa is not successful (excluding health/character issues), we refund 100% of your purchase.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Get Instant Access
          </Button>
          
          <p className="text-center text-sm text-gray-500">
            One-time payment • Lifetime access • Instant download
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">500+</p>
            <p className="text-xs text-gray-500">Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">4.9/5</p>
            <p className="text-xs text-gray-500">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">98%</p>
            <p className="text-xs text-gray-500">Success Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Premium Content Card (for listing multiple guides)
export const PremiumGuideCard = ({ 
  title, 
  description, 
  price, 
  originalPrice,
  image,
  features = [],
  onClick 
}: { title: string; description: string; price: number; originalPrice?: number; image?: string | null; features?: string[]; onClick?: () => void; }) => {
  return (
    <Card className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              PREMIUM
            </Badge>
          </div>
          {originalPrice && (
            <div className="absolute top-4 left-4">
              <Badge variant="danger">
                SAVE ${originalPrice - price}
              </Badge>
            </div>
          )}
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          {originalPrice && (
            <span className="text-gray-400 line-through">${originalPrice}</span>
          )}
          <span className="text-3xl font-bold text-gray-900">${price}</span>
          <span className="text-gray-500">AUD</span>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <ul className="space-y-2">
            {features.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <Button 
          onClick={onClick}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        >
          <FileText className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

// Premium Section Page Layout
export const PremiumPageLayout = () => {
  const guides = [
    {
      title: "Partner Visa Complete Guide",
      description: "Everything you need for 820/801, 309/100, or 300 visa applications",
      price: 149,
      originalPrice: 499,
      features: [
        "40+ page comprehensive guide",
        "Step-by-step instructions",
        "Document checklists",
        "Form templates"
      ]
    },
    {
      title: "Skilled Migration Guide",
      description: "Points-tested visas (189, 190, 491) - Complete roadmap",
      price: 149,
      originalPrice: 499,
      features: [
        "Points calculator guide",
        "Skills assessment walkthrough",
        "EOI submission guide",
        "State nomination guide"
      ]
    },
    {
      title: "Student Visa Bundle",
      description: "Subclass 500 - From application to permanent residency pathway",
      price: 99,
      originalPrice: 299,
      features: [
        "Application guide",
        "GTE statement templates",
        "Post-study work options",
        "PR pathway guide"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-amber-500 text-white mb-4">
            <Star className="w-4 h-4 mr-1" />
            Premium Resources
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Expert Visa Guides
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Save thousands on migration agent fees with our comprehensive DIY visa guides. 
            Step-by-step instructions, templates, and expert support.
          </p>
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">40+</p>
              <p className="text-gray-600">Pages Each</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">500+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">98%</p>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">100%</p>
              <p className="text-gray-600">Refund Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Choose Your Visa Guide
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <PremiumGuideCard key={index} {...guide} />
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Why Choose Our Guides?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Comprehensive</h3>
              <p className="text-gray-600">Everything you need in one place. No need to search multiple sources.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Up-to-Date</h3>
              <p className="text-gray-600">Regularly updated with the latest visa requirements and processing times.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Guaranteed</h3>
              <p className="text-gray-600">100% refund if your visa isn't successful (excl. health/character).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPageLayout;
