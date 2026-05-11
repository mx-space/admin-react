import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  type ReactNode,
} from 'react'

import { keymapManager, type Scope, type ScopeKind } from './manager'

interface ShortcutScopeContextValue {
  scope: Scope
}

const ShortcutScopeContext = createContext<ShortcutScopeContextValue | null>(null)

export interface ShortcutScopeProps {
  id?: string
  kind?: Exclude<ScopeKind, 'global'>
  children: ReactNode
}

export const ShortcutScope = ({
  id,
  kind = 'page',
  children,
}: ShortcutScopeProps) => {
  const generatedId = useId()
  const scopeId = id ?? `scope:${generatedId}`

  const scope = useMemo<Scope>(
    () => ({ id: scopeId, kind, bindings: new Map() }),
    [scopeId, kind],
  )

  useEffect(() => {
    keymapManager.pushScope(scope)
    return () => {
      keymapManager.popScope(scope.id)
    }
  }, [scope])

  const value = useMemo(() => ({ scope }), [scope])
  return (
    <ShortcutScopeContext.Provider value={value}>
      {children}
    </ShortcutScopeContext.Provider>
  )
}

export const useShortcutScope = (): ShortcutScopeContextValue | null =>
  useContext(ShortcutScopeContext)
