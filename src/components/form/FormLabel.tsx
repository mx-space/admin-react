import type { LabelHTMLAttributes, ReactNode } from 'react'

import { cx } from '~/utils/cx'

import { labelStyle, requiredMarkStyle } from './form.css'

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  children?: ReactNode
}

export const FormLabel = ({
  required,
  className,
  children,
  ...rest
}: FormLabelProps) => (
  <label className={cx(labelStyle, className)} {...rest}>
    {children}
    {required ? (
      <span className={requiredMarkStyle} aria-hidden>
        *
      </span>
    ) : null}
  </label>
)
