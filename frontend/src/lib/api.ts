// =======================================================
// API CONFIG
// =======================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5500/api";

// =======================================================
// TOKEN HANDLER
// =======================================================

/**
 * Safely retrieves token from localStorage (client-side only)
 * Returns null during SSR to prevent errors
 */
const getToken = (): string | null => {
  // Only on client side
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Failed to read token from localStorage:", error);
    return null;
  }
};

/**
 * Builds auth headers for API requests
 * - Always includes Content-Type: application/json
 * - Includes Authorization header only if token exists
 * - Safe for SSR (only runs on client due to getToken check)
 */
const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Attach token only if it exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// =======================================================
// FETCH WRAPPER
// =======================================================

/**
 * Authenticated fetch wrapper
 * - Automatically includes JWT token in Authorization header
 * - Handles response parsing and errors
 * - Only on client-side (SSR safe)
 * 
 * Usage: 
 *   const data = await fetchWithAuth("/payment/create-session", {
 *     method: "POST",
 *     body: JSON.stringify({ plan: "yearly" })
 *   });
 */
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  return handleResponse(response);
}

// =======================================================
// RESPONSE HANDLER
// =======================================================

async function handleResponse(res: Response): Promise<unknown> {
  let data: unknown = null;

  try {
    data = await res.json();
  } catch {
    throw new Error("Server not responding");
  }

  // Unauthorized → logout
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message?: unknown }).message || "Something went wrong")
        : "Something went wrong";
    throw new Error(message);
  }

  return data;
}

// =======================================================
// AUTH APIs
// =======================================================

export const api = {
  // REGISTER
  async register(payload: {
    name: string;
    email: string;
    phone: string;
    instaHandle: string;
    password: string;
    gender?: "male" | "female" | "other";
  }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return handleResponse(res);
  },

  // VERIFY EMAIL
  async verifyEmail(email: string, otp: string) {
    const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    return handleResponse(res);
  },

  // RESEND OTP
  async resendOTP(email: string) {
    const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return handleResponse(res);
  },

  // LOGIN
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = (await handleResponse(res)) as { token: string; user: unknown };

    // Save automatically
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  },

  // GET CURRENT USER
  async me() {
    return fetchWithAuth("/auth/me");
  },

  // LOGOUT (frontend only)
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  },

  // =======================================================
  // PROMPTS
  // =======================================================

  async getPrompts() {
    return fetchWithAuth("/prompts");
  },

  async getSinglePrompt(id: string) {
    return fetchWithAuth(`/prompts/${id}`);
  },

  // =======================================================
  // CATEGORIES
  // =======================================================

  async getCategories(page = 1, limit = 20) {
    const res = await fetch(
      `${API_BASE_URL}/categories?page=${page}&limit=${limit}`
    );

    return handleResponse(res);
  },

  // =======================================================
  // USAGE TRACK (10 free limit)
  // =======================================================

  async trackUsage(promptId: string) {
    return fetchWithAuth("/usage/track", {
      method: "POST",
      body: JSON.stringify({ promptId }),
    });
  },

  // =======================================================
  // PAYMENT (DODO)
  // =======================================================

  // CREATE CHECKOUT SESSION
  // Automatically includes JWT token in Authorization header
  async createPaymentSession(plan: "yearly" | "lifetime") {
    return fetchWithAuth("/payments/create-session", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  },

  // GET CURRENT PLAN (authenticated user)
  // Automatically includes JWT token in Authorization header
  async getMyPlan() {
    return fetchWithAuth("/payments/plan/me");
  },

  // =======================================================
  // ADMIN PROMPTS MANAGEMENT
  // =======================================================

  /**
   * Create a new prompt (Admin only)
   * Requires: Authentication + Admin role
   */
  async createPrompt(payload: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    promptText: string;
    steps?: string[];
    completeSteps?: string[];
    estimatedTime?: string;
    usageCount?: number;
    referenceUrl?: string;
  }) {
    return fetchWithAuth("/admin/prompts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Create a prompt with image upload (Admin only)
   * Use FormData for file upload
   */
  async createPromptWithImage(formData: FormData) {
    const token = getToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/admin/prompts`, {
      method: "POST",
      headers,
      body: formData,
    });

    return handleResponse(response);
  },

  /**
   * Get all prompts (Admin view with all details)
   */
  async getAdminPrompts(page = 1, limit = 20) {
    return fetchWithAuth(
      `/admin/prompts?page=${page}&limit=${limit}`
    );
  },

  /**
   * Update a prompt (Admin only)
   */
  async updatePrompt(id: string, payload: Partial<{
    title: string;
    description: string;
    category: string;
    tags: string[];
    promptText: string;
    steps: string[];
    completeSteps: string[];
    estimatedTime: string;
    referenceUrl: string;
    imgUrl: string;
    usageCount: number;
  }>) {
    return fetchWithAuth(`/admin/prompts/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a prompt (Admin only)
   */
  async deletePrompt(id: string) {
    return fetchWithAuth(`/admin/prompts/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Get admin dashboard stats
   */
  async getAdminStats() {
    return fetchWithAuth("/admin/stats");
  },

  // =======================================================
  // ADMIN CATEGORIES MANAGEMENT
  // =======================================================

  /**
   * Create a new category (Admin only)
   * Requires: Authentication + Admin role
   */
  async createCategory(payload: {
    name: string;
    description?: string;
  }) {
    return fetchWithAuth("/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update a category (Admin only)
   */
  async updateCategory(id: string, payload: {
    name?: string;
    description?: string;
  }) {
    return fetchWithAuth(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a category (Admin only)
   */
  async deleteCategory(id: string) {
    return fetchWithAuth(`/categories/${id}`, {
      method: "DELETE",
    });
  },
};
