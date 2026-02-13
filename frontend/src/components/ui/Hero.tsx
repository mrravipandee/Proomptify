'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useId } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: number;
  duration: number;
}

const hashSeed = (seed: string) => {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const seededRandom = (seed: number) => {
  let t = seed;
  return () => {
    t += 0x6D2B79F5;
    let result = t;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

// Helper to generate random stars
const generateStars = (count: number, rand: () => number): Star[] => {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      top: `${rand() * 70}%`, // Keep stars mostly in the upper 70%
      left: `${rand() * 100}%`,
      size: rand() * 3 + 1 + 'px',
      delay: rand() * 4,
      duration: rand() * 3 + 2,
    });
  }
  return stars;
};

const Hero = () => {
  const seed = useId();
  const stars = useMemo(() => {
    const rand = seededRandom(hashSeed(seed));
    return generateStars(40, rand);
  }, [seed]);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050520] pt-20 pb-32">
      
      {/* --- BACKGROUND EFFECTS --- */}
      
      {/* 1. Grid Pattern (Kept from previous version) */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      
      {/* 2. STARS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
            className="absolute bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
          />
        ))}
      </div>

      {/* 3. THE HALF-CIRCLE HORIZON & ANIMATED COLORS */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
        {/* The Arch Container with Shadow */}
        <motion.div 
           initial={{ opacity: 0, y: 200 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[180%] md:w-[130%] h-[60vh] md:h-[80vh] rounded-t-[100%] bg-[#050520] overflow-hidden shadow-[0_-50px_150px_-20px_rgba(139,92,246,0.3)]"
        >
            {/* Inner colored blobs that animate inside the arch */}
            <div className="relative w-full h-full blur-[100px] opacity-80">
                {/* Purple Blob */}
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], x: [-20, 20, -20] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 left-[10%] w-[50%] h-[80%] bg-purple-700/50 rounded-full" 
                />
                 {/* Pink Blob */}
                 <motion.div 
                    animate={{ scale: [1, 1.2, 1], x: [20, -20, 20] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-0 right-[10%] w-[50%] h-[70%] bg-pink-600/40 rounded-full" 
                />
                 {/* Yellow/Orange Center Blob */}
                 <motion.div 
                    animate={{ scale: [0.9, 1.1, 0.9], y: [0, -30, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] left-[35%] w-[30%] h-[60%] bg-yellow-500/30 rounded-full" 
                />
            </div>
        </motion.div>
      </div>
      
      {/* 4. Vignette Overlay to darken edges and focus center */}
      <div className="absolute inset-0 bg-[#050520] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,transparent_40%,black_100%)] z-0 pointer-events-none"></div>


      {/* --- Main Content (Kept z-10 to stay on top) --- */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        
        {/* Badge / Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-300 text-xs md:text-sm font-medium mb-6 hover:bg-white/10 transition-colors cursor-default shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          v1.0 Now Live
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
        >
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">AI Prompt Store</span> <br className="hidden md:block" />
          for Creators
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Discover trending, tested prompts for Instagram, LinkedIn, YouTube & AI tools. 
          Stop guessing—start creating with copy-paste magic.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary CTA */}
          <Link href="/prompts" className="relative group w-full sm:w-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-40 group-hover:opacity-80 transition duration-200"></div>
            <button className="relative w-full sm:w-auto px-8 py-4 bg-white text-black rounded-lg font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
              Explore Prompts
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
          </Link>

          {/* Secondary CTA */}
          <Link href="/about" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-lg font-medium text-lg hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
              How it works
            </button>
          </Link>
        </motion.div>

        {/* Social Proof / Trust Signals */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 pt-8 border-t border-white/10"
        >
            <p className="text-sm text-gray-400 mb-4">Optimized for your favorite tools</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Replaced text with simple icons for better visual balance with the new background */}
                <div className="flex items-center gap-2 text-white"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20.41 4.94l-1.9-1.9a2.5 2.5 0 0 0-3.54 0L3.23 14.78c-.39.39-.59.92-.55 1.46l.28 3.56c.04.52.47.95.99.99l3.56.28c.54.04 1.07-.16 1.46-.55L20.41 8.48a2.5 2.5 0 0 0 0-3.54zm-3.54 2.12L18.29 8.4 15.6 11.09l-1.41-1.41 2.68-2.68zM5.08 18.92l-.28-3.56 8.49-8.49 3.84 3.84-8.49 8.49-3.56-.28z"/></svg> ChatGPT</div>
                <div className="flex items-center gap-2 text-white"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> Midjourney</div>
                <div className="flex items-center gap-2 text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.68 1.68 0 0 0-1.68 1.69c0 .93.75 1.68 1.68 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg> LinkedIn</div>
                <div className="flex items-center gap-2 text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg> YouTube</div>
            </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;