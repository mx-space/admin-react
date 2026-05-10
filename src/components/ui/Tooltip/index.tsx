import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import { forwardRef } from 'react'
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ReactNode,
} from 'react'

import { cx } from '~/utils/cx'

import {
  popupRecipe,
  positionerStyle,
  type PopupVariants,
} from './Tooltip.css'

type Tone = NonNullable<PopupVariants['tone']>

type WithStringClassName<P> = Omit<P, 'className'> & { className?: string }

type RootProps = ComponentPropsWithoutRef<typeof BaseTooltip.Root>
type TriggerProps = ComponentPropsWithRef<typeof BaseTooltip.Trigger>
type PortalProps = ComponentPropsWithoutRef<typeof BaseTooltip.Portal>
type PositionerBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseTooltip.Positioner>
>
type PopupBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseTooltip.Popup>
>
type ProviderProps = ComponentPropsWithoutRef<typeof BaseTooltip.Provider>

const Root = (props: RootProps) => <BaseTooltip.Root {...props} />

const Provider = (props: ProviderProps) => <BaseTooltip.Provider {...props} />

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function Trigger(
  props,
  ref,
) {
  return <BaseTooltip.Trigger ref={ref} {...props} />
})

const Portal = (props: PortalProps) => <BaseTooltip.Portal {...props} />

const Positioner = forwardRef<HTMLDivElement, PositionerBaseProps>(
  function Positioner({ className, sideOffset = 6, ...rest }, ref) {
    return (
      <BaseTooltip.Positioner
        ref={ref}
        sideOffset={sideOffset}
        className={cx(positionerStyle, className)}
        {...rest}
      />
    )
  },
)

export interface TooltipPopupProps extends PopupBaseProps {
  tone?: Tone
}

const Popup = forwardRef<HTMLDivElement, TooltipPopupProps>(function Popup(
  { tone = 'default', className, ...rest },
  ref,
) {
  return (
    <BaseTooltip.Popup
      ref={ref}
      className={cx(popupRecipe({ tone }), className)}
      {...rest}
    />
  )
})

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: PositionerBaseProps['side']
  align?: PositionerBaseProps['align']
  sideOffset?: PositionerBaseProps['sideOffset']
  tone?: Tone
  disabled?: boolean
  open?: RootProps['open']
  defaultOpen?: RootProps['defaultOpen']
  onOpenChange?: RootProps['onOpenChange']
}

export const Tooltip = ({
  content,
  children,
  side = 'top',
  align = 'center',
  sideOffset = 6,
  tone = 'default',
  disabled,
  open,
  defaultOpen,
  onOpenChange,
}: TooltipProps) => (
  <BaseTooltip.Root
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    disabled={disabled}
  >
    <BaseTooltip.Trigger
      render={children as React.ReactElement<Record<string, unknown>>}
    />
    <BaseTooltip.Portal>
      <Positioner side={side} align={align} sideOffset={sideOffset}>
        <Popup tone={tone}>{content}</Popup>
      </Positioner>
    </BaseTooltip.Portal>
  </BaseTooltip.Root>
)

Tooltip.Root = Root
Tooltip.Provider = Provider
Tooltip.Trigger = Trigger
Tooltip.Portal = Portal
Tooltip.Positioner = Positioner
Tooltip.Popup = Popup

export type TooltipRootProps = RootProps
export type TooltipProviderProps = ProviderProps
