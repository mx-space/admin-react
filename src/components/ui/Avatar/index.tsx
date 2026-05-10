import { Avatar as BaseAvatar } from '@base-ui/react/avatar'
import { forwardRef } from 'react'
import type {
  ComponentPropsWithRef,
  HTMLAttributes,
  ReactNode,
} from 'react'

import { cx } from '~/utils/cx'

import {
  imageStyle,
  rootRecipe,
  type RootVariants,
} from './Avatar.css'

type Size = NonNullable<RootVariants['size']>
type Shape = NonNullable<RootVariants['shape']>

type WithStringClassName<P> = Omit<P, 'className'> & { className?: string }

type RootBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseAvatar.Root>
>
type ImageBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseAvatar.Image>
>
type FallbackBaseProps = WithStringClassName<
  ComponentPropsWithRef<typeof BaseAvatar.Fallback>
> & { children?: ReactNode }

export interface AvatarRootProps extends RootBaseProps {
  size?: Size
  shape?: Shape
}

const Root = forwardRef<HTMLSpanElement, AvatarRootProps>(function AvatarRoot(
  { size = 'md', shape = 'circle', className, ...rest },
  ref,
) {
  return (
    <BaseAvatar.Root
      ref={ref}
      className={cx(rootRecipe({ size, shape }), className)}
      {...rest}
    />
  )
})

const Image = forwardRef<HTMLImageElement, ImageBaseProps>(function AvatarImage(
  { className, ...rest },
  ref,
) {
  return (
    <BaseAvatar.Image
      ref={ref}
      className={cx(imageStyle, className)}
      {...rest}
    />
  )
})

const Fallback = forwardRef<HTMLSpanElement, FallbackBaseProps>(
  function AvatarFallback(props, ref) {
    return <BaseAvatar.Fallback ref={ref} {...props} />
  },
)

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  size?: Size
  shape?: Shape
  src?: string
  alt?: string
  /** Initials shown when no `src` or when image fails to load. */
  initials?: string
  /** Custom fallback content; takes precedence over `initials`. */
  fallback?: ReactNode
}

export const Avatar = Object.assign(
  forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
    {
      size = 'md',
      shape = 'circle',
      src,
      alt,
      initials,
      fallback,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <Root ref={ref} size={size} shape={shape} className={className} {...rest}>
        {src ? <Image src={src} alt={alt ?? initials ?? ''} /> : null}
        <Fallback>{fallback ?? initials ?? null}</Fallback>
      </Root>
    )
  }),
  { Root, Image, Fallback },
)
