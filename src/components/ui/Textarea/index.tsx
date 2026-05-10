import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'

import { cx } from '~/utils/cx'

import { textareaRecipe, type TextareaVariants } from './Textarea.css'

type Intent = NonNullable<TextareaVariants['intent']>
type Size = NonNullable<TextareaVariants['size']>

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  intent?: Intent
  size?: Size
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { intent = 'default', size = 'md', invalid, className, rows = 3, ...rest },
    ref,
  ) {
    const resolvedIntent: Intent = invalid ? 'danger' : intent
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cx(textareaRecipe({ intent: resolvedIntent, size }), className)}
        {...rest}
      />
    )
  },
)
