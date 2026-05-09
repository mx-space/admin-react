import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export interface TableState {
  page: number
  pageSize: number
  sortBy: string | null
  sortOrder: 'asc' | 'desc' | null
  filters: Record<string, unknown>
  selectedRows: string[]
}

export const initialTableState: TableState = {
  page: 1,
  pageSize: 20,
  sortBy: null,
  sortOrder: null,
  filters: {},
  selectedRows: [],
}

export const tableStateAtomFamily = atomFamily(
  (_key: string) => atom<TableState>({ ...initialTableState }),
  (a, b) => a === b,
)
