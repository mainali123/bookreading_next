// src/store/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginRes } from '@/types/login';

type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
};

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (data: loginRes) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (data: loginRes) => set({
        token: data.token,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          avatar: data.user.avatar,
        } : null,
        isAuthenticated: !!data.token,
      }),
      clearAuth: () => set({
        token: null,
        user: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);