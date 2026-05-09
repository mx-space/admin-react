import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { cx } from '~/utils/cx'

import {
  actionsStyle,
  bodyRecipe,
  headerStyle,
  rootStyle,
  titleStyle,
  type BodyVariants,
} from './FullLayout.css'

type BodyPadding = NonNullable<BodyVariants['padding']>

export interface FullLayoutProps extends HTMLAttributes<HTMLDivElement> {}

const Root = forwardRef<HTMLDivElement, FullLayoutProps>(function FullLayout(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(rootStyle, className)} {...rest}>
      {children}
    </div>
  )
})

const Header = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) => (
  <header className={cx(headerStyle, className)} {...rest}>
    {children}
  </header>
)

const Title = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className={cx(titleStyle, className)} {...rest}>
    {children}
  </h1>
)

const Actions = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(actionsStyle, className)} {...rest}>
    {children}
  </div>
)

export interface FullLayoutBodyProps extends HTMLAttributes<HTMLElement> {
  padding?: BodyPadding
}

const Body = forwardRef<HTMLElement, FullLayoutBodyProps>(function FullBody(
  { className, padding = 'default', children, ...rest },
  ref,
) {
  return (
    <main
      ref={ref}
      className={cx(bodyRecipe({ padding }), className)}
      {...rest}
    >
      {children}
    </main>
  )
})

type FullLayoutCompound = typeof Root & {
  Header: typeof Header
  Title: typeof Title
  Actions: typeof Actions
  Body: typeof Body
}

export const FullLayout = Root as FullLayoutCompound
FullLayout.Header = Header
FullLayout.Title = Title
FullLayout.Actions = Actions
FullLayout.Body = Body
