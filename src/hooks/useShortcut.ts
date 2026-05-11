import { useEffect, useRef } from 'react'

import {
  keymapManager,
  type Binding,
  type Scope,
} from '~/lib/keymap/manager'
import { useShortcutScope } from '~/lib/keymap/ShortcutScope'

export interface UseShortcutOptions {
  scope?: 'auto' | 'global'
  passthrough?: boolean
  preventDefault?: boolean
  allowRepeat?: boolean
  allowConflict?: boolean
  description?: string
}

const isDev =
  typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'

export const useShortcut = (
  chord: string,
  handler: (event: KeyboardEvent) => void,
  opts: UseShortcutOptions = {},
): void => {
  const ctx = useShortcutScope()
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  const {
    scope: scopeKind = 'auto',
    passthrough = false,
    preventDefault = true,
    allowRepeat = false,
    allowConflict = false,
    description,
  } = opts

  useEffect(() => {
    let target: Scope
    if (scopeKind === 'global') {
      target = keymapManager.getGlobalScope()
    } else if (ctx?.scope) {
      target = ctx.scope
    } else {
      if (isDev) {
        throw new Error(
          `[keymap] useShortcut("${chord}") called outside of <ShortcutScope> with scope: 'auto'. Wrap the tree or pass scope: 'global'.`,
        )
      }
      return
    }

    const binding: Binding = {
      handler: (event) => handlerRef.current(event),
      passthrough,
      preventDefault,
      allowRepeat,
      allowConflict,
      description,
    }
    return keymapManager.register(target, chord, binding)
  }, [
    chord,
    scopeKind,
    passthrough,
    preventDefault,
    allowRepeat,
    allowConflict,
    description,
    ctx?.scope,
  ])
}
