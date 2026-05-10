import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { cx } from '~/utils/cx'

import { spaceRecipe, type SpaceVariants } from './Space.css'

type Direction = NonNullable<SpaceVariants['direction']>
type Gap = NonNullable<SpaceVariants['gap']>
type Align = NonNullable<SpaceVariants['align']>
type Justify = NonNullable<SpaceVariants['justify']>

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  direction?: Direction
  gap?: Gap
  align?: Align
  justify?: Justify
  wrap?: boolean
}

export const Space = forwardRef<HTMLDivElement, SpaceProps>(function Space(
  {
    direction = 'row',
    gap = 'sm',
    align = 'center',
    justify = 'start',
    wrap = false,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        spaceRecipe({ direction, gap, align, justify, wrap }),
        className,
      )}
      {...rest}
    />
  )
})
