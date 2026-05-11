import { forwardRef } from 'react'
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
} from 'react'

import { cx } from '~/utils/cx'

import {
  centerStyle,
  dividerStyle,
  iconButtonRecipe,
  leftStyle,
  rightStyle,
  rootRecipe,
  type RootVariants,
} from './ColumnHeader.css'

type Size = NonNullable<RootVariants['size']>
type IconSize = 'sm' | 'md'

export interface ColumnHeaderProps extends HTMLAttributes<HTMLElement> {
  size?: Size
}

const Root = forwardRef<HTMLElement, ColumnHeaderProps>(function ColumnHeader(
  { size = 'compact', className, children, ...rest },
  ref,
) {
  return (
    <header ref={ref} className={cx(rootRecipe({ size }), className)} {...rest}>
      {children}
    </header>
  )
})

const Left = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function ColumnHeaderLeft({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(leftStyle, className)} {...rest} />
  },
)

const Center = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function ColumnHeaderCenter({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(centerStyle, className)} {...rest} />
  },
)

const Right = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function ColumnHeaderRight({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(rightStyle, className)} {...rest} />
  },
)

export interface ColumnHeaderIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: IconSize
  'aria-label': string
}

const IconButton = forwardRef<
  HTMLButtonElement,
  ColumnHeaderIconButtonProps
>(function ColumnHeaderIconButton(
  { size = 'sm', type = 'button', className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(iconButtonRecipe[size], className)}
      {...rest}
    />
  )
})

const Divider = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function ColumnHeaderDivider({ className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        aria-hidden
        className={cx(dividerStyle, className)}
        {...rest}
      />
    )
  },
)

export const ColumnHeader = Object.assign(Root, {
  Left,
  Center,
  Right,
  IconButton,
  Divider,
})

export type ColumnHeaderSize = Size
