import { create } from 'zustand';
import { getChallenges, getChallenge } from '../services/challengeService';

export const useChallengeStore = create((set) => ({
  challenges: [],
  currentChallenge: null,
  total: 0,
  loading: false,
  error: null,
  filters: {
    category: 'All',
    difficulty: 'All',
    search: ''
  },

  fetchChallenges: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await getChallenges(params);
      set({ challenges: res.data.challenges || [], total: res.data.total || 0, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to load challenges', loading: false });
    }
  },

  fetchChallenge: async (slug) => {
    set({ loading: true, error: null, currentChallenge: null });
    try {
      const res = await getChallenge(slug);
      set({ currentChallenge: res.data.challenge, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to load challenge', loading: false });
    }
  },

  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value } }));
  }
}));
