import { atom } from 'jotai'

export const draftRecoveryOpenAtom = atom<boolean>(false)
export const draftListOpenAtom = atom<boolean>(false)
export const activeDraftIdAtom = atom<string | null>(null)
