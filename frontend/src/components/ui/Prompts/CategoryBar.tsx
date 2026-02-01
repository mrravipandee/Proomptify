'use client';

import { motion } from 'framer-motion';
import { 
  Flame, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Palette, 
  Bot, 
  FileText, 
  PenTool,
  LucideIcon 
} from 'lucide-react';

// --- Internal Types (Defined here to avoid errors) ---
export type CategoryId = 'all' | 'insta' | 'linkedin' | 'youtube' | 'art' | 'chatgpt' | 'resume' | 'bio';

interface Category {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
}

interface CategoryBarProps {
  activeCategory: CategoryId;
  setActiveCategory: (id: CategoryId) => void;
}

// --- Data ---
const categories: Category[] = [
  { id: 'all', label: 'Trending', icon: Flame },
  { id: 'insta', label: 'Insta Reel', icon: Instagram },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'art', label: 'AI Images', icon: Palette },
  { id: 'chatgpt', label: 'ChatGPT', icon: Bot },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'bio', label: 'Bio Gen', icon: PenTool },
];

const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="sticky top-16 md:top-20 z-40 py-4 bg-[#050520]/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
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
                <span className="relative z-10 flex items-center gap-2">
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