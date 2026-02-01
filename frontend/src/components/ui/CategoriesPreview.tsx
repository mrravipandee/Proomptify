'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  { id: 'insta', name: 'Instagram', desc: 'Reels, Captions & Bio', gradient: 'from-pink-500 to-orange-500' },
  { id: 'linkedin', name: 'LinkedIn', desc: 'Viral Posts & About', gradient: 'from-blue-600 to-blue-400' },
  { id: 'youtube', name: 'YouTube', desc: 'Scripts & Titles', gradient: 'from-red-600 to-red-500' },
  { id: 'art', name: 'AI Art', desc: 'Midjourney & Dall-E', gradient: 'from-purple-500 to-indigo-500' },
  { id: 'chatgpt', name: 'ChatGPT', desc: 'Productivity Hacks', gradient: 'from-green-500 to-emerald-500' },
];

const CategoriesPreview = () => {
  return (
    <section className="py-20 bg-[#050520]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Browse by Platform</h2>
            <p className="text-gray-400">Find the perfect prompt for your needs.</p>
          </div>
          <Link href="/prompts" className="hidden md:flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            View all categories <span className="ml-2">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <Link key={cat.id} href={`/prompts?category=${cat.id}`} className="group">
              <motion.div
                whileHover={{ y: -5 }}
                className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:bg-white/10"
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.gradient} mb-4 flex items-center justify-center shadow-lg`}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 4 4h-3v4h-2z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{cat.desc}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
            <Link href="/prompts" className="text-purple-400 font-medium">View all categories →</Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesPreview;