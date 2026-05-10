import { useMemo } from 'react'

import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnPinningState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Table,
} from '@tanstack/react-table'

import type { TableState } from '~/atoms/table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'start' | 'center' | 'end'
    width?: number
    sortable?: boolean
    headerNode?: import('react').ReactNode
    fixed?: 'left' | 'right'
  }
}

export type StateUpdater = TableState | ((prev: TableState) => TableState)

export interface UseDataTableOptions<T> {
  data: T[]
  columns: ColumnDef<T>[]
  totalCount: number
  state: TableState
  setState: (updater: StateUpdater) => void
  rowKey: (row: T) => string
  enableMultiRowSelection?: boolean
}

export interface DataTableInstance<T> {
  table: Table<T>
  state: TableState
  setState: (updater: StateUpdater) => void
}

const arrayToRowSelection = (keys: string[]): RowSelectionState =>
  keys.reduce<RowSelectionState>((acc, k) => {
    acc[k] = true
    return acc
  }, {})

const rowSelectionToArray = (rs: RowSelectionState): string[] =>
  Object.entries(rs)
    .filter(([, v]) => Boolean(v))
    .map(([k]) => k)

export const useDataTable = <T,>({
  data,
  columns,
  totalCount,
  state,
  setState,
  rowKey,
  enableMultiRowSelection = true,
}: UseDataTableOptions<T>): DataTableInstance<T> => {
  const sorting: SortingState = useMemo(
    () =>
      state.sortBy && state.sortOrder
        ? [{ id: state.sortBy, desc: state.sortOrder === 'desc' }]
        : [],
    [state.sortBy, state.sortOrder],
  )

  const rowSelection = useMemo(
    () => arrayToRowSelection(state.selectedRowKeys),
    [state.selectedRowKeys],
  )

  const columnPinning: ColumnPinningState = useMemo(() => {
    const left: string[] = []
    const right: string[] = []
    for (const col of columns) {
      const fixed = col.meta?.fixed
      if (!fixed) continue
      const id = col.id
      if (!id) {
        if (
          typeof process !== 'undefined' &&
          process.env?.NODE_ENV !== 'production'
        ) {
          // eslint-disable-next-line no-console
          console.warn(
            '[DataTable] meta.fixed requires an explicit column.id; skipping.',
          )
        }
        continue
      }
      if (fixed === 'left') left.push(id)
      else right.push(id)
    }
    return { left, right }
  }, [columns])

  const pageCount = Math.max(1, Math.ceil(totalCount / state.pageSize))

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnPinning,
      pagination: { pageIndex: state.page - 1, pageSize: state.pageSize },
    },
    rowCount: totalCount,
    pageCount,
    getRowId: rowKey,
    enableMultiRowSelection,
    enableSorting: true,
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(sorting) : updater
      setState((prev) => {
        if (next.length === 0) {
          return { ...prev, sortBy: null, sortOrder: null }
        }
        const [first] = next
        return {
          ...prev,
          sortBy: first.id,
          sortOrder: first.desc ? 'desc' : 'asc',
        }
      })
    },
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(rowSelection) : updater
      setState((prev) => ({
        ...prev,
        selectedRowKeys: rowSelectionToArray(next),
      }))
    },
  })

  return { table, state, setState }
}
