import { Popover as BasePopover } from '@base-ui/react/popover'
import { forwardRef, useId } from 'react'
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
} from 'react'

import { ShortcutScope } from '~/lib/keymap'
import { cx } from '~/utils/cx'

import {
  backdropStyle,
  popupRecipe,
  positionerStyle,
  type PopupVariants,
} from './Popover.css'

type Padding = NonNullable<PopupVariants['padding']>
type Width = NonNullable<PopupVariants['width']>

type WithStringClassName<P> = Omit<P, 'className'> & { className?: string }

type RootProps = ComponentPropsWithoutRef<typeof BasePopover.Root>
type TriggerProps = ComponentPropsWithRef<typeof BasePopover.Trigger>
type PortalProps = ComponentPropsWithoutRef<typeof BasePopover.Portal>
type BackdropProps = WithStringClassName<
  ComponentPropsWithRef<typeof BasePopover.Backdrop>
>
type PositionerBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BasePopover.Positioner>
>
type PopupBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BasePopover.Popup>
>
type CloseProps = ComponentPropsWithRef<typeof BasePopover.Close>
type TitleProps = WithStringClassName<
  ComponentPropsWithRef<typeof BasePopover.Title>
>
type DescriptionProps = WithStringClassName<
  ComponentPropsWithRef<typeof BasePopover.Description>
>

const Root = (props: RootProps) => <BasePopover.Root {...props} />

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function Trigger(
  props,
  ref,
) {
  return <BasePopover.Trigger ref={ref} {...props} />
})

const Portal = (props: PortalProps) => <BasePopover.Portal {...props} />

const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(function Backdrop(
  { className, ...rest },
  ref,
) {
  return (
    <BasePopover.Backdrop
      ref={ref}
      className={cx(backdropStyle, className)}
      {...rest}
    />
  )
})

const Positioner = forwardRef<HTMLDivElement, PositionerBaseProps>(
  function Positioner({ className, sideOffset = 8, ...rest }, ref) {
    return (
      <BasePopover.Positioner
        ref={ref}
        sideOffset={sideOffset}
        className={cx(positionerStyle, className)}
        {...rest}
      />
    )
  },
)

export interface PopoverPopupProps extends PopupBaseProps {
  padding?: Padding
  width?: Width
}

const Popup = forwardRef<HTMLDivElement, PopoverPopupProps>(function Popup(
  { padding = 'sm', width = 'auto', className, children, ...rest },
  ref,
) {
  const scopeId = useId()
  return (
    <BasePopover.Popup
      ref={ref}
      className={cx(popupRecipe({ padding, width }), className)}
      {...rest}
    >
      <ShortcutScope id={`popover:${scopeId}`} kind="overlay">
        {children}
      </ShortcutScope>
    </BasePopover.Popup>
  )
})

const Close = forwardRef<HTMLButtonElement, CloseProps>(function Close(
  props,
  ref,
) {
  return <BasePopover.Close ref={ref} {...props} />
})

const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title(
  props,
  ref,
) {
  return <BasePopover.Title ref={ref} {...props} />
})

const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(
  function Description(props, ref) {
    return <BasePopover.Description ref={ref} {...props} />
  },
)

export const Popover = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Positioner,
  Popup,
  Close,
  Title,
  Description,
}

export type PopoverRootProps = RootProps
