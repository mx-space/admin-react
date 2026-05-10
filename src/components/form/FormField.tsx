import { useId, type ChangeEvent, type ReactNode } from 'react'
import type { AnyFieldApi, DeepKeys, DeepValue } from '@tanstack/react-form'

import { useFormApi } from './Form'
import { FormLabel } from './FormLabel'
import {
  fieldRowStyle,
  fieldStyle,
  helpStyle,
  messageStyle,
} from './form.css'
import { stringifyError } from './stringifyError'

export interface FormFieldRenderArgs<TValues, TName extends DeepKeys<TValues>> {
  field: {
    name: TName
    value: DeepValue<TValues, TName>
    onChange: (eventOrValue: unknown) => void
    onBlur: () => void
    id: string
    'aria-invalid'?: true
    'aria-describedby'?: string
  }
  invalid: boolean
  errors: unknown[]
  /** Raw Tanstack Form field API for advanced cases (push/swap/setMeta/...). */
  fieldApi: AnyFieldApi
  id: string
}

export interface FormFieldProps<TValues, TName extends DeepKeys<TValues>> {
  name: TName
  label?: ReactNode
  description?: ReactNode
  required?: boolean
  /** Render label + control on a single row (typical for switches / checkboxes). */
  inline?: boolean
  /** Override the control id (defaults to a stable React id). */
  controlId?: string
  children: (args: FormFieldRenderArgs<TValues, TName>) => ReactNode
}

function isReactChangeEvent(value: unknown): value is ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  return !!value && typeof value === 'object' && 'target' in value && 'nativeEvent' in (value as Record<string, unknown>)
}

function extractFromEvent(eventOrValue: unknown): unknown {
  if (!isReactChangeEvent(eventOrValue)) return eventOrValue
  const target = eventOrValue.target as HTMLInputElement
  if (target.type === 'checkbox') return target.checked
  if (target.type === 'number') {
    const num = target.valueAsNumber
    return Number.isNaN(num) ? '' : num
  }
  return target.value
}

export function FormField<TValues, TName extends DeepKeys<TValues>>({
  name,
  label,
  description,
  required,
  inline,
  controlId,
  children,
}: FormFieldProps<TValues, TName>) {
  const FormFieldRender = (useFormApi() as {
    Field: (props: {
      name: TName
      children: (field: AnyFieldApi) => ReactNode
    }) => ReactNode
  }).Field
  const reactId = useId()
  const id = controlId ?? `${reactId}-${String(name)}`

  return (
    <FormFieldRender name={name}>
      {(fieldApi) => {
        const errors = fieldApi.state.meta.errors as unknown[]
        const submissionAttempts =
          (fieldApi.form?.state?.submissionAttempts as number) ?? 0
        const showError =
          errors.length > 0 &&
          (fieldApi.state.meta.isTouched || submissionAttempts > 0)
        const messageId = showError ? `${id}-msg` : undefined

        const renderArgs: FormFieldRenderArgs<TValues, TName> = {
          field: {
            name,
            value: fieldApi.state.value as DeepValue<TValues, TName>,
            onChange: (eventOrValue: unknown) =>
              fieldApi.handleChange(extractFromEvent(eventOrValue) as never),
            onBlur: () => fieldApi.handleBlur(),
            id,
            'aria-invalid': showError ? true : undefined,
            'aria-describedby': messageId,
          },
          invalid: showError,
          errors,
          fieldApi,
          id,
        }
        const body = children(renderArgs)
        const message = showError ? (
          <p className={messageStyle} role="alert" id={messageId}>
            {stringifyError(errors[0])}
          </p>
        ) : null
        const wrapperClass = inline ? fieldRowStyle : fieldStyle

        return (
          <div className={wrapperClass}>
            {label ? (
              <FormLabel htmlFor={id} required={required}>
                {label}
              </FormLabel>
            ) : null}
            {inline ? <div>{body}</div> : (
              <>
                {body}
                {description ? <p className={helpStyle}>{description}</p> : null}
                {message}
              </>
            )}
            {inline && message ? message : null}
          </div>
        )
      }}
    </FormFieldRender>
  )
}

