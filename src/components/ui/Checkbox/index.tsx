import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { CheckIcon, MinusIcon } from 'lucide-react'
import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import { cx } from '~/utils/cx'

import {
  indicatorRecipe,
  rootRecipe,
  type RootVariants,
} from './Checkbox.css'

type Size = NonNullable<RootVariants['size']>

type RootBaseProps = Omit<
  ComponentPropsWithoutRef<typeof BaseCheckbox.Root>,
  'className'
> & { className?: string }

export interface CheckboxProps extends RootBaseProps {
  size?: Size
}

const iconPxBySize: Record<Size, number> = { sm: 10, md: 12, lg: 14 }

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox({ size = 'md', className, ...rest }, ref) {
    const px = iconPxBySize[size]
    return (
      <BaseCheckbox.Root
        ref={ref as React.Ref<HTMLElement>}
        className={cx(rootRecipe({ size }), className)}
        {...rest}
      >
        <BaseCheckbox.Indicator
          className={indicatorRecipe({ size })}
          render={(props, state) => (
            <span {...props}>
              {state.indeterminate ? (
                <MinusIcon size={px} strokeWidth={3} />
              ) : state.checked ? (
                <CheckIcon size={px} strokeWidth={3} />
              ) : null}
            </span>
          )}
        />
      </BaseCheckbox.Root>
    )
  },
)
