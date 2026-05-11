import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react'
import { forwardRef } from 'react'
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
} from 'react'

import { cx } from '~/utils/cx'

import {
  chipRemoveStyle,
  chipStyle,
  chipsStyle,
  clearStyle,
  emptyStyle,
  groupLabelStyle,
  groupStyle,
  iconStyle,
  inputStyle,
  itemIndicatorStyle,
  itemRecipe,
  listStyle,
  popupStyle,
  positionerStyle,
  triggerRecipe,
  type TriggerVariants,
} from './Combobox.css'

type Size = NonNullable<TriggerVariants['size']>

type WithStringClassName<P> = Omit<P, 'className'> & { className?: string }

type RootProps<Value, Multiple extends boolean | undefined = false> =
  ComponentPropsWithoutRef<typeof BaseCombobox.Root<Value, Multiple>>
type TriggerBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.Trigger>
>
type InputBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.Input>
>
type ChipsBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.Chips>
>
type ChipBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.Chip>
>
type ChipRemoveBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.ChipRemove>
>
type ClearBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.Clear>
>
type IconBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.Icon>
>
type PortalProps = ComponentPropsWithoutRef<typeof BaseCombobox.Portal>
type PositionerBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.Positioner>
>
type PopupBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.Popup>
>
type ListBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.List>
>
type ItemBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.Item>
>
type ItemIndicatorBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.ItemIndicator>
>
type EmptyBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.Empty>
>
type GroupBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.Group>
>
type GroupLabelBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseCombobox.GroupLabel>
>

function Root<Value, Multiple extends boolean | undefined = false>(
  props: RootProps<Value, Multiple>,
) {
  return <BaseCombobox.Root {...props} />
}

export interface ComboboxTriggerProps extends TriggerBaseProps {
  size?: Size
}

const Trigger = forwardRef<HTMLDivElement, ComboboxTriggerProps>(
  function ComboboxTrigger({ size = 'md', className, children, ...rest }, ref) {
    return (
      <BaseCombobox.InputGroup
        ref={ref}
        className={cx(triggerRecipe({ size }), className)}
        {...(rest as ComponentPropsWithRef<typeof BaseCombobox.InputGroup>)}
      >
        {children}
      </BaseCombobox.InputGroup>
    )
  },
)

const Input = forwardRef<HTMLInputElement, InputBaseProps>(
  function ComboboxInput({ className, ...rest }, ref) {
    return (
      <BaseCombobox.Input
        ref={ref}
        className={cx(inputStyle, className)}
        {...rest}
      />
    )
  },
)

const Chips = forwardRef<HTMLDivElement, ChipsBaseProps>(
  function ComboboxChips({ className, ...rest }, ref) {
    return (
      <BaseCombobox.Chips
        ref={ref}
        className={cx(chipsStyle, className)}
        {...rest}
      />
    )
  },
)

const Chip = forwardRef<HTMLDivElement, ChipBaseProps>(function ComboboxChip(
  { className, children, ...rest },
  ref,
) {
  return (
    <BaseCombobox.Chip
      ref={ref}
      className={cx(chipStyle, className)}
      {...rest}
    >
      {children}
    </BaseCombobox.Chip>
  )
})

const ChipRemove = forwardRef<HTMLButtonElement, ChipRemoveBaseProps>(
  function ComboboxChipRemove({ className, children, ...rest }, ref) {
    return (
      <BaseCombobox.ChipRemove
        ref={ref}
        className={cx(chipRemoveStyle, className)}
        {...rest}
      >
        {children ?? <XIcon size={10} />}
      </BaseCombobox.ChipRemove>
    )
  },
)

const Clear = forwardRef<HTMLButtonElement, ClearBaseProps>(
  function ComboboxClear({ className, children, ...rest }, ref) {
    return (
      <BaseCombobox.Clear
        ref={ref}
        className={cx(clearStyle, className)}
        {...rest}
      >
        {children ?? <XIcon size={12} />}
      </BaseCombobox.Clear>
    )
  },
)

const Icon = forwardRef<HTMLSpanElement, IconBaseProps>(function ComboboxIcon(
  { className, children, ...rest },
  ref,
) {
  return (
    <BaseCombobox.Icon
      ref={ref}
      className={cx(iconStyle, className)}
      {...rest}
    >
      {children ?? <ChevronDownIcon size={14} />}
    </BaseCombobox.Icon>
  )
})

const Portal = (props: PortalProps) => <BaseCombobox.Portal {...props} />

const Positioner = forwardRef<HTMLDivElement, PositionerBaseProps>(
  function ComboboxPositioner({ className, sideOffset = 6, ...rest }, ref) {
    return (
      <BaseCombobox.Positioner
        ref={ref}
        sideOffset={sideOffset}
        className={cx(positionerStyle, className)}
        {...rest}
      />
    )
  },
)

const Popup = forwardRef<HTMLDivElement, PopupBaseProps>(function ComboboxPopup(
  { className, children, ...rest },
  ref,
) {
  return (
    <BaseCombobox.Popup
      ref={ref}
      className={cx(popupStyle, className)}
      {...rest}
    >
      {children}
    </BaseCombobox.Popup>
  )
})

const List = forwardRef<HTMLDivElement, ListBaseProps>(function ComboboxList(
  { className, ...rest },
  ref,
) {
  return (
    <BaseCombobox.List
      ref={ref}
      className={cx(listStyle, className)}
      {...rest}
    />
  )
})

const Item = forwardRef<HTMLDivElement, ItemBaseProps>(function ComboboxItem(
  { className, children, ...rest },
  ref,
) {
  return (
    <BaseCombobox.Item
      ref={ref}
      className={cx(itemRecipe(), className)}
      {...rest}
    >
      {children}
    </BaseCombobox.Item>
  )
})

const ItemIndicator = forwardRef<HTMLSpanElement, ItemIndicatorBaseProps>(
  function ComboboxItemIndicator({ className, children, ...rest }, ref) {
    return (
      <BaseCombobox.ItemIndicator
        ref={ref}
        className={cx(itemIndicatorStyle, className)}
        {...rest}
      >
        {children ?? <CheckIcon size={14} />}
      </BaseCombobox.ItemIndicator>
    )
  },
)

const Empty = forwardRef<HTMLDivElement, EmptyBaseProps>(
  function ComboboxEmpty({ className, ...rest }, ref) {
    return (
      <BaseCombobox.Empty
        ref={ref}
        className={cx(emptyStyle, className)}
        {...rest}
      />
    )
  },
)

const Group = forwardRef<HTMLDivElement, GroupBaseProps>(
  function ComboboxGroup({ className, ...rest }, ref) {
    return (
      <BaseCombobox.Group
        ref={ref}
        className={cx(groupStyle, className)}
        {...rest}
      />
    )
  },
)

const GroupLabel = forwardRef<HTMLDivElement, GroupLabelBaseProps>(
  function ComboboxGroupLabel({ className, ...rest }, ref) {
    return (
      <BaseCombobox.GroupLabel
        ref={ref}
        className={cx(groupLabelStyle, className)}
        {...rest}
      />
    )
  },
)

export const Combobox = {
  Root,
  Trigger,
  Input,
  Chips,
  Chip,
  ChipRemove,
  Clear,
  Icon,
  Portal,
  Positioner,
  Popup,
  List,
  Item,
  ItemIndicator,
  Empty,
  Group,
  GroupLabel,
}

export type ComboboxRootProps<
  Value,
  Multiple extends boolean | undefined = false,
> = RootProps<Value, Multiple>
