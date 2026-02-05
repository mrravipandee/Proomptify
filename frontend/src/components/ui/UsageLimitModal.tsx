'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UsageLimitModal({ isOpen, onClose }: UsageLimitModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onClose();
    router.push('/pricing');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white text-center mb-3">
                Usage Limit Reached!
              </h2>

              {/* Message */}
              <p className="text-gray-200 text-center mb-6 leading-relaxed">
                You've reached your free tier limit. Upgrade to Premium to unlock unlimited access to all prompts and features!
              </p>

              {/* Benefits */}
              <div className="bg-white/10 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Unlimited prompt access</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Early access to new prompts</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleUpgrade}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30"
                >
                  Upgrade to Premium
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300 border border-white/20"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
