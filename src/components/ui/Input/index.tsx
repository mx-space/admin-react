import { forwardRef } from 'react'
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

import { cx } from '~/utils/cx'

import {
  inputAffixStyle,
  inputFieldStyle,
  inputRootRecipe,
  type InputRootVariants,
} from './Input.css'

type InputIntent = NonNullable<InputRootVariants['intent']>
type InputSize = NonNullable<InputRootVariants['size']>

export interface InputRootProps extends HTMLAttributes<HTMLDivElement> {
  intent?: InputIntent
  size?: InputSize
  disabled?: boolean
}

export const InputRoot = forwardRef<HTMLDivElement, InputRootProps>(
  function InputRoot(
    { intent = 'default', size = 'md', disabled, className, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-disabled={disabled || undefined}
        className={cx(
          inputRootRecipe({
            intent,
            size,
            state: disabled ? 'disabled' : undefined,
          }),
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

export interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  invalid?: boolean
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ className, invalid, ...rest }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cx(inputFieldStyle, className)}
        {...rest}
      />
    )
  },
)

export interface InputAffixProps extends HTMLAttributes<HTMLSpanElement> {}

export const InputAffix = ({ className, children, ...rest }: InputAffixProps) => (
  <span className={cx(inputAffixStyle, className)} {...rest}>
    {children}
  </span>
)

export interface InputProps
  extends Omit<InputFieldProps, 'children' | 'prefix'> {
  intent?: InputIntent
  size?: InputSize
  prefix?: ReactNode
  suffix?: ReactNode
  rootClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    intent = 'default',
    size = 'md',
    prefix,
    suffix,
    rootClassName,
    invalid,
    disabled,
    ...rest
  },
  ref,
) {
  const resolvedIntent: InputIntent = invalid ? 'danger' : intent
  return (
    <InputRoot
      intent={resolvedIntent}
      size={size}
      disabled={disabled}
      className={rootClassName}
    >
      {prefix ? <InputAffix>{prefix}</InputAffix> : null}
      <InputField ref={ref} disabled={disabled} invalid={invalid} {...rest} />
      {suffix ? <InputAffix>{suffix}</InputAffix> : null}
    </InputRoot>
  )
})
