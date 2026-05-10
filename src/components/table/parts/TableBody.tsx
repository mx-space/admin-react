import { flexRender, type Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import type { TableDensity } from '~/atoms/table'

import { cellRecipe, rowRecipe } from '../DataTable.css'

import { TableEmpty } from './TableEmpty'
import { TableLoading } from './TableLoading'

export interface TableBodyProps<T> {
  instance: Table<T>
  loading?: boolean
  density?: TableDensity
  empty?: ReactNode
  onRowClick?: (row: T) => void
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
            return (
              <td
                key={cell.id}
                className={cellRecipe({ density, align })}
                style={width ? { width } : undefined}
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
