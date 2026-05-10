import { forwardRef } from 'react'
import type { CSSProperties, HTMLAttributes } from 'react'

import { cx } from '~/utils/cx'

import {
  groupStyle,
  skeletonRecipe,
  type SkeletonVariants,
} from './Skeleton.css'

type Shape = NonNullable<SkeletonVariants['shape']>

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: Shape
  width?: CSSProperties['width']
  height?: CSSProperties['height']
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    { shape = 'rect', width, height, className, style, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="status"
        aria-busy
        aria-live="polite"
        className={cx(skeletonRecipe({ shape }), className)}
        style={{ width, height, ...style }}
        {...rest}
      />
    )
  },
)

export interface SkeletonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of text lines to render. */
  lines?: number
}

export const SkeletonGroup = forwardRef<HTMLDivElement, SkeletonGroupProps>(
  function SkeletonGroup({ lines = 3, className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx(groupStyle, className)} {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            shape="text"
            width={i === lines - 1 ? '60%' : '100%'}
          />
        ))}
      </div>
    )
  },
)
