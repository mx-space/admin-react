import { createStore } from 'jotai'
import { describe, expect, it } from 'vitest'

import {
  clearAllTableStates,
  initialTableState,
  resetTablePagingAtomFamily,
  serverFields,
  tableStateAtomFamily,
} from './table'

describe('tableStateAtomFamily', () => {
  it('returns the same atom for the same key', () => {
    const a = tableStateAtomFamily('posts:list')
    const b = tableStateAtomFamily('posts:list')
    expect(a).toBe(b)
  })

  it('emits the canonical default state on first read', () => {
    const store = createStore()
    const atom = tableStateAtomFamily('analyze:guests')
    expect(store.get(atom)).toEqual(initialTableState)
  })

  it('reset atom clears page + selection but preserves density and sort', () => {
    const store = createStore()
    const stateAtom = tableStateAtomFamily('reset:demo')
    const resetAtom = resetTablePagingAtomFamily('reset:demo')
    store.set(stateAtom, {
      ...initialTableState,
      page: 4,
      sortBy: 'created',
      sortOrder: 'desc',
      selectedRowKeys: ['1', '2'],
      density: 'compact',
    })
    store.set(resetAtom)
    expect(store.get(stateAtom)).toEqual({
      ...initialTableState,
      page: 1,
      sortBy: 'created',
      sortOrder: 'desc',
      selectedRowKeys: [],
      density: 'compact',
    })
  })

  it('serverFields excludes selection and density (query-key purity)', () => {
    const fields = serverFields({
      ...initialTableState,
      page: 3,
      pageSize: 50,
      sortBy: 'created',
      sortOrder: 'desc',
      filters: { search: 'foo' },
      selectedRowKeys: ['a', 'b'],
      density: 'roomy',
    })
    expect(fields).toEqual({
      page: 3,
      pageSize: 50,
      sortBy: 'created',
      sortOrder: 'desc',
      filters: { search: 'foo' },
    })
    expect(Object.keys(fields)).not.toContain('selectedRowKeys')
    expect(Object.keys(fields)).not.toContain('density')
  })

  it('clearAllTableStates evicts entries (next read returns fresh default)', () => {
    const store = createStore()
    const atom = tableStateAtomFamily('logout:demo')
    store.set(atom, { ...initialTableState, page: 7, pageSize: 50 })
    expect(store.get(atom).page).toBe(7)
    clearAllTableStates()
    const refreshedAtom = tableStateAtomFamily('logout:demo')
    // After eviction the family returns a brand-new atom (different identity);
    // and reading it from a fresh store yields default state.
    expect(refreshedAtom).not.toBe(atom)
    expect(createStore().get(refreshedAtom)).toEqual(initialTableState)
  })
})
