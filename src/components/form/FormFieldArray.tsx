import type { ReactNode } from 'react'
import type { AnyFieldApi, DeepKeys, DeepValue } from '@tanstack/react-form'

import { useFormApi } from './Form'

export interface FormFieldArrayApi<TValues, TName extends DeepKeys<TValues>> {
  field: AnyFieldApi
  items: DeepValue<TValues, TName> extends ReadonlyArray<infer Item>
    ? Item[]
    : unknown[]
  pushValue: (value: unknown) => void
  removeValue: (index: number) => void
  swapValues: (a: number, b: number) => void
  moveValue: (from: number, to: number) => void
  insertValue: (index: number, value: unknown) => void
}

export interface FormFieldArrayProps<TValues, TName extends DeepKeys<TValues>> {
  name: TName
  /** Render-prop receives helpers bound to this array field. */
  render: (api: FormFieldArrayApi<TValues, TName>) => ReactNode
}

export function FormFieldArray<TValues, TName extends DeepKeys<TValues>>({
  name,
  render,
}: FormFieldArrayProps<TValues, TName>) {
  const FormFieldRender = (useFormApi() as {
    Field: (props: {
      name: TName
      mode: 'array'
      children: (field: AnyFieldApi) => ReactNode
    }) => ReactNode
  }).Field

  return (
    <FormFieldRender name={name} mode="array">
      {(field) =>
        render({
          field,
          items: field.state.value as FormFieldArrayApi<TValues, TName>['items'],
          pushValue: (value) => field.pushValue(value),
          removeValue: (index) => field.removeValue(index),
          swapValues: (a, b) => field.swapValues(a, b),
          moveValue: (from, to) => field.moveValue(from, to),
          insertValue: (index, value) => field.insertValue(index, value),
        })
      }
    </FormFieldRender>
  )
}
