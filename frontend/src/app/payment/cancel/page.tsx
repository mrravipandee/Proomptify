'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiXCircle, FiHome, FiRefreshCw } from 'react-icons/fi';

// Prevent static generation for consistency
export const dynamic = 'force-dynamic';

export default function PaymentCancelPage() {
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
          {/* Cancel Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiXCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Payment Cancelled
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Your payment was not completed
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
              Don&apos;t worry! No charges were made to your account.
            </p>
            <p className="text-gray-400 text-sm">
              You can try again whenever you&apos;re ready to upgrade.
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
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30"
            >
              <FiRefreshCw className="w-5 h-5" />
              Try Again
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20"
            >
              <FiHome className="w-5 h-5" />
              Go Home
            </Link>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-500 mt-8"
          >
            Need help? <Link href="/contact" className="text-purple-400 hover:text-purple-300 underline">Contact Support</Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
