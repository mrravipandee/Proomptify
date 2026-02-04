'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FiMail, FiCheck } from 'react-icons/fi';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('verifyEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      await api.verifyEmail(email, otpCode);
      
      setIsVerified(true);
      localStorage.removeItem('verifyEmail');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;

    try {
      await api.resendOTP(email);
      setCanResend(false);
      setResendTimer(60);
      setError('');
      setOtp(['', '', '', '', '', '']);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-[#050520] text-white flex items-center justify-center py-12 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          {!isVerified ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Verify Your Email
                </h1>
                <p className="text-gray-400">
                  We&apos;ve sent a 6-digit code to your email
                </p>
                {email && (
                  <p className="text-purple-400 font-medium mt-1">
                    {email}
                  </p>
                )}
              </div>

              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                  Enter OTP Code
                </label>
                <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-red-400 text-sm text-center mt-4">{error}</p>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={isVerifying || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 mb-6"
              >
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">
                  Didn&apos;t receive the code?
                </p>
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-gray-500">
                    Resend in {resendTimer}s
                  </p>
                )}
              </div>

              {/* Back to Sign In */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
                >
                  ← Back to Login
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FiCheck className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2 text-white">
                  Email Verified!
                </h2>
                <p className="text-gray-400 mb-6">
                  Your account has been successfully verified
                </p>
                <div className="flex items-center justify-center gap-2 text-purple-400">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                  <span>Redirecting to sign in...</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Having trouble? <Link href="#" className="text-purple-400 hover:text-purple-300">Contact Support</Link>
        </p>
      </motion.div>
    </div>
  );
}
