import { useEffect } from 'react'

import { Pagination } from '~/components/ui/Pagination'

import type { TableState } from '~/atoms/table'

import { paginationFooterStyle } from '../DataTable.css'
import type { StateUpdater } from '../hooks/useDataTable'

export interface TablePaginationProps {
  state: TableState
  setState: (updater: StateUpdater) => void
  totalCount: number
  pageSizeOptions?: number[] | false
  className?: string
}

export const TablePagination = ({
  state,
  setState,
  totalCount,
  pageSizeOptions,
  className,
}: TablePaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / state.pageSize))

  useEffect(() => {
    if (state.page > totalPages) {
      setState((prev) => ({ ...prev, page: Math.max(1, totalPages) }))
    }
  }, [state.page, totalPages, setState])

  return (
    <div className={`${paginationFooterStyle} ${className ?? ''}`}>
      <Pagination
        page={state.page}
        total={totalCount}
        pageSize={state.pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageChange={(p) =>
          setState((prev) => ({ ...prev, page: p }))
        }
        onPageSizeChange={(s) =>
          setState((prev) => ({
            ...prev,
            pageSize: s,
            page: 1,
            selectedRowKeys: [],
          }))
        }
      />
    </div>
  )
}
