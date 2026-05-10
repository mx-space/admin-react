import { Select as BaseSelect } from '@base-ui/react/select'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { forwardRef } from 'react'
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
} from 'react'

import { cx } from '~/utils/cx'

import { Scroll } from '../Scroll'

import {
  iconStyle,
  itemIndicatorStyle,
  itemRecipe,
  popupStyle,
  positionerStyle,
  triggerRecipe,
  valueStyle,
  type TriggerVariants,
} from './Select.css'

type Size = NonNullable<TriggerVariants['size']>

type WithStringClassName<P> = Omit<P, 'className'> & { className?: string }

type RootProps = ComponentPropsWithoutRef<typeof BaseSelect.Root>
type TriggerBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseSelect.Trigger>
>
type ValueBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseSelect.Value>
>
type IconBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseSelect.Icon>
>
type PortalProps = ComponentPropsWithoutRef<typeof BaseSelect.Portal>
type PositionerBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseSelect.Positioner>
>
type PopupBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseSelect.Popup>
>
type ItemBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseSelect.Item>
>

const Root = (props: RootProps) => <BaseSelect.Root {...props} />

export interface SelectTriggerProps extends TriggerBaseProps {
  size?: Size
}

const Trigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ size = 'md', className, children, ...rest }, ref) {
    return (
      <BaseSelect.Trigger
        ref={ref}
        className={cx(triggerRecipe({ size }), className)}
        {...rest}
      >
        {children}
      </BaseSelect.Trigger>
    )
  },
)

const Value = forwardRef<HTMLSpanElement, ValueBaseProps>(function SelectValue(
  { className, ...rest },
  ref,
) {
  return (
    <BaseSelect.Value
      ref={ref}
      className={cx(valueStyle, className)}
      {...rest}
    />
  )
})

const Icon = forwardRef<HTMLSpanElement, IconBaseProps>(function SelectIcon(
  { className, children, ...rest },
  ref,
) {
  return (
    <BaseSelect.Icon
      ref={ref}
      className={cx(iconStyle, className)}
      {...rest}
    >
      {children ?? <ChevronDownIcon size={14} />}
    </BaseSelect.Icon>
  )
})

const Portal = (props: PortalProps) => <BaseSelect.Portal {...props} />

const Positioner = forwardRef<HTMLDivElement, PositionerBaseProps>(
  function SelectPositioner({ className, sideOffset = 6, ...rest }, ref) {
    return (
      <BaseSelect.Positioner
        ref={ref}
        sideOffset={sideOffset}
        className={cx(positionerStyle, className)}
        {...rest}
      />
    )
  },
)

const Popup = forwardRef<HTMLDivElement, PopupBaseProps>(function SelectPopup(
  { className, children, ...rest },
  ref,
) {
  return (
    <BaseSelect.Popup
      ref={ref}
      className={cx(popupStyle, className)}
      {...rest}
    >
      <Scroll>{children}</Scroll>
    </BaseSelect.Popup>
  )
})

const Item = forwardRef<HTMLDivElement, ItemBaseProps>(function SelectItem(
  { className, children, ...rest },
  ref,
) {
  return (
    <BaseSelect.Item
      ref={ref}
      className={cx(itemRecipe(), className)}
      {...rest}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className={itemIndicatorStyle}>
        <CheckIcon size={14} />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  )
})

export const Select = {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Positioner,
  Popup,
  Item,
}

export type SelectRootProps = RootProps
