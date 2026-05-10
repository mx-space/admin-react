import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { forwardRef, useMemo } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

import { cx } from '~/utils/cx'

import { Select } from '../Select'

import {
  ellipsisStyle,
  pageButtonRecipe,
  pageListStyle,
  rootStyle,
  totalStyle,
} from './Pagination.css'

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current 1-based page index. */
  page: number
  /** Total number of items. */
  total: number
  /** Page size. */
  pageSize?: number
  /** Available page-size choices. Pass `false` to hide the selector. */
  pageSizeOptions?: number[] | false
  /** Number of sibling page links shown around the current page. */
  siblingCount?: number
  /** Hide the total-items label. */
  hideTotal?: boolean
  /** Format the total label. Default: `共 ${total} 条` */
  formatTotal?: (total: number) => ReactNode
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

const range = (start: number, end: number): number[] => {
  const out: number[] = []
  for (let i = start; i <= end; i++) out.push(i)
  return out
}

const ELLIPSIS = -1

const computeRange = (
  page: number,
  totalPages: number,
  siblingCount: number,
): Array<number> => {
  const total = Math.max(1, totalPages)
  const surrounding = siblingCount * 2 + 5 // first + last + current + 2 ellipsis-anchors + siblings*2
  if (total <= surrounding) return range(1, total)
  const left = Math.max(page - siblingCount, 2)
  const right = Math.min(page + siblingCount, total - 1)
  const showLeftEllipsis = left > 2
  const showRightEllipsis = right < total - 1
  const result: number[] = [1]
  if (showLeftEllipsis) result.push(ELLIPSIS)
  result.push(...range(left, right))
  if (showRightEllipsis) result.push(ELLIPSIS)
  result.push(total)
  return result
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  function Pagination(
    {
      page,
      total,
      pageSize = 20,
      pageSizeOptions = [10, 20, 50, 100],
      siblingCount = 1,
      hideTotal = false,
      formatTotal,
      onPageChange,
      onPageSizeChange,
      className,
      ...rest
    },
    ref,
  ) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const safePage = Math.min(Math.max(1, page), totalPages)

    const items = useMemo(
      () => computeRange(safePage, totalPages, siblingCount),
      [safePage, totalPages, siblingCount],
    )

    const goto = (next: number) => {
      const clamped = Math.min(Math.max(1, next), totalPages)
      if (clamped !== safePage) onPageChange(clamped)
    }

    const sizeItems = Array.isArray(pageSizeOptions)
      ? pageSizeOptions.map((size) => ({
          label: `${size} / 页`,
          value: String(size),
        }))
      : null

    return (
      <div ref={ref} className={cx(rootStyle, className)} {...rest}>
        {!hideTotal ? (
          <span className={totalStyle}>
            {formatTotal ? formatTotal(total) : `共 ${total} 条`}
          </span>
        ) : null}

        <div className={pageListStyle}>
          <button
            type="button"
            className={pageButtonRecipe({})}
            disabled={safePage <= 1}
            aria-label="Previous page"
            onClick={() => goto(safePage - 1)}
          >
            <ChevronLeftIcon size={14} />
          </button>

          {items.map((value, idx) =>
            value === ELLIPSIS ? (
              <span key={`e-${idx}`} className={ellipsisStyle} aria-hidden>
                …
              </span>
            ) : (
              <button
                key={value}
                type="button"
                className={pageButtonRecipe({
                  active: value === safePage,
                })}
                aria-current={value === safePage ? 'page' : undefined}
                onClick={() => goto(value)}
              >
                {value}
              </button>
            ),
          )}

          <button
            type="button"
            className={pageButtonRecipe({})}
            disabled={safePage >= totalPages}
            aria-label="Next page"
            onClick={() => goto(safePage + 1)}
          >
            <ChevronRightIcon size={14} />
          </button>
        </div>

        {sizeItems && onPageSizeChange ? (
          <Select.Root
            items={sizeItems}
            value={String(pageSize)}
            onValueChange={(v) => {
              const next = Number(v)
              if (Number.isFinite(next) && next > 0) onPageSizeChange(next)
            }}
          >
            <Select.Trigger size="sm" aria-label="Page size">
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner>
                <Select.Popup>
                  {sizeItems.map((item) => (
                    <Select.Item key={item.value} value={item.value}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        ) : null}
      </div>
    )
  },
)
