import {
  isEditableTarget,
  matchPress,
  parseChord,
  type KeyBindingPress,
} from './parse'

export type ScopeKind = 'global' | 'page' | 'overlay'

export interface Binding {
  handler: (event: KeyboardEvent) => void
  passthrough: boolean
  preventDefault: boolean
  allowRepeat: boolean
  allowConflict: boolean
  description?: string
}

interface InternalBinding extends Binding {
  press: KeyBindingPress
  isLetterClass: boolean
}

export interface Scope {
  id: string
  kind: ScopeKind
  bindings: Map<string, Binding>
}

const isDev =
  typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'

class KeymapManager {
  private readonly globalScope: Scope = {
    id: '__global__',
    kind: 'global',
    bindings: new Map(),
  }
  private readonly stack: Scope[] = [this.globalScope]
  private attached = false
  private detach: (() => void) | null = null

  getStack(): readonly Scope[] {
    return this.stack
  }

  getGlobalScope(): Scope {
    return this.globalScope
  }

  pushScope(scope: Scope): void {
    if (scope.kind === 'global') {
      throw new Error(`[keymap] cannot push another global scope`)
    }
    const existingIndex = this.stack.findIndex((s) => s.id === scope.id)
    if (existingIndex !== -1) {
      this.stack[existingIndex] = scope
      return
    }
    this.stack.push(scope)
  }

  popScope(id: string): void {
    const idx = this.stack.findIndex((s) => s.id === id && s.kind !== 'global')
    if (idx === -1) return
    this.stack.splice(idx, 1)
  }

  register(scope: Scope, chord: string, binding: Binding): () => void {
    const parsed = parseChord(chord)
    const canonical = parsed.canonical

    if (scope.kind !== 'global') {
      const globalBinding = this.globalScope.bindings.get(canonical)
      if (globalBinding?.passthrough && !binding.allowConflict) {
        if (isDev) {
          throw new Error(
            `[keymap] cannot shadow global passthrough chord "${chord}" without allowConflict: true`,
          )
        }
        return () => {}
      }
    }

    const existing = scope.bindings.get(canonical)
    if (existing && isDev && !binding.allowConflict) {
      if (existing.handler !== binding.handler) {
        // eslint-disable-next-line no-console
        console.warn(
          `[keymap] chord "${chord}" already registered in scope "${scope.id}"; rebinding`,
        )
      }
    }

    const internal: InternalBinding = {
      ...binding,
      press: parsed.press,
      isLetterClass: parsed.isLetterClass,
    }
    scope.bindings.set(canonical, internal)

    return () => {
      const cur = scope.bindings.get(canonical)
      if (cur === internal) scope.bindings.delete(canonical)
    }
  }

  attach(): () => void {
    if (this.attached) return this.detach ?? (() => {})
    const onKeyDown = (event: KeyboardEvent) => this.resolve(event)
    window.addEventListener('keydown', onKeyDown)
    this.attached = true
    this.detach = () => {
      window.removeEventListener('keydown', onKeyDown)
      this.attached = false
      this.detach = null
    }
    return this.detach
  }

  resolve(event: KeyboardEvent): void {
    if (event.isComposing || event.keyCode === 229) return

    const editable = isEditableTarget(event)
    const hasOverlay = this.stack.some((s) => s.kind === 'overlay')

    for (let i = this.stack.length - 1; i >= 0; i--) {
      const scope = this.stack[i]
      for (const binding of scope.bindings.values()) {
        const ib = binding as InternalBinding
        if (!matchPress(event, ib.press)) continue

        if (editable && ib.isLetterClass) return
        if (event.repeat && !binding.allowRepeat) return

        const isUnderlying = scope.kind !== 'overlay'
        if (hasOverlay && isUnderlying && !binding.passthrough) continue

        binding.handler(event)
        if (binding.preventDefault) event.preventDefault()
        return
      }
    }
  }
}

export const keymapManager = new KeymapManager()
