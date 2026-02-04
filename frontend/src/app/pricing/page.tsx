'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCheck, FiZap, FiStar, FiTrendingUp, FiShield, FiClock } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Best for trying out Proomptify',
    features: [
      '10 prompts per week',
      'Access to all prompt categories',
      'Basic AI art prompts',
      'Community support',
      'Weekly prompt updates',
    ],
    cta: 'Get Started Free',
    popular: false,
    gradient: 'from-gray-600 to-gray-700',
  },
  {
    name: 'Yearly',
    price: '99',
    period: 'per year',
    description: 'Perfect for active creators',
    features: [
      'Everything in Free',
      'Unlimited prompts',
      'Access to advanced & trending prompts',
      'All platform prompts (Instagram, LinkedIn, YouTube, AI tools)',
      'Early access to new prompts',
      'Priority community support',
    ],
    cta: 'Start Yearly Plan',
    popular: true,
    gradient: 'from-purple-600 to-blue-600',
  },
  {
    name: 'Lifetime',
    price: '249',
    period: 'one-time',
    description: 'One-time payment, lifetime access',
    features: [
      'Everything in Yearly',
      'Unlimited lifetime access',
      'All future prompt packs included',
      'VIP support',
      'Custom prompt requests',
      'Exclusive creator community',
    ],
    cta: 'Get Lifetime Access',
    popular: false,
    gradient: 'from-yellow-600 to-orange-600',
  },
];

const benefits = [
  {
    icon: FiZap,
    title: 'Instant Access',
    description: 'Get immediate access to all prompts after purchase',
  },
  {
    icon: FiShield,
    title: 'Secure Payment',
    description: '256-bit SSL encryption for safe transactions',
  },
  {
    icon: FiClock,
    title: 'Regular Updates',
    description: 'New prompts added weekly to keep you ahead',
  },
  {
    icon: FiTrendingUp,
    title: 'Proven Results',
    description: 'Used by 10,000+ creators to grow their audience',
  },
];

export default function PricingPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planType: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (planType === 'free') {
      router.push('/prompts');
      return;
    }

    setLoading(planType);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api';
      console.log('Creating payment session for:', { planType, userId: user.id });
      
      const response = await fetch(`${API_URL}/payment/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: planType,
          userId: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment session');
      }

      const data = await response.json();
      console.log('Payment session created:', data);

      if (data.paymentUrl) {
        // Open Dodopayments checkout in new tab
        window.open(data.paymentUrl, '_blank');
      } else {
        throw new Error('No payment URL received from server');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050520] text-white pt-24 pb-20">
      {/* Header */}
      <div className="container mx-auto px-4 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your content creation journey. All plans include access to our growing library of prompts.
          </p>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-purple-500 shadow-2xl shadow-purple-500/20 scale-105'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FiStar className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">₹{plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <FiCheck className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-purple-400' : 'text-green-400'}`} />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleUpgrade(plan.name.toLowerCase())}
                disabled={loading === plan.name.toLowerCase()}
                className={`block w-full text-center py-4 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.name.toLowerCase() ? 'Processing...' : plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Proomptify?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* FAQ or Trust Section */}
      <div className="container mx-auto px-4 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-3xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-300 mb-6">
            We&apos;re here to help! Check out our FAQ or reach out to our support team.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/#faq"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/20"
            >
              View FAQ
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}