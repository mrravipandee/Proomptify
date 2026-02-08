'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiAlertCircle, FiLoader, FiZap, FiHome } from 'react-icons/fi';

interface PlanData {
  plan: string;
  planExpiresAt: string | null;
  isActive: boolean;
}

type PageState = 'processing' | 'success' | 'error' | 'timeout';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [state, setState] = useState<PageState>('processing');
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const MAX_RETRIES = 5;
  const RETRY_INTERVAL = 3000; // 3 seconds

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!token || !user?.id) {
      router.push('/login');
      return;
    }

    const checkPlanStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api';
        const response = await fetch(`${apiUrl}/payments/plan/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch plan status');
        }

        const data = await response.json();
        console.log('Plan status:', data);

        // Check if plan is upgraded (not free)
        if (data.plan && data.plan !== 'free') {
          console.log('✅ Payment successful! Plan upgraded to:', data.plan);
          setPlanData(data);
          setState('success');
          return true; // Payment successful
        }

        return false; // Still processing
      } catch (err) {
        console.error('Error checking plan status:', err);
        setError(err instanceof Error ? err.message : 'Failed to check plan status');
        return false;
      }
    };

    // Initial check
    const initialCheck = async () => {
      const success = await checkPlanStatus();
      if (success) return;

      // Start polling if not successful
      let currentRetry = 0;
      const pollInterval = setInterval(async () => {
        currentRetry++;
        setRetryCount(currentRetry);

        console.log(`Retry ${currentRetry}/${MAX_RETRIES}`);

        const success = await checkPlanStatus();

        if (success || currentRetry >= MAX_RETRIES) {
          clearInterval(pollInterval);
          if (currentRetry >= MAX_RETRIES && !success) {
            console.log('❌ Max retries reached without successful payment');
            setState('timeout');
          }
        }
      }, RETRY_INTERVAL);
    };

    initialCheck();
  }, [user?.id, token, router]);

  return (
    <div className="min-h-screen bg-[#050520] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Processing State */}
        {state === 'processing' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 bg-[#050520] rounded-full flex items-center justify-center">
                  <FiLoader className="w-10 h-10 text-purple-400 animate-spin" />
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Processing</h1>
              <p className="text-gray-400">
                Please wait while we confirm your payment...
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400">
                Checking payment status {retryCount > 0 ? `(Attempt ${retryCount}/${MAX_RETRIES})` : ''}
              </p>
              <div className="mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-300"
                  style={{ width: `${(retryCount / MAX_RETRIES) * 100}%` }}
                ></div>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              This may take a few moments. Please don&apos;t close this page.
            </p>
          </div>
        )}

        {/* Success State */}
        {state === 'success' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full">
                <FiCheckCircle className="w-16 h-16 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-gray-400">
                Your plan has been upgraded to{' '}
                <span className="font-semibold text-purple-400 capitalize">
                  {planData?.plan}
                </span>
              </p>
            </div>

            {planData?.planExpiresAt && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Plan Expires</p>
                <p className="text-lg font-semibold">
                  {new Date(planData.planExpiresAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}

            {planData?.plan === 'lifetime' && (
              <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-4">
                <p className="text-purple-300 font-semibold">♾️ Lifetime Access</p>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <Link
                href="/prompts"
                className="w-full block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all text-center flex items-center justify-center gap-2"
              >
                <FiZap className="w-5 h-5" />
                Explore Prompts
              </Link>
              <Link
                href="/dashboard"
                className="w-full block bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all border border-white/20 text-center flex items-center justify-center gap-2"
              >
                <FiHome className="w-5 h-5" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Timeout State */}
        {state === 'timeout' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-yellow-500/20 p-4 rounded-full border border-yellow-500/50">
                <FiAlertCircle className="w-16 h-16 text-yellow-400" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Verification in Progress</h1>
              <p className="text-gray-400">
                Your payment is being processed. This can take a few minutes.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-300 font-semibold mb-2">What to do:</p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>✓ Check your email for payment confirmation</li>
                <li>✓ Your plan will be activated shortly</li>
                <li>✓ You can check your dashboard for status</li>
              </ul>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={() => {
                  setState('processing');
                  setRetryCount(0);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Check Again
              </button>
              <Link
                href="/dashboard"
                className="w-full block bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all border border-white/20 text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-red-500/20 p-4 rounded-full border border-red-500/50">
                <FiAlertCircle className="w-16 h-16 text-red-400" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">Something Went Wrong</h1>
              <p className="text-gray-400">{error || 'Failed to verify your payment'}</p>
            </div>

            <div className="space-y-3 pt-4">
              <Link
                href="/contact"
                className="w-full block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all text-center"
              >
                Contact Support
              </Link>
              <Link
                href="/pricing"
                className="w-full block bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all border border-white/20 text-center"
              >
                Back to Pricing
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
