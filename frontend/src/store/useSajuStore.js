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

  addToHistory: (result) => set((state) => ({
    history: [result, ...state.history].slice(0, 10),
  })),

  setHistory: (history) => set({ history }),

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
      const stored = localStorage.getItem('lastSajuResult');
      if (stored) {
        const result = JSON.parse(stored);
        set({ currentResult: result });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  },
}));

export default useSajuStore;
