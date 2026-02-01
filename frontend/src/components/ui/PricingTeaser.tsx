'use client';

import Link from 'next/link';

const PricingTeaser = () => {
  return (
    <section className="py-24 bg-[#050520] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400">Start for free, upgrade when you scale.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
          
          {/* FREE PLAN */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
            <div className="text-3xl font-bold text-white mb-6">₹0 <span className="text-sm font-normal text-gray-500">/ forever</span></div>
            <ul className="space-y-4 mb-8 text-gray-300 text-sm">
              <li className="flex items-center gap-2">✅ <span className="text-white font-medium">10 Prompts</span> per day</li>
              <li className="flex items-center gap-2">✅ Access to Basic Categories</li>
              <li className="flex items-center gap-2">✅ Copy-Paste functionality</li>
            </ul>
            <Link href="/prompts" className="block w-full py-3 text-center bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors">
              Start Free
            </Link>
          </div>

          {/* PRO PLAN */}
          <div className="flex-1 bg-gradient-to-b from-purple-900/40 to-black border border-purple-500/30 rounded-2xl p-8 relative">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
            <h3 className="text-xl font-bold text-white mb-2">Pro Creator</h3>
            <div className="text-3xl font-bold text-white mb-6">₹19 <span className="text-sm font-normal text-gray-500">/ year</span></div>
            <ul className="space-y-4 mb-8 text-gray-300 text-sm">
              <li className="flex items-center gap-2">🚀 <span className="text-purple-300 font-medium">Unlimited</span> Prompts</li>
              <li className="flex items-center gap-2">⚡ Early Access to Viral Trends</li>
              <li className="flex items-center gap-2">💎 Premium Support</li>
            </ul>
            <Link href="/pricing" className="block w-full py-3 text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white rounded-lg font-bold shadow-lg shadow-purple-900/20 transition-all">
              Go Unlimited
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PricingTeaser;