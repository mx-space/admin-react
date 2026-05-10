import { XIcon } from 'lucide-react'
import { forwardRef } from 'react'
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react'

import { cx } from '~/utils/cx'

import { closeButtonStyle, tagRecipe, type TagVariants } from './Tag.css'

type Tone = NonNullable<TagVariants['tone']>
type Size = NonNullable<TagVariants['size']>

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  size?: Size
  closable?: boolean
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void
  startIcon?: ReactNode
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    tone = 'neutral',
    size = 'sm',
    closable,
    onClose,
    startIcon,
    className,
    children,
    ...rest
  },
  ref,
) {
  const iconPx = size === 'md' ? 12 : 10
  return (
    <span
      ref={ref}
      className={cx(tagRecipe({ tone, size }), className)}
      {...rest}
    >
      {startIcon}
      {children}
      {closable ? (
        <button
          type="button"
          className={closeButtonStyle}
          aria-label="Remove tag"
          onClick={onClose}
        >
          <XIcon size={iconPx} strokeWidth={2.5} />
        </button>
      ) : null}
    </span>
  )
})
