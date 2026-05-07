import { Toaster, toast } from 'sonner'
import type { ComponentProps } from 'react'

import { cx } from '~/utils/cx'

import { toastStyle, toasterStyle } from './Toast.css'

export type ToastViewportProps = Omit<ComponentProps<typeof Toaster>, 'theme'> & {
  theme?: ComponentProps<typeof Toaster>['theme']
}

export const ToastViewport = ({
  position = 'bottom-right',
  theme = 'dark',
  className,
  toastOptions,
  ...rest
}: ToastViewportProps) => (
  <Toaster
    position={position}
    theme={theme}
    className={cx(toasterStyle, className)}
    toastOptions={{
      ...toastOptions,
      classNames: {
        toast: cx(toastStyle, toastOptions?.classNames?.toast),
        ...toastOptions?.classNames,
      },
    }}
    {...rest}
  />
)

export { toast }
