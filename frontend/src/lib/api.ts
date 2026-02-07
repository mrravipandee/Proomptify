// API base URL - adjust this based on your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api';

import {
  User,
  Admin,
  DashboardStats,
  Payment,
  RevenueStats,
  Blog,
  BlogFormData,
  Prompt,
  CreatePromptRequest,
  ApiResponse,
  PaginatedResponse,
  LoginResponse,
  CreateAdminRequest,
  UpdateAdminRoleRequest,
} from '@/types';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  
  // Check if response is JSON
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server error. Please make sure backend is running on port 3500');
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
};

// Helper to get auth headers
const getAuthHeaders = (token: string): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// ============================================
// PUBLIC AUTH APIs
// ============================================

export const api = {
  // Register a new user
  register: async (data: {
    name: string;
    email: string;
    phone: string;
    instaHandle: string;
    password: string;
    gender?: 'male' | 'female' | 'other';
  }): Promise<ApiResponse<{ message: string }>> => {
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
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // Verify email with OTP
  verifyEmail: async (email: string, otp: string): Promise<ApiResponse<LoginResponse>> => {
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
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // Resend OTP
  resendOTP: async (email: string): Promise<ApiResponse<{ message: string }>> => {
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
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await handleResponse(response);
      // Backend returns { message, token, user } directly, not wrapped in data
      return {
        token: result.token,
        user: result.user,
      };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // Get current user
  getCurrentUser: async (token: string): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // Track usage
  trackUsage: async (userId: string, token: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/usage/track`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ userId }),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // Get all prompts (public)
  getPrompts: async (): Promise<Prompt[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await handleResponse(response);
      
      // Transform API response to match Prompt type (_id to id)
      return data.map((prompt: { _id: string; [key: string]: unknown }) => ({
        ...prompt,
        id: prompt._id,
      })) as Prompt[];
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // ============================================
  // CATEGORY APIs
  // ============================================

  // Get all categories (public)
  getCategories: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/categories?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // Get single category by ID (public)
  getCategory: async (categoryId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },
};

// ============================================
// ADMIN APIs
// ============================================

export const adminApi = {
  // ============================================
  // DASHBOARD
  // ============================================
  
  getStats: async (token: string): Promise<ApiResponse<DashboardStats>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // ============================================
  // USER MANAGEMENT
  // ============================================
  
  getUsers: async (
    token: string,
    page = 1,
    limit = 10,
    filters?: {
      search?: string;
      plan?: string;
      isBlocked?: boolean;
      isVerified?: boolean;
    }
  ): Promise<PaginatedResponse<User>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.plan && { plan: filters.plan }),
        ...(filters?.isBlocked !== undefined && { isBlocked: filters.isBlocked.toString() }),
        ...(filters?.isVerified !== undefined && { isVerified: filters.isVerified.toString() }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  getUserById: async (token: string, userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  blockUser: async (token: string, userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/block`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  unblockUser: async (token: string, userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unblock`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // ============================================
  // BILLING & PAYMENTS
  // ============================================
  
  getPayments: async (
    token: string,
    page = 1,
    limit = 10,
    filters?: {
      status?: string;
      plan?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
    }
  ): Promise<PaginatedResponse<Payment>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.plan && { plan: filters.plan }),
        ...(filters?.startDate && { startDate: filters.startDate }),
        ...(filters?.endDate && { endDate: filters.endDate }),
        ...(filters?.search && { search: filters.search }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/payments?${params}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  getRevenueStats: async (token: string): Promise<ApiResponse<RevenueStats>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/payments/stats`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  getPaymentsByUser: async (token: string, userId: string): Promise<ApiResponse<Payment[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/payments/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // ============================================
  // BLOG MANAGEMENT
  // ============================================
  
  getAllBlogs: async (
    token: string,
    page = 1,
    limit = 10,
    filters?: {
      status?: string;
      search?: string;
    }
  ): Promise<PaginatedResponse<Blog>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.search && { search: filters.search }),
      });

      const response = await fetch(`${API_BASE_URL}/blogs/admin/all?${params}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  getBlogById: async (token: string, blogId: string): Promise<ApiResponse<Blog>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/admin/${blogId}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  createBlog: async (token: string, data: BlogFormData): Promise<ApiResponse<Blog>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/admin`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  updateBlog: async (token: string, blogId: string, data: Partial<BlogFormData>): Promise<ApiResponse<Blog>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/admin/${blogId}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  deleteBlog: async (token: string, blogId: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/admin/${blogId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  publishBlog: async (token: string, blogId: string): Promise<ApiResponse<Blog>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/admin/${blogId}/publish`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  unpublishBlog: async (token: string, blogId: string): Promise<ApiResponse<Blog>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/admin/${blogId}/unpublish`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  getBlogStats: async (token: string): Promise<ApiResponse<{ total: number; published: number; drafts: number }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/admin/stats`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // ============================================
  // ADMIN MANAGEMENT (super_admin only)
  // ============================================
  
  getAllAdmins: async (token: string): Promise<ApiResponse<Admin[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admins`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  createAdmin: async (token: string, data: CreateAdminRequest): Promise<ApiResponse<Admin>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admins`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  updateAdminRole: async (token: string, adminId: string, data: UpdateAdminRoleRequest): Promise<ApiResponse<Admin>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admins/${adminId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  deleteAdmin: async (token: string, adminId: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // ============================================
  // PROMPT MANAGEMENT (future implementation)
  // ============================================
  
  // Note: These endpoints assume backend prompt management APIs exist
  // Adjust URLs based on actual backend implementation
  
  getAllPrompts: async (
    token: string,
    page = 1,
    limit = 10,
    filters?: {
      status?: string;
      category?: string;
      search?: string;
    }
  ): Promise<PaginatedResponse<Prompt>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.search && { search: filters.search }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/prompts?${params}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  createPrompt: async (token: string, data: CreatePromptRequest): Promise<ApiResponse<Prompt>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/prompts`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  updatePrompt: async (token: string, promptId: string, data: Partial<CreatePromptRequest>): Promise<ApiResponse<Prompt>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/prompts/${promptId}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  deletePrompt: async (token: string, promptId: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/prompts/${promptId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // Upload image to Cloudinary
  uploadPromptImage: async (token: string, file: File): Promise<ApiResponse<{ imageUrl: string; publicId: string }>> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/upload/prompt`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  // Get available categories
  getCategories: async (token: string): Promise<ApiResponse<{ categories: string[] }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please start the backend server.');
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },
};
