'use client';

import { motion } from 'framer-motion';
import type { CategoryId } from '@/types';
import { 
  Flame, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Palette, 
  Bot, 
  FileText, 
  PenTool,
  Music,
  Twitter,
  type LucideIcon 
} from 'lucide-react';

// --- Internal Types ---
interface Category {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
}

interface CategoryBarProps {
  activeCategory: CategoryId;
  setActiveCategory: (id: CategoryId) => void;
}

// --- Categories ---
const categories: Category[] = [
  { id: 'all', label: 'Trending', icon: Flame },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'tiktok', label: 'TikTok', icon: Music },
  { id: 'twitter', label: 'Twitter', icon: Twitter },
  { id: 'aiart', label: 'AI Art', icon: Palette },
  { id: 'chatgpt', label: 'ChatGPT', icon: Bot },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'bio', label: 'Bio', icon: PenTool },
];

const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="w-full pt-24 py-4 bg-[#050520] border-b border-white/5">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 min-w-max pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Z-10 ensures text sits on top of the background animation */}
                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                  <Icon size={16} />
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;