'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import PromptCard, { PromptProps } from './PromptCard'; // Import the Card component

// --- Internal Types ---
interface PromptSliderProps {
  title: string;
  description?: string;
  prompts: PromptProps[]; // Array of prompts
  onCopyPrompt?: () => void;
  categorySlug?: string; // Optional URL slug for the category
}

const PromptSlider: React.FC<PromptSliderProps> = ({ 
  title, 
  description, 
  prompts, 
  onCopyPrompt,
  categorySlug 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Generate category slug from title if not provided
  const slug = categorySlug || title.toLowerCase().replace(/\s+/g, '');

  return (
    <div className="py-8 border-b border-white/5 last:border-0">
      <div className="container mx-auto px-4 mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            {title}
          </h2>
          {description && <p className="text-sm text-gray-400">{description}</p>}
        </div>
        
        {/* Navigation Arrows (Desktop) */}
        <div className="hidden md:flex gap-2">
            <button 
              onClick={() => scroll(-320)} 
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll(320)} 
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 px-4 pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {prompts.map((prompt) => (
          <div key={prompt.id} className="snap-start">
             <PromptCard {...prompt} onCopy={onCopyPrompt} />
          </div>
        ))}
        
        {/* "View All" Link at the end */}
        <Link href={`/prompts/${slug}`} className="w-40 flex-shrink-0 flex items-center justify-center snap-start h-[420px]">
            <div className="flex flex-col items-center gap-3 text-gray-500 hover:text-purple-400 transition-colors group cursor-pointer">
                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-purple-400 group-hover:bg-purple-500/10 transition-all">
                    <ArrowRight size={24} />
                </div>
                <span className="text-sm font-medium">View All</span>
            </div>
        </Link>
      </div>
    </div>
  );
};

export default PromptSlider;