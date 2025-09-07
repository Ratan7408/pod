import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, tokenManager } from '../lib/api';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string;
  phone?: string;
  isEmailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  agreeToTerms: boolean;
}

interface AuthContextType {
  user: User | null;
  state: AuthState;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  verifyAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });

  // Verify authentication on mount
  useEffect(() => {
    verifyAuth();
  }, []);

  // Set up periodic token refresh check
  useEffect(() => {
    if (state.isAuthenticated) {
      const interval = setInterval(async () => {
        try {
          await tokenManager.refreshTokenIfNeeded();
        } catch (error) {
          console.error('Periodic token refresh failed:', error);
          // Don't log out user immediately, let the next API call handle it
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated]);

  const verifyAuth = async (): Promise<void> => {
    try {
      const token = tokenManager.getAccessToken();
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
        return;
      }

      // Check if token is expiring soon and refresh if needed
      await tokenManager.refreshTokenIfNeeded();

      const response = await authApi.verifyToken();
      if (response.success && response.user) {
        setState(prev => ({ 
          ...prev, 
          user: response.user, 
          isLoading: false, 
          isAuthenticated: true 
        }));
        console.log('✅ AuthContext: User verified:', response.user.email);
      } else {
        // Token is invalid, clear it
        tokenManager.clearTokens();
        setState(prev => ({ 
          ...prev, 
          user: null, 
          isLoading: false, 
          isAuthenticated: false 
        }));
      }
    } catch (error: any) {
      console.error('❌ AuthContext: Token verification failed:', error);
      
      // Handle specific error cases
      if (error.status === 401) {
        // Token expired or invalid
        tokenManager.clearTokens();
        setState(prev => ({ 
          ...prev, 
          user: null, 
          isLoading: false, 
          isAuthenticated: false,
          error: 'Session expired. Please login again.'
        }));
      } else {
        // Other errors
        setState(prev => ({ 
          ...prev, 
          user: null, 
          isLoading: false, 
          isAuthenticated: false,
          error: error.message || 'Authentication failed'
        }));
      }
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    console.log('🔄 AuthContext: Login attempt:', email);

    try {
      const response = await authApi.login({ email, password });
      
      if (response.success && response.accessToken) {
        // Store tokens
        tokenManager.setTokens(response.accessToken, response.refreshToken);
        
        // Get user info
        const userResponse = await authApi.verifyToken();
        
        if (userResponse.success && userResponse.user) {
          setState(prev => ({
            ...prev,
            user: userResponse.user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          }));
          console.log('✅ AuthContext: Login successful:', userResponse.user.email);
        } else {
          throw new Error('Failed to get user information');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ AuthContext: Login failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        error: error.message || 'Login failed. Please try again.',
      }));
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    console.log('🔄 AuthContext: Registration attempt:', data.email);

    try {
      const response = await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        agreeToTerms: data.agreeToTerms,
      });

      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
        console.log('✅ AuthContext: Registration successful');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('❌ AuthContext: Registration failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Registration failed. Please try again.',
      }));
      throw error;
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    console.log('🔄 AuthContext: Forgot password attempt:', email);

    try {
      const response = await authApi.forgotPassword(email);

      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
        console.log('✅ AuthContext: Forgot password email sent');
      } else {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      console.error('❌ AuthContext: Forgot password failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to send reset email. Please try again.',
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout API to invalidate tokens on server
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    }

    // Clear local tokens and state
    tokenManager.clearTokens();
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      error: null,
    }));
    console.log('✅ AuthContext: Logout successful');
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    user: state.user,
    state,
    login,
    register,
    forgotPassword,
    logout,
    clearError,
    verifyAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
