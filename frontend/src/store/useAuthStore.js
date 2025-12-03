import { create } from 'zustand';
import {
  googleCallback,
  kakaoCallback,
  getCurrentUser,
  logout,
  disconnectOAuthProvider,
  getUserProfile,
  saveUserProfile,
} from '../api/authApi';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken });
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Google OAuth callback handler
  handleGoogleCallback: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await googleCallback(code);
      const { accessToken, refreshToken, user } = response;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.message || 'Google OAuth 로그인 중 오류가 발생했습니다';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // Kakao OAuth callback handler
  handleKakaoCallback: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await kakaoCallback(code);
      const { accessToken, refreshToken, user } = response;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.message || 'Kakao OAuth 로그인 중 오류가 발생했습니다';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const refreshToken = get().refreshToken;
      if (refreshToken) {
        await logout(refreshToken);
      }

      // Clear storage and state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error.message || '로그아웃 중 오류가 발생했습니다';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // Check current user
  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await getCurrentUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return user;
    } catch (error) {
      // User is not authenticated
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      // Don't set error here as it's expected when not logged in
      return null;
    }
  },

  // Disconnect OAuth provider
  disconnectProvider: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      const response = await disconnectOAuthProvider(provider);
      // Update user state to reflect disconnection
      const currentUser = get().user;
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            // Remove the provider if it was the only one
          },
        });
      }
      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMessage =
        error.message || 'OAuth 제공자 연결 해제 중 오류가 발생했습니다';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // Load from localStorage on init
  loadFromStorage: () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');

      if (accessToken && refreshToken && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  },

  // Load user profile from backend
  loadUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await getUserProfile();
      return profile;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Profile loading is optional, don't set error
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Save user profile
  saveProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const savedProfile = await saveUserProfile(profileData);
      set({ isLoading: false });
      return savedProfile;
    } catch (error) {
      const errorMessage = error.message || '프로필 저장 중 오류가 발생했습니다';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear all auth data
  reset: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
