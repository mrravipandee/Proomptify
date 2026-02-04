// API base URL - adjust this based on your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  
  // Check if response is JSON
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server error. Please make sure backend is running on port 5500');
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
};

// Helper function to handle fetch errors
const handleFetchError = (error: unknown): never => {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new Error('Cannot connect to server. Please start the backend server.');
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('An unexpected error occurred');
};

// API utility functions
export const api = {
  // Register a new user
  register: async (data: {
    name: string;
    email: string;
    phone: string;
    instaHandle: string;
    password: string;
    gender?: 'male' | 'female' | 'other';
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await handleResponse(response);
    } catch (error) {
      handleFetchError(error);
    }
  },

  // Verify email with OTP
  verifyEmail: async (email: string, otp: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      return await handleResponse(response);
    } catch (error) {
      handleFetchError(error);
    }
  },

  // Resend OTP
  resendOTP: async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return await handleResponse(response);
    } catch (error) {
      handleFetchError(error);
    }
  },

  // Login
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      return await handleResponse(response);
    } catch (error) {
      handleFetchError(error);
    }
  },

  // Get current user
  getCurrentUser: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      handleFetchError(error);
    }
  },
};
