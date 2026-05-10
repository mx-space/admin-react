import type { ColumnDef } from '@tanstack/react-table'

import { TableSelectionCell } from '../parts/TableSelectionCell'

export interface SelectionColumnOptions<T> {
  mode: 'single' | 'multiple'
  isRowSelectable?: (row: T) => boolean
}

export const createSelectionColumn = <T,>({
  mode,
  isRowSelectable,
}: SelectionColumnOptions<T>): ColumnDef<T> => ({
  id: '__selection__',
  size: 36,
  enableSorting: false,
  meta: { align: 'center', width: 36, fixed: 'left' },
  header: ({ table }) =>
    mode === 'multiple' ? (
      <TableSelectionCell
        kind="header"
        checked={table.getIsAllRowsSelected()}
        indeterminate={
          table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        }
        onChange={(v) => table.toggleAllRowsSelected(v)}
      />
    ) : null,
  cell: ({ row }) => {
    const allowed = isRowSelectable ? isRowSelectable(row.original) : true
    return (
      <TableSelectionCell
        kind={mode === 'multiple' ? 'row' : 'radio'}
        checked={row.getIsSelected()}
        disabled={!allowed}
        onChange={(v) => {
          if (!allowed) return
          row.toggleSelected(v)
        }}
      />
    )
  },
})
