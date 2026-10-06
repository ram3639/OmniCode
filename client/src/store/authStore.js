import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('omnicode_token'),
  isAuthenticated: false,
  initialLoading: true,   // Only for initial auth check on app mount
  loading: false,          // For login/register button states
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      localStorage.setItem('omnicode_token', token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error) {
      const msg = error.response?.data?.error || 'Login failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', { username, email, password });
      const { user, token } = res.data;
      localStorage.setItem('omnicode_token', token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error) {
      const msg = error.response?.data?.error || 'Registration failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  addSolvedChallenge: (challengeId) => set((state) => {
    if (!state.user) return state;
    if (state.user.solvedChallenges?.includes(challengeId)) return state;
    return {
      user: {
        ...state.user,
        solvedChallenges: [...(state.user.solvedChallenges || []), challengeId]
      }
    };
  }),

  logout: () => {
    localStorage.removeItem('omnicode_token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('omnicode_token');
    if (!token) {
      set({ initialLoading: false, isAuthenticated: false });
      return;
    }
    const attempt = async (retries = 1) => {
      try {
        const res = await api.get('/auth/me');
        set({ user: res.data.user, token, isAuthenticated: true, initialLoading: false });
      } catch (error) {
        const status = error.response?.status;
        if (status === 404 || status === 401) {
          // Stale token — user no longer exists, clear it
          localStorage.removeItem('omnicode_token');
          set({ user: null, token: null, isAuthenticated: false, initialLoading: false });
        } else if ((status === 502 || status === 503 || !error.response) && retries > 0) {
          // Server might be starting up — retry once after 2s
          await new Promise(r => setTimeout(r, 2000));
          return attempt(retries - 1);
        } else {
          localStorage.removeItem('omnicode_token');
          set({ user: null, token: null, isAuthenticated: false, initialLoading: false });
        }
      }
    };
    await attempt();
  },

  handleGoogleCallback: async (token) => {
    localStorage.setItem('omnicode_token', token);
    set({ token });
    const res = await api.get('/auth/me');
    set({ user: res.data.user, isAuthenticated: true, initialLoading: false });
  },

  clearError: () => set({ error: null })
}));
