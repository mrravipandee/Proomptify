'use client';

import CategoriesPreview from '@/components/ui/CategoriesPreview';
import Hero from '@/components/ui/Hero';
import HowItWorks from '@/components/ui/HowItWorks';
import PricingTeaser from '@/components/ui/PricingTeaser';
import ProblemSolution from '@/components/ui/ProblemSolution';
import WhyProomptify from '@/components/ui/WhyProomptify';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiSearch, FiCopy, FiTrendingUp, FiUsers, FiZap } from 'react-icons/fi';

export default function HomePage() {
  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    // You can add toast notification here
  };

  const trendingPrompts = [
    {
      id: 1,
      title: "Instagram Caption Generator",
      description: "Generate engaging captions for your posts",
      category: "Social Media",
      uses: "12.5K",
      icon: <FiTrendingUp className="text-purple-500" />
    },
    {
      id: 2,
      title: "LinkedIn Post Writer",
      description: "Professional posts for business networking",
      category: "Professional",
      uses: "8.7K",
      icon: <FiUsers className="text-blue-500" />
    },
    {
      id: 3,
      title: "YouTube Script Outline",
      description: "Structured scripts for video content",
      category: "Video",
      uses: "15.2K",
      icon: <FiZap className="text-green-500" />
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Problem Solution Section */}
      <ProblemSolution />

      {/* How it work */}
      <HowItWorks />

      {/* Categories Preview */}
      <CategoriesPreview />

      {/* Why Proomptify */}
      <WhyProomptify />

      {/* Pricing Teaser */}
      <PricingTeaser />
      
    </main>
  );
}