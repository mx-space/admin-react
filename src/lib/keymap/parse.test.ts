import { describe, expect, it } from 'vitest'

import { parseChord } from './parse'

// happy-dom platform is non-Mac → $mod resolves to Control
const MOD = 'control'

describe('parseChord', () => {
  it('parses single letter as letter-class', () => {
    const r = parseChord('j')
    expect(r.canonical).toBe('j')
    expect(r.isLetterClass).toBe(true)
  })

  it('parses Shift+letter as letter-class', () => {
    const r = parseChord('Shift+D')
    expect(r.canonical).toBe('shift+d')
    expect(r.isLetterClass).toBe(true)
  })

  it('parses $mod+letter as non-letter-class', () => {
    const r = parseChord('$mod+K')
    expect(r.canonical).toBe(`${MOD}+k`)
    expect(r.isLetterClass).toBe(false)
  })

  it('canonical is invariant to modifier input order', () => {
    expect(parseChord('Shift+$mod+K').canonical).toBe(`${MOD}+shift+k`)
    expect(parseChord('$mod+Shift+K').canonical).toBe(`${MOD}+shift+k`)
    expect(parseChord('Alt+$mod+Enter').canonical).toBe(`alt+${MOD}+enter`)
  })

  it('parses named keys', () => {
    expect(parseChord('Enter').canonical).toBe('enter')
    expect(parseChord('Escape').canonical).toBe('escape')
    expect(parseChord('ArrowDown').canonical).toBe('arrowdown')
  })

  it('rejects empty input', () => {
    expect(() => parseChord('')).toThrow(/empty/)
  })

  it('rejects sequences (whitespace)', () => {
    expect(() => parseChord('g g')).toThrow(/sequence/)
  })

  it('rejects Tab as reserved', () => {
    expect(() => parseChord('Tab')).toThrow(/reserved/)
    expect(() => parseChord('tab')).toThrow(/reserved/)
  })

  it('lowercases mods and key in canonical output', () => {
    expect(parseChord('$mod+k').canonical).toBe(`${MOD}+k`)
    expect(parseChord('SHIFT+d').canonical).toBe('shift+d')
  })
})
