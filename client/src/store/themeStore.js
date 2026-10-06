import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'dark',
  toggleTheme: () => {},
  initTheme: () => {},
}));
