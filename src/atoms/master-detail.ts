import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export const selectedIdAtomFamily = atomFamily(
  (_key: string) => atom<string | null>(null),
  (a, b) => a === b,
)
