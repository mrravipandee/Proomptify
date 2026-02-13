'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import UsageLimitModal from '../UsageLimitModal';
import type { Prompt } from '@/types';

// --- Internal Types ---
export interface PromptProps extends Omit<Prompt, 'referenceUrl' | 'tags'> {
  tags: string | string[]; 
  onCopy?: () => void;
}

const PromptCard: React.FC<PromptProps> = ({ 
  _id,
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

  // Helper to safely parse and clean tags
  const cleanTags = useMemo((): string[] => {
    if (!tags) return [];

    let parsed: string[] = [];

    if (Array.isArray(tags)) {
      parsed = tags;
    } else if (typeof tags === 'string') {
      try {
        const result = JSON.parse(tags);
        if (Array.isArray(result)) {
          parsed = result;
        } else {
          parsed = [String(result)];
        }
      } catch {
        const cleaned = tags.replace(/[\[\]"']/g, ''); 
        parsed = cleaned.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    return parsed;
  }, [tags]);

  const handleCardClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (user && token) {
      try {
        await api.trackUsage(_id);
        router.push(`/prompts/${category}/${_id}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message.includes('FREE_LIMIT_REACHED') || 
              error.message.includes('limit') || 
              error.message.includes('403')) {
            setShowLimitModal(true);
            return;
          }
        }
        console.error('Usage tracking error:', error);
        router.push(`/prompts/${category}/${_id}`);
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
            {usageCount !== undefined && (
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg text-[10px] font-medium bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
                <TrendingUp size={12} />
                {usageCount.toLocaleString()} uses
              </div>
            )}
            
          </div>
        )}

        {/* Content Section - Bottom */}
        <div className="relative z-10 p-5 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-white font-bold text-xl mb-3 line-clamp-2">{title}</h3>
          
          {/* --- TAGS SECTION UPDATED --- */}
          <div className="flex flex-wrap gap-2 mb-4">
            {cleanTags.length > 0 ? (
              cleanTags.slice(0, 3).map((tag, i) => (
                <span 
                  key={`${tag}-${i}`} 
                  // UPDATED CLASSNAME: Matches screenshot style
                  // bg-white/10 for dark grey look, rounded-lg for soft corners (not full pill), text-gray-300
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-colors capitalize"
                >
                  {tag}
                </span>
              ))
            ) : (
              // Default demo tags matching the new style
              <>
                <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-colors">
                  Demo
                </span>
                <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-colors">
                  Preview
                </span>
              </>
            )}
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

          {/* Bottom section */}
          <div className="mt-auto flex items-center justify-between gap-3">
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

      <UsageLimitModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)} 
      />
    </>
  );
};

export default PromptCard;