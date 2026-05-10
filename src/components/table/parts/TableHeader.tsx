import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from 'lucide-react'
import { flexRender, type Table } from '@tanstack/react-table'

import { cx } from '~/utils/cx'

import {
  headerCellRecipe,
  headerRowStyle,
  sortIconActiveStyle,
  sortIconStyle,
  theadStyle,
} from '../DataTable.css'

export interface TableHeaderProps<T> {
  instance: Table<T>
}

export const TableHeader = <T,>({ instance }: TableHeaderProps<T>) => {
  return (
    <thead className={theadStyle}>
      {instance.getHeaderGroups().map((group) => (
        <tr key={group.id} className={headerRowStyle}>
          {group.headers.map((header) => {
            const meta = header.column.columnDef.meta
            const sortable =
              header.column.getCanSort() && (meta?.sortable ?? false)
            const sortDir = header.column.getIsSorted()
            const sorted = sortDir !== false
            const align = meta?.align ?? 'start'
            const width = meta?.width ?? header.getSize()

            return (
              <th
                key={header.id}
                className={headerCellRecipe({
                  sortable,
                  sorted,
                  align,
                })}
                style={{ width }}
                onClick={
                  sortable
                    ? header.column.getToggleSortingHandler()
                    : undefined
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                {sortable ? (
                  <span
                    className={cx(
                      sortIconStyle,
                      sorted ? sortIconActiveStyle : null,
                    )}
                  >
                    {sortDir === 'asc' ? (
                      <ChevronUpIcon size={11} />
                    ) : sortDir === 'desc' ? (
                      <ChevronDownIcon size={11} />
                    ) : (
                      <ChevronsUpDownIcon size={11} />
                    )}
                  </span>
                ) : null}
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}
