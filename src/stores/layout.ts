import { create } from 'zustand'

interface LayoutState {
  contentPaddingEnabled: boolean
  hideHeaderDefault: boolean
  setContentPadding: (enabled: boolean) => void
  setHideHeaderDefault: (hidden: boolean) => void
}

export const useLayoutStore = create<LayoutState>((set) => ({
  contentPaddingEnabled: true,
  hideHeaderDefault: false,
  setContentPadding: (contentPaddingEnabled) => set({ contentPaddingEnabled }),
  setHideHeaderDefault: (hideHeaderDefault) => set({ hideHeaderDefault }),
}))
