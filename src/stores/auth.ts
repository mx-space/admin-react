import { create } from 'zustand'

import type { UserModel } from '~/models'

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'

interface AuthState {
  user: UserModel | null
  status: AuthStatus
  error: string | null

  setUser: (user: UserModel | null) => void
  setStatus: (status: AuthStatus) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  error: null,
  setUser: (user) =>
    set({
      user,
      status: user ? 'authenticated' : 'unauthenticated',
      error: null,
    }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  reset: () => set({ user: null, status: 'unauthenticated', error: null }),
}))
