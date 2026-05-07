import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { cx } from '~/utils/cx'

import {
  cardBodyStyle,
  cardFooterStyle,
  cardHeaderStyle,
  cardRecipe,
  type CardVariants,
} from './Card.css'

type CardElevation = NonNullable<CardVariants['elevation']>
type CardPadding = NonNullable<CardVariants['padding']>
type CardRadius = NonNullable<CardVariants['radius']>

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation
  padding?: CardPadding
  radius?: CardRadius
  as?: 'div' | 'section' | 'article'
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    elevation = 'raised',
    padding = 'md',
    radius = 'lg',
    as: Tag = 'div',
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cx(cardRecipe({ elevation, padding, radius }), className)}
      {...rest}
    >
      {children}
    </Tag>
  )
})

const CardHeader = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(cardHeaderStyle, className)} {...rest}>
    {children}
  </div>
)

const CardBody = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(cardBodyStyle, className)} {...rest}>
    {children}
  </div>
)

const CardFooter = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(cardFooterStyle, className)} {...rest}>
    {children}
  </div>
)

type CardCompound = typeof CardRoot & {
  Header: typeof CardHeader
  Body: typeof CardBody
  Footer: typeof CardFooter
}

export const Card = CardRoot as CardCompound
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter
