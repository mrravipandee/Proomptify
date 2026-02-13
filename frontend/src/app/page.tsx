'use client';

import CategoriesPreview from '@/components/ui/CategoriesPreview';
import Hero from '@/components/ui/Hero';
import HowItWorks from '@/components/ui/HowItWorks';
import PricingTeaser from '@/components/ui/PricingTeaser';
import ProblemSolution from '@/components/ui/ProblemSolution';
import WhyProomptify from '@/components/ui/WhyProomptify';


export default function HomePage() {
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