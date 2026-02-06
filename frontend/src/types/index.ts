// types/index.ts

// ============================================
// ENUMS & UNIONS
// ============================================

export type CategoryId = 'all' | 'instagram' | 'linkedin' | 'youtube' | 'aiart' | 'chatgpt' | 'resume' | 'bio' | 'tiktok' | 'twitter';

export type UserRole = 'user' | 'admin' | 'super_admin';

export type UserPlan = 'free' | 'yearly' | 'lifetime';

export type PromptStatus = 'draft' | 'published';

export type BlogStatus = 'draft' | 'published';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

// ============================================
// BASIC INTERFACES
// ============================================

export interface Category {
  id: CategoryId;
  label: string;
  icon?: React.ElementType; // For Lucide components
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
  promptText: string;
  category: string;
  imgUrl?: string;
  steps?: string[];
  completeSteps?: string[];
  estimatedTime?: string;
  usageCount?: number;
  referenceUrl?: string | null;
  status?: PromptStatus;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// USER & ADMIN TYPES
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  instaHandle?: string;
  gender?: 'male' | 'female' | 'other';
  plan: UserPlan;
  isVerified: boolean;
  isBlocked?: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// BLOG TYPES
// ============================================

export interface Blog {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  htmlContent: string;
  coverImage?: string;
  status: BlogStatus;
  author: {
    id: string;
    name: string;
    email: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BlogFormData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  htmlContent: string;
  coverImage?: string;
  status: BlogStatus;
}

// ============================================
// BILLING & PAYMENT TYPES
// ============================================

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: UserPlan;
  amount: number; // in cents
  status: PaymentStatus;
  referenceId: string;
  paymentDate: string;
  createdAt: string;
}

export interface RevenueStats {
  totalRevenue: number; // in cents
  totalPayments: number;
  completedPayments: number;
  revenueByPlan: {
    yearly: number;
    lifetime: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
}

// ============================================
// DASHBOARD STATS
// ============================================

export interface DashboardStats {
  users?: {
    total: number;
    verified: number;
    blocked: number;
    recentSignups: number;
  };
  plans?: {
    free: number;
    yearly: number;
    lifetime: number;
    paid: number;
  };
  content?: {
    prompts: number;
    blogs?: {
      total: number;
      published: number;
      draft: number;
    };
  };
  revenue?: {
    totalInDollars: string;
    completedPayments: number;
    averageOrderValue: string;
  };
  admins?: {
    total: number;
  };
  usage?: {
    totalPromptClicks: number;
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// ============================================
// FORM & REQUEST TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateAdminRoleRequest {
  role: 'admin' | 'super_admin';
}

export interface CreatePromptRequest {
  title: string;
  description: string;
  promptText: string;
  category: string;
  tags: string[];
  imgUrl?: string;
  steps?: string[];
  completeSteps?: string[];
  estimatedTime?: string;
  referenceUrl?: string;
  status: PromptStatus;
}

export interface UpdatePromptRequest extends Partial<CreatePromptRequest> {
  id: string;
}