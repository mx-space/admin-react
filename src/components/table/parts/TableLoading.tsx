import { Skeleton } from '~/components/ui/Skeleton'

import { cellRecipe, skeletonRowStyle } from '../DataTable.css'

import type { TableDensity } from '~/atoms/table'

export interface TableLoadingProps {
  rows?: number
  columns: number
  density?: TableDensity
}

export const TableLoading = ({
  rows = 8,
  columns,
  density = 'comfortable',
}: TableLoadingProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, ri) => (
        <tr key={`sk-${ri}`} className={skeletonRowStyle}>
          {Array.from({ length: columns }).map((__, ci) => (
            <td
              key={`sk-${ri}-${ci}`}
              className={cellRecipe({ density, align: 'start' })}
            >
              <Skeleton
                shape="text"
                height={11}
                width={`${40 + ((ri + ci) % 4) * 12}%`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
