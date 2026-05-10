import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

import { cx } from '~/utils/cx'

import {
  badgeRecipe,
  standaloneRecipe,
  wrapperStyle,
  type BadgeVariants,
} from './Badge.css'

type Tone = NonNullable<BadgeVariants['tone']>
type Shape = NonNullable<BadgeVariants['shape']>

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  shape?: Shape
  /** Numeric value; values above `max` render as `${max}+`. */
  count?: number
  max?: number
  /** Hide the badge when count is 0 (still shows for `dot`). Defaults to `true`. */
  showZero?: boolean
  /** Children to wrap; when provided, badge anchors to top-right. Without children renders standalone. */
  children?: ReactNode
}

const formatCount = (count: number, max: number) =>
  count > max ? `${max}+` : `${count}`

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    tone = 'danger',
    shape = 'number',
    count,
    max = 99,
    showZero = true,
    children,
    className,
    ...rest
  },
  ref,
) {
  const hasCount = typeof count === 'number'
  const hidden =
    shape === 'number' && hasCount && count === 0 && !showZero
  const label =
    shape === 'dot'
      ? null
      : hasCount
        ? formatCount(count, max)
        : null

  if (children === undefined) {
    return (
      <span
        ref={ref}
        className={cx(standaloneRecipe({ tone, shape }), className)}
        {...rest}
      >
        {label}
      </span>
    )
  }

  return (
    <span className={wrapperStyle}>
      {children}
      {hidden ? null : (
        <span
          ref={ref}
          className={cx(badgeRecipe({ tone, shape }), className)}
          {...rest}
        >
          {label}
        </span>
      )}
    </span>
  )
})
