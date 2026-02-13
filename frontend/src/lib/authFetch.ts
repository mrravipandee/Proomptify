'use client';

import { useRouter } from 'next/navigation';

/**
 * Get authorization headers with JWT token from localStorage
 * Safe for SSR - checks for window object before accessing localStorage
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Only access localStorage in browser environment
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('❌ Failed to read token from localStorage:', error);
    }
  }

  return headers;
}

/**
 * Fetch wrapper with automatic JWT authentication
 * 
 * Features:
 * - Automatically reads JWT from localStorage
 * - Adds Authorization: Bearer <token> header
 * - Handles 401 responses by clearing auth and redirecting to /login
 * - Works for GET, POST, PUT, DELETE, PATCH
 * - SSR-safe (checks for window)
 * 
 * Usage:
 * const response = await authFetch('/api/users/me');
 * const data = await response.json();
 * 
 * For POST with body:
 * const response = await authFetch('/api/payments/create-session', {
 *   method: 'POST',
 *   body: JSON.stringify({ plan: 'yearly' })
 * });
 * const result = await response.json();
 */
export async function authFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get auth headers with token
  const authHeaders = getAuthHeaders();

  // Merge with user-provided headers
  const headers: Record<string, string> = { ...authHeaders };
  
  if (typeof options.headers === 'object' && options.headers !== null) {
    const userHeaders = Object.entries(options.headers as Record<string, unknown>)
      .filter(([, value]) => typeof value === 'string')
      .reduce((acc, [key, value]) => {
        acc[key] = value as string;
        return acc;
      }, {} as Record<string, string>);
    Object.assign(headers, userHeaders);
  }

  // Make request with merged headers
  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - clear auth and redirect to login
  if (response.status === 401) {
    console.warn('⚠️ 401 Unauthorized - clearing auth and redirecting to login');

    // Clear stored authentication data
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
      } catch (error) {
        console.error('❌ Failed to clear storage:', error);
      }

      // Redirect to login
      window.location.href = '/login';
    }

    throw new Error('Unauthorized - redirecting to login');
  }

  // Handle other error responses
  if (!response.ok) {
    const errorMsg = `HTTP ${response.status}: ${response.statusText}`;
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  return response;
}

/**
 * Hook for using authFetch inside client components with Next.js router
 * 
 * Usage:
 * const { authFetch } = useAuthFetch();
 * const response = await authFetch('/api/users/me');
 * const data = await response.json();
 */
export function useAuthFetch() {
  const router = useRouter();

  const fetchWithAuth = async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    try {
      const response = await authFetch(endpoint, options);
      return response;
    } catch (error) {
      // If it's a 401, authFetch already handled redirect
      // But we can use router here if needed for smoother transition
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/login');
      }
      throw error;
    }
  };

  return { authFetch: fetchWithAuth };
}

/**
 * Convenient API methods with automatic JSON parsing
 * 
 * Usage:
 * const user = await api.get('/api/users/me');
 * const result = await api.post('/api/payments/create-session', { plan: 'yearly' });
 * await api.delete('/api/prompts/123');
 */
export const api = {
  /**
   * GET request - returns parsed JSON
   * @example const user = await api.get('/api/users/me');
   */
  get: async (endpoint: string): Promise<unknown> => {
    const response = await authFetch(endpoint, { method: 'GET' });
    return response.json();
  },

  /**
   * POST request - returns parsed JSON
   * @example const result = await api.post('/api/payments/create-session', { plan: 'yearly' });
   */
  post: async (endpoint: string, body: Record<string, unknown>): Promise<unknown> => {
    const response = await authFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response.json();
  },

  /**
   * PUT request - returns parsed JSON
   * @example await api.put('/api/prompts/123', { title: 'Updated Title' });
   */
  put: async (endpoint: string, body: Record<string, unknown>): Promise<unknown> => {
    const response = await authFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return response.json();
  },

  /**
   * DELETE request - returns parsed JSON
   * @example await api.delete('/api/prompts/123');
   */
  delete: async (endpoint: string): Promise<unknown> => {
    const response = await authFetch(endpoint, { method: 'DELETE' });
    return response.json();
  },

  /**
   * PATCH request - returns parsed JSON
   * @example await api.patch('/api/users/me', { email: 'new@email.com' });
   */
  patch: async (endpoint: string, body: Record<string, unknown>): Promise<unknown> => {
    const response = await authFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return response.json();
  },
};

