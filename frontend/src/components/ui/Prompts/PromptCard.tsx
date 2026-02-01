'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

// --- Internal Types ---
export interface PromptProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  promptText: string;
  onCopy?: () => void; // Optional callback when copied
}

const PromptCard: React.FC<PromptProps> = ({ 
  title, 
  description, 
  tags, 
  promptText, 
  onCopy 
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      if (onCopy) onCopy(); // Trigger parent usage tracker if provided
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative group w-80 flex-shrink-0 bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 h-[280px]"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />

      <div className="relative z-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, i) => (
                <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/10 text-gray-300 border border-white/5">
                    {tag}
                </span>
            ))}
        </div>
        
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-400 text-sm line-clamp-4 leading-relaxed">
          {description}
        </p>
      </div>

      <button
        onClick={handleCopy}
        className={`relative z-10 w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all mt-4 ${
          isCopied
            ? 'bg-green-500 text-white shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)]'
            : 'bg-white text-black hover:bg-gray-200'
        }`}
      >
        {isCopied ? (
          <>
            <Check size={16} />
            Copied!
          </>
        ) : (
          <>
            <Copy size={16} />
            Copy Prompt
          </>
        )}
      </button>
    </motion.div>
  );
};

export default PromptCard;