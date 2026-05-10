import type { HTMLAttributes, ReactNode } from 'react'
import type { AnyFieldApi, DeepKeys } from '@tanstack/react-form'

import { cx } from '~/utils/cx'

import { useFormApi } from './Form'
import { messageStyle } from './form.css'
import { stringifyError } from './stringifyError'

export interface FormMessageProps<TValues, TName extends DeepKeys<TValues>>
  extends HTMLAttributes<HTMLParagraphElement> {
  name: TName
}

export function FormMessage<TValues, TName extends DeepKeys<TValues>>({
  name,
  className,
  ...rest
}: FormMessageProps<TValues, TName>) {
  const FormFieldRender = (useFormApi() as {
    Field: (props: {
      name: TName
      children: (field: AnyFieldApi) => ReactNode
    }) => ReactNode
  }).Field
  return (
    <FormFieldRender name={name}>
      {(field) => {
        const error = field.state.meta.errors[0]
        if (!error) return null
        return (
          <p className={cx(messageStyle, className)} role="alert" {...rest}>
            {stringifyError(error)}
          </p>
        )
      }}
    </FormFieldRender>
  )
}
