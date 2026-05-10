import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { kbarActionsAtom } from '~/atoms/kbar'
import type { KbarAction } from '~/components/kbar/types'

export const useKbarRegister = (actions: KbarAction[]) => {
  const setActions = useSetAtom(kbarActionsAtom)

  useEffect(() => {
    if (actions.length === 0) return
    setActions((prev) => {
      const next = { ...prev }
      for (const a of actions) next[a.id] = a
      return next
    })
    return () => {
      setActions((prev) => {
        const next = { ...prev }
        for (const a of actions) delete next[a.id]
        return next
      })
    }
  }, [actions, setActions])
}
