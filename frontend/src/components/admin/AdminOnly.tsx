'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * High-level admin protection component
 * - Checks if user is authenticated AND is an admin
 * - Checks if user's email matches ADMIN_EMAIL from env
 * - Redirects to login if not authenticated
 * - Redirects to dashboard if not admin
 * - Shows loading state during auth initialization
 */
export function AdminOnly({ children, fallback }: AdminOnlyProps) {
  const router = useRouter();
  const { user, initialized, isAdmin } = useAuth();

  useEffect(() => {
    // Wait for auth to initialize
    if (!initialized) return;

    // Not logged in
    if (!user) {
      router.push('/login');
      return;
    }

    // Not admin OR email doesn't match
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!isAdmin || user.email !== ADMIN_EMAIL) {
      router.push('/dashboard');
      return;
    }
  }, [user, initialized, isAdmin, router]);

  // Show loading during initialization
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050520]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show fallback if not authorized
  if (!user || !isAdmin || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen bg-[#050520]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
