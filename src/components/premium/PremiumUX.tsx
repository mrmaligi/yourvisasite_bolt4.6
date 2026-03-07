import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Sparkles, ChevronRight, CheckCircle, Timer, Shield, Users, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface PremiumLockOverlayProps {
  title: string;
  progress?: number;
  onUnlock: () => void;
  price?: number;
  originalPrice?: number;
}

export const PremiumLockOverlay: React.FC<PremiumLockOverlayProps> = ({
  title,
  progress = 30,
  onUnlock,
  price = 149,
  originalPrice = 499
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59 });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59 };
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent z-10 pointer-events-none h-48 bottom-0" />

      {/* Lock Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: isHovered ? 1.02 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl border-2 border-amber-200 p-6 max-w-md mx-auto"
        >
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Free Preview</span>
              <span className="font-semibold text-amber-600">{progress}% viewed</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              />
            </div>
          </div>

          {/* Lock Icon */}
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
            Continue Reading {title}
          </h3>
          
          <p className="text-gray-600 text-center text-sm mb-4">
            Unlock the complete guide with step-by-step instructions, templates, and expert tips.
          </p>

          {/* Pricing */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-gray-400 line-through text-lg">${originalPrice}</span>
            <span className="text-3xl font-bold text-gray-900">${price}</span>
            <Badge className="bg-red-500 text-white">70% OFF</Badge>
          </div>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-2 text-sm text-red-600 mb-4">
            <Timer className="w-4 h-4" />
            <span>Sale ends in {timeLeft.hours}h {timeLeft.minutes}m</span>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onUnlock}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Unlock Now
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> Secure
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> 100% Guarantee
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> 500+ Users
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Floating Action Button for quick unlock
export const FloatingUnlockButton: React.FC<{ onClick: () => void; price: number }> = ({ onClick, price }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Button
            onClick={onClick}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-6 rounded-full shadow-2xl hover:shadow-amber-500/25 flex items-center gap-3"
          >
            <Unlock className="w-5 h-5" />
            <span className="font-semibold">Unlock Guide - ${price}</span>
            <Badge className="bg-white text-amber-600 ml-2">70% OFF</Badge>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Breadcrumb Navigation
export const Breadcrumb: React.FC<{ items: { label: string; href?: string }[] }> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400">/</span>}
          {item.href ? (
            <a href={item.href} className="hover:text-blue-600 transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Progress Stepper for multi-step content
export const ProgressStepper: React.FC<{ 
  steps: string[]; 
  currentStep: number;
  completedSteps: number[];
}> = ({ steps, currentStep, completedSteps }) => {
  return (
    <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isCurrent = index === currentStep;
        
        return (
          <div key={index} className="flex items-center">
            <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'mr-4' : ''}`}>
              <motion.div
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted ? '#22C55E' : isCurrent ? '#F59E0B' : '#E5E7EB'
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  isCompleted ? 'bg-green-500' : isCurrent ? 'bg-amber-500' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </motion.div>
              <span className={`text-xs mt-1 whitespace-nowrap ${
                isCurrent ? 'text-amber-600 font-semibold' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${
                isCompleted ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Testimonial Card for pricing section
export const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  role: string;
  rating: number;
}> = ({ quote, author, role, rating }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
      <p className="text-gray-700 text-sm mb-3 italic">"{quote}"</p>
      
      <div>
        <p className="font-semibold text-gray-900 text-sm">{author}</p>
        <p className="text-gray-500 text-xs">{role}</p>
      </div>
    </div>
  );
};

export default {
  PremiumLockOverlay,
  FloatingUnlockButton,
  Breadcrumb,
  ProgressStepper,
  TestimonialCard
};
