// ================================
// 📁 src/lib/api.ts - API Utility Functions
// ================================

// ✅ UPDATED: Dynamic API Base URL for production deployment
const API_BASE_URL = (() => {
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  
  // In production, use your AWS backend URL
  // Replace 'your-aws-backend-url.com' with your actual AWS backend domain
  return 'https://your-aws-backend-url.com/api';
})();

console.log('🔧 API Base URL configured as:', API_BASE_URL);

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: any;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Generic API request function with automatic token refresh
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // If token is expired and we have a refresh token, try to refresh
    if (response.status === 401 && data.message === 'Invalid token.' && !endpoint.includes('/auth/refresh')) {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken && !isRefreshing) {
        isRefreshing = true;
        
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          
          const refreshData = await refreshResponse.json();
          
          if (refreshResponse.ok && refreshData.accessToken) {
            // Update tokens
            localStorage.setItem('auth_token', refreshData.accessToken);
            if (refreshData.refreshToken) {
              localStorage.setItem('refresh_token', refreshData.refreshToken);
            }
            
            // Retry the original request with new token
            const retryConfig = {
              ...config,
              headers: {
                ...config.headers,
                'Authorization': `Bearer ${refreshData.accessToken}`,
              },
            };
            
            const retryResponse = await fetch(url, retryConfig);
            const retryData = await retryResponse.json();
            
            if (!retryResponse.ok) {
              throw new ApiError(
                retryData.message || `HTTP ${retryResponse.status}: ${retryResponse.statusText}`,
                retryResponse.status
              );
            }
            
            isRefreshing = false;
            processQueue(null, refreshData.accessToken);
            return retryData;
          } else {
            // Refresh failed, clear tokens and redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            isRefreshing = false;
            processQueue(new Error('Token refresh failed'), null);
            throw new ApiError('Session expired. Please login again.', 401);
          }
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError, null);
          
          // Clear tokens on refresh failure
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          throw new ApiError('Session expired. Please login again.', 401);
        }
      } else if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiRequest(endpoint, options);
        });
      } else {
        // No refresh token available, clear tokens
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        throw new ApiError('Session expired. Please login again.', 401);
      }
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('API request failed:', error);
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      500
    );
  }
}

// Auth API functions
export const authApi = {
  // Register user
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    agreeToTerms: boolean;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Verify email
  verifyEmail: async (token: string) => {
    return apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // Verify token (check if user is authenticated)
  verifyToken: async () => {
    return apiRequest('/auth/verify');
  },

  // Logout
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
};

// Token management
export const tokenManager = {
  setTokens: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem('auth_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  },

  getAccessToken: () => {
    return localStorage.getItem('auth_token');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },

  clearTokens: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Check if token is about to expire (within 5 minutes)
  isTokenExpiringSoon: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      return (expirationTime - currentTime) < fiveMinutes;
    } catch (error) {
      return false;
    }
  },

  // Proactively refresh token if it's expiring soon
  refreshTokenIfNeeded: async () => {
    if (tokenManager.isTokenExpiringSoon()) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await authApi.refreshToken(refreshToken);
          if (response.success && response.accessToken) {
            tokenManager.setTokens(response.accessToken, response.refreshToken);
            return true;
          }
        } catch (error) {
          console.error('Proactive token refresh failed:', error);
          tokenManager.clearTokens();
          return false;
        }
      }
    }
    return true;
  },
};

export { ApiError };
export default apiRequest; 