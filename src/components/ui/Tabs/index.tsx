import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import { createContext, forwardRef, useContext } from 'react'
import type { ComponentPropsWithRef } from 'react'

import { cx } from '~/utils/cx'

import {
  indicatorRecipe,
  listRecipe,
  panelStyle,
  rootStyle,
  tabRecipe,
  type ListVariants,
} from './Tabs.css'

type Variant = NonNullable<ListVariants['variant']>

const VariantContext = createContext<Variant>('underline')

type WithStringClassName<P> = Omit<P, 'className'> & { className?: string }

type RootBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseTabs.Root>
>
type ListBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseTabs.List>
>
type TabBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseTabs.Tab>
>
type IndicatorBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseTabs.Indicator>
>
type PanelBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseTabs.Panel>
>

export interface TabsRootProps extends RootBaseProps {
  variant?: Variant
}

const Root = forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot(
  { variant = 'underline', className, ...rest },
  ref,
) {
  return (
    <VariantContext.Provider value={variant}>
      <BaseTabs.Root ref={ref} className={cx(rootStyle, className)} {...rest} />
    </VariantContext.Provider>
  )
})

const List = forwardRef<HTMLDivElement, ListBaseProps>(function TabsList(
  { className, ...rest },
  ref,
) {
  const variant = useContext(VariantContext)
  return (
    <BaseTabs.List
      ref={ref}
      className={cx(listRecipe({ variant }), className)}
      {...rest}
    />
  )
})

const Tab = forwardRef<HTMLButtonElement, TabBaseProps>(function TabsTab(
  { className, ...rest },
  ref,
) {
  const variant = useContext(VariantContext)
  return (
    <BaseTabs.Tab
      ref={ref}
      className={cx(tabRecipe({ variant }), className)}
      {...rest}
    />
  )
})

const Indicator = forwardRef<HTMLSpanElement, IndicatorBaseProps>(
  function TabsIndicator({ className, ...rest }, ref) {
    const variant = useContext(VariantContext)
    return (
      <BaseTabs.Indicator
        ref={ref}
        className={cx(indicatorRecipe({ variant }), className)}
        {...rest}
      />
    )
  },
)

const Panel = forwardRef<HTMLDivElement, PanelBaseProps>(function TabsPanel(
  { className, ...rest },
  ref,
) {
  return (
    <BaseTabs.Panel
      ref={ref}
      className={cx(panelStyle, className)}
      {...rest}
    />
  )
})

export const Tabs = {
  Root,
  List,
  Tab,
  Indicator,
  Panel,
}

export type TabsListProps = ListBaseProps
export type TabsTabProps = TabBaseProps
export type TabsPanelProps = PanelBaseProps
