import {
  createContext,
  useContext,
  type FormHTMLAttributes,
  type ReactNode,
} from 'react'

import { cx } from '~/utils/cx'

import { formStyle, rootMessageStyle } from './form.css'
import { stringifyError } from './stringifyError'

type SubscribeProps = {
  selector: (state: { errorMap: Record<string, unknown> }) => unknown
  children: (selected: unknown) => ReactNode
}

type RuntimeFormShape = {
  handleSubmit: () => Promise<unknown> | unknown
  Subscribe: (props: SubscribeProps) => ReactNode
}

const FormContext = createContext<unknown>(null)

export const useFormApi = <TForm = unknown,>(): TForm => {
  const ctx = useContext(FormContext)
  if (ctx == null) {
    throw new Error('useFormApi must be used inside a <Form>.')
  }
  return ctx as TForm
}

export interface FormProps<TForm>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  form: TForm
  /** Render the root error banner (form-level errors from validators or `setErrorMap`). Default: true. */
  showRootError?: boolean
  children: ReactNode
}

export function Form<TForm>({
  form,
  className,
  showRootError = true,
  children,
  ...rest
}: FormProps<TForm>) {
  const runtime = form as unknown as RuntimeFormShape
  const Subscribe = runtime.Subscribe

  return (
    <FormContext.Provider value={form}>
      <form
        noValidate
        className={cx(formStyle, className)}
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void runtime.handleSubmit()
        }}
        {...rest}
      >
        {showRootError ? (
          <Subscribe
            selector={(state) =>
              state.errorMap.onSubmit ?? state.errorMap.onServer
            }
          >
            {(rootError) =>
              rootError ? (
                <div className={rootMessageStyle} role="alert">
                  {stringifyError(rootError)}
                </div>
              ) : null
            }
          </Subscribe>
        ) : null}
        {children}
      </form>
    </FormContext.Provider>
  )
}
