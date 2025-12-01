import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
 * 사주 분석 요청
 * @param {Object} birthData - 생년월일 정보
 * @returns {Promise} 분석 결과
 */
export const analyzeSaju = async (birthData) => {
  try {
    const response = await apiClient.post('/saju/analyze', birthData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 분석 이력 조회
 * @returns {Promise} 분석 이력 배열
 */
export const getHistory = async () => {
  try {
    const response = await apiClient.get('/saju/history');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 특정 분석 결과 조회
 * @param {number} id - 분석 ID
 * @returns {Promise} 분석 결과
 */
export const getSajuById = async (id) => {
  try {
    const response = await apiClient.get(`/saju/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  analyzeSaju,
  getHistory,
  getSajuById,
};
