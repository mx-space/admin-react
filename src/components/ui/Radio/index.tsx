import { Radio as BaseRadio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { createContext, forwardRef, useContext } from 'react'
import type {
  ComponentPropsWithRef,
  ReactNode,
} from 'react'

import { cx } from '~/utils/cx'

import {
  groupRecipe,
  indicatorRecipe,
  labelStyle,
  rootRecipe,
  type GroupVariants,
  type RootVariants,
} from './Radio.css'

type Orientation = NonNullable<GroupVariants['orientation']>
type Size = NonNullable<RootVariants['size']>

const SizeContext = createContext<Size>('md')

type WithStringClassName<P> = Omit<P, 'className'> & { className?: string }

type GroupBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseRadioGroup>
>
type RootBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseRadio.Root>
>

export interface RadioGroupProps extends GroupBaseProps {
  orientation?: Orientation
  size?: Size
}

const Group = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { orientation = 'vertical', size = 'md', className, ...rest },
  ref,
) {
  return (
    <SizeContext.Provider value={size}>
      <BaseRadioGroup
        ref={ref}
        role="radiogroup"
        className={cx(groupRecipe({ orientation }), className)}
        {...rest}
      />
    </SizeContext.Provider>
  )
})

export interface RadioProps extends RootBaseProps {
  size?: Size
}

const Root = forwardRef<HTMLButtonElement, RadioProps>(function RadioRoot(
  { size, className, ...rest },
  ref,
) {
  const ctxSize = useContext(SizeContext)
  const finalSize = size ?? ctxSize
  return (
    <BaseRadio.Root
      ref={ref as React.Ref<HTMLElement>}
      className={cx(rootRecipe({ size: finalSize }), className)}
      {...rest}
    >
      <BaseRadio.Indicator className={indicatorRecipe({ size: finalSize })} />
    </BaseRadio.Root>
  )
})

export interface RadioItemProps extends RadioProps {
  children?: ReactNode
}

const Item = forwardRef<HTMLLabelElement, RadioItemProps>(function RadioItem(
  { children, ...rest },
  ref,
) {
  return (
    <label ref={ref} className={labelStyle}>
      <Root {...rest} />
      {children}
    </label>
  )
})

export const Radio = {
  Group,
  Root,
  Item,
}
