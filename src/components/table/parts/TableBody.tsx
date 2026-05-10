import type { CSSProperties } from 'react'
import { flexRender, type Cell, type Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import { cx } from '~/utils/cx'

import type { TableDensity } from '~/atoms/table'

import {
  cellRecipe,
  rowRecipe,
  stickyBodyCellStyle,
  stickyEdgeLeftStyle,
  stickyEdgeRightStyle,
} from '../DataTable.css'

import { TableEmpty } from './TableEmpty'
import { TableLoading } from './TableLoading'

export interface TableBodyProps<T> {
  instance: Table<T>
  loading?: boolean
  density?: TableDensity
  empty?: ReactNode
  onRowClick?: (row: T) => void
}

const computeStickyStyle = <T,>(
  cell: Cell<T, unknown>,
): CSSProperties | undefined => {
  const pin = cell.column.getIsPinned()
  if (!pin) return undefined
  if (pin === 'left') {
    return { position: 'sticky', left: `${cell.column.getStart('left')}px` }
  }
  return { position: 'sticky', right: `${cell.column.getAfter('right')}px` }
}

export const TableBody = <T,>({
  instance,
  loading,
  density = 'comfortable',
  empty,
  onRowClick,
}: TableBodyProps<T>) => {
  const columnsCount = instance.getAllLeafColumns().length
  const rows = instance.getRowModel().rows

  if (loading && rows.length === 0) {
    return (
      <tbody>
        <TableLoading columns={columnsCount} density={density} />
      </tbody>
    )
  }

  if (rows.length === 0) {
    return (
      <tbody>
        <TableEmpty columns={columnsCount}>{empty}</TableEmpty>
      </tbody>
    )
  }

  return (
    <tbody>
      {rows.map((row) => (
        <tr
          key={row.id}
          className={rowRecipe({
            selected: row.getIsSelected(),
            clickable: !!onRowClick,
          })}
          onClick={onRowClick ? () => onRowClick(row.original) : undefined}
        >
          {row.getVisibleCells().map((cell) => {
            const meta = cell.column.columnDef.meta
            const align = meta?.align ?? 'start'
            const width = meta?.width
            const pin = cell.column.getIsPinned()
            const isLastLeftPinned =
              pin === 'left' && cell.column.getIsLastColumn('left')
            const isFirstRightPinned =
              pin === 'right' && cell.column.getIsFirstColumn('right')
            const stickyStyle = computeStickyStyle(cell)
            return (
              <td
                key={cell.id}
                className={cx(
                  cellRecipe({ density, align }),
                  pin ? stickyBodyCellStyle : null,
                  isLastLeftPinned ? stickyEdgeLeftStyle : null,
                  isFirstRightPinned ? stickyEdgeRightStyle : null,
                )}
                style={{
                  ...(width ? { width } : null),
                  ...stickyStyle,
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            )
          })}
        </tr>
      ))}
    </tbody>
  )
}
