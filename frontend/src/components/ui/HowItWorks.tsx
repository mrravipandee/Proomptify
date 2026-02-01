'use client';

import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      id: "01",
      title: "Browse",
      description: "Search trending prompts for LinkedIn, Instagram, or AI Art.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      id: "02",
      title: "Copy",
      description: "Hit the copy button. We handle the formatting for you.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: "03",
      title: "Create",
      description: "Paste into your AI tool and get perfect results instantly.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 bg-[#050520] relative">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-gray-400">Three simple steps to better content.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-purple-900/0 via-purple-500/30 to-purple-900/0 border-t border-dashed border-white/20 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Number Circle */}
                <div className="w-24 h-24 mb-6 rounded-full bg-[#050520] border border-white/10 flex items-center justify-center relative z-10 group-hover:border-purple-500/50 transition-colors duration-300 shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)]">
                  {/* Inner glowing dot */}
                  <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon */}
                  <div className="relative z-20">
                    {step.icon}
                  </div>

                  {/* Small Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white border-4 border-[#050520]">
                    {step.id}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[250px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;