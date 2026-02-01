'use client';

import { motion } from 'framer-motion';

const ProblemSolution = () => {
  const comparisonItems = [
    {
      problem: "Writing good AI prompts is hard",
      solution: "Ready-to-use templates",
    },
    {
      problem: "Most prompts online don’t give real results",
      solution: "Tested on real platforms",
    },
    {
      problem: "Creators waste time experimenting",
      solution: "Copy & use instantly",
    },
  ];

  return (
    <section className="py-24 bg-[#050520] relative overflow-hidden">
      {/* Background Decor - Subtle Red/Green Glows */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Old Way vs. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">The Proomptify Way</span>
          </h2>
          <p className="text-gray-400">Stop guessing. Start creating.</p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center max-w-5xl mx-auto">
          
          {/* --- LEFT COLUMN: THE PROBLEM --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 border border-white/5 rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 to-transparent"></div>
            <h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
              <span className="p-2 rounded-lg bg-red-500/10 text-red-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </span>
              The Struggle
            </h3>
            
            <div className="space-y-6">
              {comparisonItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 opacity-60">
                  <div className="mt-1 min-w-[20px]">
                    <div className="w-5 h-5 rounded-full border border-red-500/30 flex items-center justify-center">
                       <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-300 font-medium">{item.problem}</p>
                </div>
              ))}
            </div>
          </motion.div>


          {/* --- CENTER: ARROW INDICATOR --- */}
          <div className="flex justify-center md:rotate-0 rotate-90 my-4 md:my-0">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>


          {/* --- RIGHT COLUMN: THE SOLUTION --- */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-b from-purple-900/20 to-blue-900/10 border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden shadow-2xl shadow-purple-900/20"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="p-2 rounded-lg bg-green-500/20 text-green-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </span>
              The Solution
            </h3>

            <div className="space-y-6">
              {comparisonItems.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 min-w-[20px]">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                       <svg className="w-3 h-3 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                  <p className="text-white font-semibold text-lg">{item.solution}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;