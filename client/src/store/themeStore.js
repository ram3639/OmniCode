import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('omnicode_theme') || 'dark',
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('omnicode_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    return { theme: newTheme };
  }),

  initTheme: () => {
    const saved = localStorage.getItem('omnicode_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    set({ theme: saved });
  }
}));
