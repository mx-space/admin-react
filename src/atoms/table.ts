import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export type TableDensity = 'compact' | 'comfortable' | 'roomy'

export interface TableState {
  page: number
  pageSize: number
  sortBy: string | null
  sortOrder: 'asc' | 'desc' | null
  filters: Record<string, unknown>
  selectedRowKeys: string[]
  density: TableDensity
}

export const initialTableState: TableState = {
  page: 1,
  pageSize: 20,
  sortBy: null,
  sortOrder: null,
  filters: {},
  selectedRowKeys: [],
  density: 'comfortable',
}

export const tableStateAtomFamily = atomFamily((_key: string) =>
  atom<TableState>({ ...initialTableState }),
)

export const resetTablePagingAtomFamily = atomFamily((key: string) =>
  atom(null, (get, set) => {
    const s = get(tableStateAtomFamily(key))
    set(tableStateAtomFamily(key), {
      ...s,
      page: 1,
      selectedRowKeys: [],
    })
  }),
)

export const clearAllTableStates = () => {
  tableStateAtomFamily.setShouldRemove(() => true)
  tableStateAtomFamily.setShouldRemove(null)
}

export const serverFields = (state: TableState) => ({
  page: state.page,
  pageSize: state.pageSize,
  sortBy: state.sortBy,
  sortOrder: state.sortOrder,
  filters: state.filters,
})
