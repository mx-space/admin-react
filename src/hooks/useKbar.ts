import { useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { kbarOpenAtom } from '~/atoms/kbar'

export const useKbar = () => {
  const setOpen = useSetAtom(kbarOpenAtom)
  const open = useCallback(() => setOpen(true), [setOpen])
  const close = useCallback(() => setOpen(false), [setOpen])
  const toggle = useCallback(() => setOpen((v) => !v), [setOpen])
  return { open, close, toggle }
}
