import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Company, AuthToken } from '@/types';

interface AuthState {
  user: User | null;
  company: Company | null;
  tokens: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuth: (user: User, company: Company | undefined, tokens: AuthToken) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (user: Partial<User>) => void;
  updateCompany: (company: Partial<Company>) => void;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      user: null,
      company: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (user, company, tokens) =>
        set({
          user,
          company,
          tokens,
          isAuthenticated: true,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          company: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      updateCompany: (updates) =>
        set((state) => ({
          company: state.company ? { ...state.company, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        company: state.company,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
