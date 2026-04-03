import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,

      // Toggle theme
      toggleTheme: () => {
        set((state) => {
          const newIsDark = !state.isDark;
          // Update DOM
          const html = document.documentElement;
          if (newIsDark) {
            html.classList.add('dark');
          } else {
            html.classList.remove('dark');
          }
          return { isDark: newIsDark };
        });
      },

      // Set theme explicitly
      setTheme: (isDark) => {
        set(() => {
          // Update DOM
          const html = document.documentElement;
          if (isDark) {
            html.classList.add('dark');
          } else {
            html.classList.remove('dark');
          }
          return { isDark };
        });
      },

      // Initialize theme from DOM on app start
      initializeTheme: () => {
        const { isDark } = get();
        const html = document.documentElement;
        if (isDark) {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      },
    }),
    {
      name: 'theme-store',
      onRehydrateStorage: () => (state) => {
        // Apply theme after rehydrating from localStorage
        if (state) {
          state.initializeTheme();
        }
      },
    }
  )
);
