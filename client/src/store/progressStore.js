import { create } from 'zustand';
import { getProgress, getRecommendations, getStats } from '../services/progressService';

export const useProgressStore = create((set) => ({
  progress: null,
  recommendations: [],
  stats: null,
  loading: false,

  fetchProgress: async () => {
    set({ loading: true });
    try {
      const res = await getProgress();
      set({ progress: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error(error);
    }
  },

  fetchRecommendations: async () => {
    try {
      const res = await getRecommendations();
      set({ recommendations: res.data || [] });
    } catch (error) {
      console.error(error);
    }
  },

  fetchStats: async () => {
    try {
      const res = await getStats();
      set({ stats: res.data });
    } catch (error) {
      console.error(error);
    }
  }
}));
