import { Progress as BaseProgress } from '@base-ui/react/progress'
import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cx } from '~/utils/cx'

import {
  indicatorRecipe,
  labelRowStyle,
  rootStyle,
  trackRecipe,
  valueStyle,
  type IndicatorVariants,
  type TrackVariants,
} from './Progress.css'

type Size = NonNullable<TrackVariants['size']>
type Tone = NonNullable<IndicatorVariants['tone']>

type RootBaseProps = Omit<
  ComponentPropsWithoutRef<typeof BaseProgress.Root>,
  'className'
> & { className?: string }

export interface ProgressProps extends RootBaseProps {
  size?: Size
  tone?: Tone
  label?: ReactNode
  /** Hide the percent value next to the label. */
  hideValue?: boolean
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(
    { size = 'md', tone = 'primary', label, hideValue, className, value, max = 100, ...rest },
    ref,
  ) {
    return (
      <BaseProgress.Root
        ref={ref}
        value={value ?? null}
        max={max}
        className={cx(rootStyle, className)}
        {...rest}
      >
        {label || !hideValue ? (
          <div className={labelRowStyle}>
            {label ? <BaseProgress.Label>{label}</BaseProgress.Label> : <span />}
            {!hideValue ? (
              <BaseProgress.Value className={valueStyle} />
            ) : null}
          </div>
        ) : null}
        <BaseProgress.Track className={trackRecipe({ size })}>
          <BaseProgress.Indicator className={indicatorRecipe({ tone })} />
        </BaseProgress.Track>
      </BaseProgress.Root>
    )
  },
)
