import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  history: any[];
  addHistory: (item: any) => void;
  clearHistory: () => void;
  savedPrompts: any[];
  savePrompt: (prompt: any) => void;
  deletePrompt: (id: string) => void;
  removeSavedPrompt: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isDarkMode: true, // macOS inspired dark mode by default
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      history: [],
      addHistory: (item) => set((state) => ({ history: [item, ...state.history] })),
      clearHistory: () => set({ history: [] }),
      savedPrompts: [],
      savePrompt: (prompt) => set((state) => ({ savedPrompts: [prompt, ...state.savedPrompts] })),
      deletePrompt: (id) => set((state) => ({ 
        savedPrompts: state.savedPrompts.filter(p => p.id !== id) 
      })),
      removeSavedPrompt: (id) => set((state) => ({ 
        savedPrompts: state.savedPrompts.filter(p => p.id !== id) 
      })),
    }),
    {
      name: 'promptforge-storage',
    }
  )
);
