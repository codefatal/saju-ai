import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
authClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await authClient.post('/auth/refresh', {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return authClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Google OAuth callback
 * @param {string} code - Authorization code from Google
 * @returns {Promise} OAuth response with tokens and user info
 */
export const googleCallback = async (code) => {
  try {
    const response = await authClient.post('/auth/oauth/google/callback', {
      code,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Kakao OAuth callback
 * @param {string} code - Authorization code from Kakao
 * @returns {Promise} OAuth response with tokens and user info
 */
export const kakaoCallback = async (code) => {
  try {
    const response = await authClient.post('/auth/oauth/kakao/callback', {
      code,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} New access and refresh tokens
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await authClient.post('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get current user info
 * @returns {Promise} Current user info
 */
export const getCurrentUser = async () => {
  try {
    const response = await authClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Logout
 * @param {string} refreshToken - Refresh token to invalidate
 * @returns {Promise}
 */
export const logout = async (refreshToken) => {
  try {
    const response = await authClient.post('/auth/logout', {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Disconnect OAuth provider
 * @param {string} provider - OAuth provider name (GOOGLE, KAKAO)
 * @returns {Promise}
 */
export const disconnectOAuthProvider = async (provider) => {
  try {
    const response = await authClient.post(`/auth/disconnect/${provider}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get user profile
 * @returns {Promise} User profile with birth information
 */
export const getUserProfile = async () => {
  try {
    const response = await authClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Save user profile
 * @param {Object} profileData - Profile data (year, month, day, hour, minute, gender, isLunar)
 * @returns {Promise} Updated profile
 */
export const saveUserProfile = async (profileData) => {
  try {
    const response = await authClient.post('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  googleCallback,
  kakaoCallback,
  refreshAccessToken,
  getCurrentUser,
  logout,
  disconnectOAuthProvider,
  getUserProfile,
  saveUserProfile,
};
