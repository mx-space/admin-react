import { atom } from 'jotai'

import type { KbarAction } from '~/components/kbar/types'

export const kbarOpenAtom = atom(false)

// id → action。注册去重；卸载时移除。
export const kbarActionsAtom = atom<Record<string, KbarAction>>({})
