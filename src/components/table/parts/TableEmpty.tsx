import type { ReactNode } from 'react'

import { Empty } from '~/components/ui/Empty'

import { emptyRowStyle } from '../DataTable.css'

export interface TableEmptyProps {
  columns: number
  children?: ReactNode
}

export const TableEmpty = ({ columns, children }: TableEmptyProps) => {
  return (
    <tr>
      <td colSpan={columns} className={emptyRowStyle}>
        {children ?? <Empty title="暂无数据" />}
      </td>
    </tr>
  )
}
