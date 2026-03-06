// stores/userStore.ts
import { create } from 'zustand';
import { UserState } from '@/types/user';

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (userData) =>
    set({
      user: userData,
      isAuthenticated: !!userData,
      isLoading: false,
      error: null,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),

  startLoading: () => set({ isLoading: true, error: null }),

  setError: (msg) => set({ error: msg, isLoading: false }),

  updateUserField: (field, value) =>
    set((state) => ({
      user: state.user ? { ...state.user, [field]: value } : null,
    })),
}));
