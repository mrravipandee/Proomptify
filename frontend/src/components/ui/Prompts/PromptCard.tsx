'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Clock, TrendingUp, ChevronRight, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Prompt } from '@/types';

// --- Internal Types ---
export interface PromptProps extends Omit<Prompt, 'referenceUrl'> {
  onCopy?: () => void; // Optional callback when copied
}

const PromptCard: React.FC<PromptProps> = ({ 
  id,
  title, 
  description, 
  tags, 
  promptText,
  imgUrl,
  steps,
  category,
  estimatedTime,
  usageCount,
  onCopy 
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // If user is not logged in, prevent navigation and redirect to login
    if (!user) {
      e.preventDefault();
      router.push('/login');
      return;
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Link href={user ? `/prompts/${category}/${id}` : '/login'} onClick={handleCardClick}>
      <motion.div
        whileHover={{ y: -5 }}
        className="relative group w-full bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl overflow-hidden my-2 flex transition-all duration-300 h-[200px] cursor-pointer"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Image Section - Left Side */}
        {imgUrl && (
          <div className="relative w-[280px] flex-shrink-0 overflow-hidden bg-white/5">
            <Image 
              src={imgUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Usage Count */}
            {usageCount && (
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg text-[10px] font-medium bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
                <TrendingUp size={12} />
                {usageCount.toLocaleString()} uses
              </div>
            )}
            
            {/* Lock overlay for non-logged in users */}
            {!user && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                <Lock size={32} className="text-white/80" />
              </div>
            )}
          </div>
        )}

        {/* Content Section - Right Side */}
        <div className="relative z-10 p-5 flex flex-col flex-1">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/10 text-gray-300 border border-white/5">
                {tag}
              </span>
            ))}
          </div>
          
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-3">
            {description}
          </p>

          {/* Steps */}
          {steps && steps.length > 0 && (
            <div className="mb-3 flex items-center gap-1 text-xs text-gray-400 flex-wrap">
              {steps.slice(0, 3).map((step, i) => (
                <div key={i} className="flex items-center">
                  <span className="text-purple-400 font-medium">{step}</span>
                  {i < Math.min(steps.length, 3) - 1 && <ChevronRight size={12} className="mx-1" />}
                </div>
              ))}
            </div>
          )}

          {/* Bottom section with time and copy button */}
          <div className="mt-auto flex items-center justify-between gap-3">
            {/* Time Estimate */}
            {estimatedTime && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={14} />
                <span>{estimatedTime}</span>
              </div>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`py-2 px-4 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                isCopied
                  ? 'bg-green-500 text-white'
                  : user 
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-white/10 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!user}
            >
              {isCopied ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default PromptCard;