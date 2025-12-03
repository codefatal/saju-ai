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

/**
 * PDF 다운로드
 * @param {number} id - 분석 ID
 * @returns {Promise} PDF 파일 다운로드
 */
export const downloadPdf = async (id) => {
  try {
    const response = await apiClient.get(`/saju/${id}/pdf`, {
      responseType: 'blob',
    });

    // Blob으로 파일 다운로드
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `saju_result_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 오늘의 운세 조회
 * @param {Object} birthData - 생년월일 정보
 * @returns {Promise} 오늘의 운세
 */
export const getDailyFortune = async (birthData) => {
  try {
    const response = await apiClient.post('/fortune/daily', birthData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 오늘의 럭키 아이템 조회
 * @param {Object} birthData - 생년월일 정보
 * @returns {Promise} 오늘의 럭키 아이템
 */
export const getLuckyItems = async (birthData) => {
  try {
    const response = await apiClient.post('/fortune/lucky-items', birthData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 띠별 운세 조회
 * @param {Object} zodiacData - 띠 정보
 * @returns {Promise} 띠별 운세
 */
export const getZodiacFortune = async (zodiacData) => {
  try {
    const response = await apiClient.post('/fortune/zodiac', zodiacData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 음력/양력 변환
 * @param {Object} calendarData - 날짜 정보
 * @returns {Promise} 변환된 날짜 정보
 */
export const convertCalendar = async (calendarData) => {
  try {
    const response = await apiClient.post('/calendar/convert', calendarData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 궁합 분석
 * @param {Object} compatibilityData - 두 사람의 생년월일 정보
 * @returns {Promise} 궁합 분석 결과
 */
export const analyzeCompatibility = async (compatibilityData) => {
  try {
    const response = await apiClient.post('/compatibility/analyze', compatibilityData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 타로 카드 리딩
 * @param {Object} tarotData - 타로 리딩 정보 (질문, 카테고리)
 * @returns {Promise} 타로 리딩 결과
 */
export const getTarotReading = async (tarotData) => {
  try {
    const response = await apiClient.post('/tarot/reading', tarotData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 꿈 해몽
 * @param {Object} dreamData - 꿈 내용 정보 (꿈 내용, 카테고리, 분위기)
 * @returns {Promise} 꿈 해몽 결과
 */
export const interpretDream = async (dreamData) => {
  try {
    const response = await apiClient.post('/dream/interpret', dreamData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 길일 선택
 * @param {Object} luckyDayData - 목적, 날짜 범위, 생년월일 정보 (선택)
 * @returns {Promise} 길일 추천 결과
 */
export const findLuckyDays = async (luckyDayData) => {
  try {
    const response = await apiClient.post('/lucky-day/find', luckyDayData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  analyzeSaju,
  getHistory,
  getSajuById,
  downloadPdf,
  getDailyFortune,
  getLuckyItems,
  getZodiacFortune,
  convertCalendar,
  analyzeCompatibility,
  getTarotReading,
  interpretDream,
  findLuckyDays,
};
