import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cx } from '~/utils/cx'

import {
  cornerStyle,
  rootStyle,
  scrollbarStyle,
  thumbStyle,
  viewportStyle,
} from './Scroll.css'

type RootBaseProps = Omit<
  ComponentPropsWithoutRef<typeof BaseScrollArea.Root>,
  'className'
> & { className?: string }

export interface ScrollProps extends RootBaseProps {
  /** Which axes are scrollable. Defaults to vertical only. */
  orientation?: 'vertical' | 'horizontal' | 'both'
  children?: ReactNode
}

export const Scroll = forwardRef<HTMLDivElement, ScrollProps>(function Scroll(
  { orientation = 'vertical', className, children, ...rest },
  ref,
) {
  return (
    <BaseScrollArea.Root
      ref={ref}
      className={cx(rootStyle, className)}
      {...rest}
    >
      <BaseScrollArea.Viewport className={viewportStyle}>
        {children}
      </BaseScrollArea.Viewport>
      {(orientation === 'vertical' || orientation === 'both') && (
        <BaseScrollArea.Scrollbar
          orientation="vertical"
          className={scrollbarStyle}
        >
          <BaseScrollArea.Thumb className={thumbStyle} />
        </BaseScrollArea.Scrollbar>
      )}
      {(orientation === 'horizontal' || orientation === 'both') && (
        <BaseScrollArea.Scrollbar
          orientation="horizontal"
          className={scrollbarStyle}
        >
          <BaseScrollArea.Thumb className={thumbStyle} />
        </BaseScrollArea.Scrollbar>
      )}
      {orientation === 'both' && (
        <BaseScrollArea.Corner className={cornerStyle} />
      )}
    </BaseScrollArea.Root>
  )
})
