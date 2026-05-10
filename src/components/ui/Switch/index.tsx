import { Switch as BaseSwitch } from '@base-ui/react/switch'
import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import { cx } from '~/utils/cx'

import { rootRecipe, thumbRecipe, type RootVariants } from './Switch.css'

type Size = NonNullable<RootVariants['size']>

type RootBaseProps = Omit<
  ComponentPropsWithoutRef<typeof BaseSwitch.Root>,
  'className'
> & { className?: string }

export interface SwitchProps extends RootBaseProps {
  size?: Size
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch({ size = 'md', className, ...rest }, ref) {
    return (
      <BaseSwitch.Root
        ref={ref as React.Ref<HTMLElement>}
        className={cx(rootRecipe({ size }), className)}
        {...rest}
      >
        <BaseSwitch.Thumb className={thumbRecipe({ size })} />
      </BaseSwitch.Root>
    )
  },
)
