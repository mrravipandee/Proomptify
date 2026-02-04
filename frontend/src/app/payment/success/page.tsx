'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCheckCircle, FiHome, FiZap } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'premium';

  return (
    <div className="min-h-screen bg-[#050520] text-white flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Welcome to Proomptify {plan.charAt(0).toUpperCase() + plan.slice(1)}! 🎉
            </p>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
          >
            <p className="text-gray-300 mb-2">
              Your payment has been processed successfully and your account has been upgraded.
            </p>
            <p className="text-gray-400 text-sm">
              You now have full access to all premium prompts and features!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/prompts"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30"
            >
              <FiZap className="w-5 h-5" />
              Explore Prompts
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20"
            >
              <FiHome className="w-5 h-5" />
              Go Home
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-500 mt-8"
          >
            A confirmation email has been sent to your registered email address.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
