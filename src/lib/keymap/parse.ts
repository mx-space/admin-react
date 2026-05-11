import { matchKeyBindingPress, parseKeybinding } from 'tinykeys'

export type KeyBindingPress = [mods: string[], key: string | RegExp]

export interface ParsedChord {
  canonical: string
  isLetterClass: boolean
  press: KeyBindingPress
}

const RESERVED_KEYS = new Set(['tab'])

const isCharKey = (key: string | RegExp): key is string =>
  typeof key === 'string' && key.length === 1

const buildCanonical = (press: KeyBindingPress): string => {
  const [mods, key] = press
  const sortedMods = [...mods].sort()
  const keyStr = key instanceof RegExp ? `re:${key.source}` : key.toLowerCase()
  return [...sortedMods.map((m) => m.toLowerCase()), keyStr].join('+')
}

export const parseChord = (input: string): ParsedChord => {
  const raw = input.trim()
  if (!raw) {
    throw new Error(`[keymap] empty chord`)
  }
  const presses = parseKeybinding(raw)
  if (presses.length === 0) {
    throw new Error(`[keymap] empty chord: "${input}"`)
  }
  if (presses.length > 1) {
    throw new Error(
      `[keymap] chord sequences are not supported in this iteration: "${input}"`,
    )
  }

  const press = presses[0]
  const [mods, key] = press

  if (typeof key === 'string' && RESERVED_KEYS.has(key.toLowerCase())) {
    throw new Error(
      `[keymap] "${key}" is reserved for native focus traversal and cannot be registered`,
    )
  }

  const hasNonShiftMod = mods.some((m) => m !== 'Shift')
  const isLetterClass = !hasNonShiftMod && isCharKey(key)

  return {
    canonical: buildCanonical(press),
    isLetterClass,
    press,
  }
}

export const matchPress = matchKeyBindingPress

export const isEditableTarget = (event: KeyboardEvent): boolean => {
  const target = event.target as Element | null
  if (!target || typeof (target as HTMLElement).closest !== 'function') {
    return false
  }
  if ((target as HTMLElement).isContentEditable) return true
  return !!target.closest(
    'input, textarea, [contenteditable], [contenteditable="true"], [contenteditable="plaintext-only"]',
  )
}
