import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import { cx } from '~/utils/cx'

import type { TableState } from '~/atoms/table'

import { rootStyle, scrollViewportStyle, tableStyle } from './DataTable.css'
import { createSelectionColumn } from './hooks/selectionColumn'
import {
  useDataTable,
  type StateUpdater,
} from './hooks/useDataTable'
import { TableBody } from './parts/TableBody'
import { TableDensityToggle } from './parts/TableDensityToggle'
import { TableEmpty } from './parts/TableEmpty'
import { TableHeader } from './parts/TableHeader'
import { TableLoading } from './parts/TableLoading'
import { TablePagination } from './parts/TablePagination'
import { TableSelectionCell } from './parts/TableSelectionCell'

let warnedFixed = false
const warnFixedDeferred = () => {
  if (
    !warnedFixed &&
    typeof process !== 'undefined' &&
    process.env?.NODE_ENV !== 'production'
  ) {
    warnedFixed = true
    // eslint-disable-next-line no-console
    console.warn(
      '[DataTable] meta.fixed is reserved but not yet rendered as a sticky column (deferred to v1).',
    )
  }
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  totalCount: number
  state: TableState
  setState: (updater: StateUpdater) => void
  rowKey: (row: T) => string
  loading?: boolean
  refetching?: boolean
  empty?: ReactNode
  selectable?: boolean
  selectionMode?: 'single' | 'multiple'
  isRowSelectable?: (row: T) => boolean
  onRowClick?: (row: T) => void
  showPagination?: boolean
  showDensityToggle?: boolean
  pageSizeOptions?: number[] | false
  className?: string
}

const DataTableImpl = <T,>({
  data,
  columns,
  totalCount,
  state,
  setState,
  rowKey,
  loading,
  empty,
  selectable,
  selectionMode = 'multiple',
  isRowSelectable,
  onRowClick,
  showPagination = true,
  showDensityToggle = false,
  pageSizeOptions,
  className,
}: DataTableProps<T>) => {
  const finalColumns = useMemo(() => {
    if (!selectable) return columns
    return [
      createSelectionColumn<T>({ mode: selectionMode, isRowSelectable }),
      ...columns,
    ]
  }, [selectable, selectionMode, isRowSelectable, columns])

  const usesFixed = useMemo(
    () => finalColumns.some((c) => c.meta?.fixed),
    [finalColumns],
  )
  if (usesFixed) warnFixedDeferred()

  const { table } = useDataTable<T>({
    data,
    columns: finalColumns,
    totalCount,
    state,
    setState,
    rowKey,
    enableMultiRowSelection: selectionMode === 'multiple',
  })

  return (
    <div className={cx(rootStyle, className)}>
      <div className={scrollViewportStyle}>
        <table className={tableStyle}>
          <TableHeader instance={table} />
          <TableBody
            instance={table}
            loading={loading}
            density={state.density}
            empty={empty}
            onRowClick={onRowClick}
          />
        </table>
      </div>
      {showDensityToggle ? (
        <TableDensityToggle state={state} setState={setState} />
      ) : null}
      {showPagination ? (
        <TablePagination
          state={state}
          setState={setState}
          totalCount={totalCount}
          pageSizeOptions={pageSizeOptions}
        />
      ) : null}
    </div>
  )
}

type DataTableComponent = (<T>(
  props: DataTableProps<T>,
) => ReturnType<typeof DataTableImpl<T>>) & {
  Header: typeof TableHeader
  Body: typeof TableBody
  Pagination: typeof TablePagination
  Empty: typeof TableEmpty
  Loading: typeof TableLoading
  DensityToggle: typeof TableDensityToggle
  SelectionCell: typeof TableSelectionCell
}

export const DataTable = DataTableImpl as DataTableComponent
DataTable.Header = TableHeader
DataTable.Body = TableBody
DataTable.Pagination = TablePagination
DataTable.Empty = TableEmpty
DataTable.Loading = TableLoading
DataTable.DensityToggle = TableDensityToggle
DataTable.SelectionCell = TableSelectionCell
