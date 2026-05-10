import { forwardRef, useEffect, useRef, useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

import { cx } from '~/utils/cx'

import { Tooltip } from '../Tooltip'

import { ellipsisRecipe } from './Ellipsis.css'

export interface EllipsisProps extends HTMLAttributes<HTMLSpanElement> {
  /** Use `display: block` (full-width truncation in flex/grid). */
  block?: boolean
  /** Tooltip content shown when overflowing; falls back to children when string. */
  tooltip?: ReactNode
  /** Disable the auto-tooltip wrapping. */
  noTooltip?: boolean
}

export const Ellipsis = forwardRef<HTMLSpanElement, EllipsisProps>(
  function Ellipsis(
    { block = false, tooltip, noTooltip, className, children, ...rest },
    forwardedRef,
  ) {
    const innerRef = useRef<HTMLSpanElement | null>(null)
    const [overflowing, setOverflowing] = useState(false)

    const setRefs = (node: HTMLSpanElement | null) => {
      innerRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef)
        (
          forwardedRef as React.MutableRefObject<HTMLSpanElement | null>
        ).current = node
    }

    useEffect(() => {
      if (noTooltip) return
      const node = innerRef.current
      if (!node) return
      const measure = () => {
        setOverflowing(node.scrollWidth > node.offsetWidth + 1)
      }
      measure()
      const ro = new ResizeObserver(measure)
      ro.observe(node)
      return () => ro.disconnect()
    }, [noTooltip, children])

    const node = (
      <span
        ref={setRefs}
        className={cx(ellipsisRecipe({ block }), className)}
        {...rest}
      >
        {children}
      </span>
    )

    if (noTooltip || !overflowing) return node

    const tip =
      tooltip !== undefined
        ? tooltip
        : typeof children === 'string'
          ? children
          : null

    if (tip == null) return node
    return <Tooltip content={tip}>{node}</Tooltip>
  },
)
