import type { CSSProperties } from 'react'
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from 'lucide-react'
import { flexRender, type Header, type Table } from '@tanstack/react-table'

import { cx } from '~/utils/cx'

import {
  headerCellRecipe,
  headerRowStyle,
  sortIconActiveStyle,
  sortIconStyle,
  stickyHeaderCellStyle,
  stickyHeaderEdgeLeftStyle,
  stickyHeaderEdgeRightStyle,
  theadStyle,
} from '../DataTable.css'

export interface TableHeaderProps<T> {
  instance: Table<T>
}

const computeStickyStyle = <T,>(
  header: Header<T, unknown>,
): CSSProperties | undefined => {
  const pin = header.column.getIsPinned()
  if (!pin) return undefined
  if (pin === 'left') {
    return { position: 'sticky', left: `${header.column.getStart('left')}px` }
  }
  return { position: 'sticky', right: `${header.column.getAfter('right')}px` }
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

            const pin = header.column.getIsPinned()
            const isLastLeftPinned =
              pin === 'left' && header.column.getIsLastColumn('left')
            const isFirstRightPinned =
              pin === 'right' && header.column.getIsFirstColumn('right')
            const stickyStyle = computeStickyStyle(header)

            return (
              <th
                key={header.id}
                className={cx(
                  headerCellRecipe({ sortable, sorted, align }),
                  pin ? stickyHeaderCellStyle : null,
                  isLastLeftPinned ? stickyHeaderEdgeLeftStyle : null,
                  isFirstRightPinned ? stickyHeaderEdgeRightStyle : null,
                )}
                style={{ width, ...stickyStyle }}
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
