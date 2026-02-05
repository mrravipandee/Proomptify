'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, ChevronRight, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import UsageLimitModal from '../UsageLimitModal';
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
  imgUrl,
  steps,
  category,
  estimatedTime,
  usageCount
}) => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleCardClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If user is not logged in, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // If user is logged in, track usage
    if (user && token) {
      try {
        const response = await api.trackUsage(user.id, token);
        
        // Check if limit reached
        if (!response.allowed || response.message === 'FREE_LIMIT_REACHED') {
          setShowLimitModal(true);
          return;
        }

        // If allowed, navigate to detail page
        router.push(`/prompts/${category}/${id}`);
      } catch (error: any) {
        console.error('Usage tracking error:', error);
        
        // Check if error indicates limit reached
        if (error.message && (error.message.includes('FREE_LIMIT_REACHED') || error.message.includes('403'))) {
          setShowLimitModal(true);
          return;
        }
        
        // For other errors, still allow navigation (graceful degradation)
        router.push(`/prompts/${category}/${id}`);
      }
    }
  };

  return (
    <>
      <div onClick={handleCardClick}>
        <motion.div
          whileHover={{ y: -5 }}
          className="relative group w-80 flex-shrink-0 bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl overflow-hidden my-2 flex flex-col transition-all duration-300 h-[420px] cursor-pointer"
        >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Image Section - Top */}
        {imgUrl && (
          <div className="relative w-full h-48 overflow-hidden bg-white/5">
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

        {/* Content Section - Bottom */}
        <div className="relative z-10 p-5 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-white font-bold text-xl mb-3 line-clamp-2">{title}</h3>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/10 text-gray-300 border border-white/5">
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-3">
            {description}
          </p>

          {/* Steps */}
          {steps && steps.length > 0 && (
            <div className="mb-3 flex items-center gap-1 text-xs text-gray-400 flex-wrap">
              {steps.slice(0, 2).map((step, i) => (
                <div key={i} className="flex items-center">
                  <span className="text-purple-400 font-medium">{step}</span>
                  {i < Math.min(steps.length, 2) - 1 && <ChevronRight size={12} className="mx-1" />}
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
          </div>
        </div>
      </motion.div>
      </div>

      {/* Usage Limit Modal */}
      <UsageLimitModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)} 
      />
    </>
  );
};

export default PromptCard;