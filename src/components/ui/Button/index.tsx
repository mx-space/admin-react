import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '~/utils/cx'

import { buttonRecipe, type ButtonVariants } from './Button.css'
import { Spinner } from './Spinner'

type RecipeIntent = NonNullable<ButtonVariants['intent']>
type RecipeSize = NonNullable<ButtonVariants['size']>

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  intent?: RecipeIntent
  size?: RecipeSize
  loading?: boolean
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  startIcon?: ReactNode
  endIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      intent = 'secondary',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      startIcon,
      endIcon,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
        className={cx(
          buttonRecipe({
            intent,
            size,
            state: isDisabled ? 'disabled' : undefined,
          }),
          className,
        )}
        {...rest}
      >
        {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} /> : startIcon}
        {children}
        {!loading && endIcon}
      </button>
    )
  },
)
