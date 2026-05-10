import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { forwardRef } from 'react'
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
} from 'react'

import { cx } from '~/utils/cx'

import {
  backdropStyle,
  popupRecipe,
  type PopupVariants,
} from './Drawer.css'

type Placement = NonNullable<PopupVariants['placement']>
type Size = NonNullable<PopupVariants['size']>

type WithStringClassName<P> = Omit<P, 'className'> & { className?: string }

type RootProps = ComponentPropsWithoutRef<typeof BaseDialog.Root>
type TriggerProps = ComponentPropsWithRef<typeof BaseDialog.Trigger>
type PortalProps = ComponentPropsWithoutRef<typeof BaseDialog.Portal>
type BackdropProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseDialog.Backdrop>
>
type PopupBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseDialog.Popup>
>
type CloseProps = ComponentPropsWithRef<typeof BaseDialog.Close>

const Root = (props: RootProps) => <BaseDialog.Root {...props} />

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function Trigger(
  props,
  ref,
) {
  return <BaseDialog.Trigger ref={ref} {...props} />
})

const Portal = (props: PortalProps) => <BaseDialog.Portal {...props} />

const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(function Backdrop(
  { className, ...rest },
  ref,
) {
  return (
    <BaseDialog.Backdrop
      ref={ref}
      className={cx(backdropStyle, className)}
      {...rest}
    />
  )
})

export interface DrawerContentProps extends PopupBaseProps {
  placement?: Placement
  size?: Size
}

const Content = forwardRef<HTMLDivElement, DrawerContentProps>(function Content(
  { placement = 'right', size = 'md', className, ...rest },
  ref,
) {
  return (
    <BaseDialog.Popup
      ref={ref}
      className={cx(popupRecipe({ placement, size }), className)}
      {...rest}
    />
  )
})

const Close = forwardRef<HTMLButtonElement, CloseProps>(function Close(
  props,
  ref,
) {
  return <BaseDialog.Close ref={ref} {...props} />
})

export const Drawer = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Content,
  Close,
}

export type DrawerRootProps = RootProps
