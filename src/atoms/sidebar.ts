import { atom } from 'jotai'

// Mobile (<768 px) sidebar drawer open state.
// Desktop collapse uses `useUIStore.sidebarCollapsed` (persisted).
export const sidebarMobileOpenAtom = atom<boolean>(false)
