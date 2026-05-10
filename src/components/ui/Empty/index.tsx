import { InboxIcon } from 'lucide-react'
import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

import { cx } from '~/utils/cx'

import {
  actionStyle,
  descriptionStyle,
  iconStyle,
  rootStyle,
  titleStyle,
} from './Empty.css'

export interface EmptyProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
}

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(
  {
    icon,
    title = 'Nothing here yet',
    description,
    action,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} className={cx(rootStyle, className)} {...rest}>
      <span className={iconStyle}>{icon ?? <InboxIcon size={20} />}</span>
      {title ? <p className={titleStyle}>{title}</p> : null}
      {description ? <p className={descriptionStyle}>{description}</p> : null}
      {action ? <div className={actionStyle}>{action}</div> : null}
      {children}
    </div>
  )
})
