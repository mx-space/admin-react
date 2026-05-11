import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

interface UIState {
  themeMode: ThemeMode
  isDark: boolean
  viewport: { width: number; height: number }
  sidebarCollapsed: boolean

  setThemeMode: (mode: ThemeMode) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  updateViewport: (width: number, height: number) => void
  refreshIsDark: () => void
}

const computeIsDark = (mode: ThemeMode): boolean => {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true
}

const applyDocumentClass = (isDark: boolean) => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', isDark)
  root.classList.toggle('light', !isDark)
}

const initialMode: ThemeMode = 'system'

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      themeMode: initialMode,
      isDark: computeIsDark(initialMode),
      viewport: { width: 0, height: 0 },
      sidebarCollapsed: false,
      setThemeMode: (themeMode) => {
        set({ themeMode })
        get().refreshIsDark()
      },
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      updateViewport: (width, height) => set({ viewport: { width, height } }),
      refreshIsDark: () => {
        const isDark = computeIsDark(get().themeMode)
        set({ isDark })
        applyDocumentClass(isDark)
      },
    }),
    {
      name: 'mx-admin:ui',
      version: 1,
      partialize: (s) => ({
        themeMode: s.themeMode,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const isDark = computeIsDark(state.themeMode)
        state.isDark = isDark
        applyDocumentClass(isDark)
      },
    },
  ),
)
