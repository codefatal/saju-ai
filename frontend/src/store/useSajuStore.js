import { create } from 'zustand';
import { analyzeSaju, getHistory } from '../api/sajuApi';

const useSajuStore = create((set, get) => ({
  // State
  currentResult: null,
  history: [],
  isLoading: false,
  error: null,

  // Actions
  setCurrentResult: (result) => set({ currentResult: result }),

  addToHistory: (result) => set((state) => {
    const newHistory = [result, ...state.history].slice(0, 10);
    // localStorage에 이력 저장
    localStorage.setItem('sajuHistory', JSON.stringify(newHistory));
    return { history: newHistory };
  }),

  setHistory: (history) => {
    // localStorage에 이력 저장
    localStorage.setItem('sajuHistory', JSON.stringify(history));
    set({ history });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () => set({
    currentResult: null,
    history: [],
    isLoading: false,
    error: null,
  }),

  // Async Actions
  fetchAnalysis: async (birthData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await analyzeSaju(birthData);
      set({
        currentResult: result,
        isLoading: false,
      });

      // Add to history
      get().addToHistory(result);

      // Save to localStorage
      localStorage.setItem('lastSajuResult', JSON.stringify(result));

      return result;
    } catch (error) {
      const errorMessage = error.message || '사주 분석 중 오류가 발생했습니다';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const history = await getHistory();
      set({
        history,
        isLoading: false,
      });
      return history;
    } catch (error) {
      const errorMessage = error.message || '이력 조회 중 오류가 발생했습니다';
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
      // 마지막 분석 결과 로드
      const lastResult = localStorage.getItem('lastSajuResult');
      if (lastResult) {
        const result = JSON.parse(lastResult);
        set({ currentResult: result });
      }

      // 이력 로드
      const storedHistory = localStorage.getItem('sajuHistory');
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        set({ history });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  },
}));

export default useSajuStore;
