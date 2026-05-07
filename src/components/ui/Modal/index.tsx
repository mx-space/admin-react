import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { forwardRef } from 'react'
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  HTMLAttributes,
} from 'react'

import { cx } from '~/utils/cx'

import {
  backdropStyle,
  bodyStyle,
  descriptionStyle,
  footerStyle,
  headerStyle,
  popupRecipe,
  type PopupVariants,
  titleStyle,
} from './Modal.css'

type ModalSize = NonNullable<PopupVariants['size']>

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
type TitleProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseDialog.Title>
>
type DescriptionProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseDialog.Description>
>

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

export interface ModalContentProps extends PopupBaseProps {
  size?: ModalSize
}

const Content = forwardRef<HTMLDivElement, ModalContentProps>(function Content(
  { size = 'md', className, ...rest },
  ref,
) {
  return (
    <BaseDialog.Popup
      ref={ref}
      className={cx(popupRecipe({ size }), className)}
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

const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title(
  { className, ...rest },
  ref,
) {
  return (
    <BaseDialog.Title
      ref={ref}
      className={cx(titleStyle, className)}
      {...rest}
    />
  )
})

const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(
  function Description({ className, ...rest }, ref) {
    return (
      <BaseDialog.Description
        ref={ref}
        className={cx(descriptionStyle, className)}
        {...rest}
      />
    )
  },
)

const Header = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(headerStyle, className)} {...rest}>
    {children}
  </div>
)

const Body = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(bodyStyle, className)} {...rest}>
    {children}
  </div>
)

const Footer = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(footerStyle, className)} {...rest}>
    {children}
  </div>
)

export const Modal = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Content,
  Close,
  Title,
  Description,
  Header,
  Body,
  Footer,
}

export type ModalRootProps = RootProps
