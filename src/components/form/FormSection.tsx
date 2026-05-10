import type { HTMLAttributes, ReactNode } from 'react'

import { cx } from '~/utils/cx'

import {
  sectionDescriptionStyle,
  sectionHeaderStyle,
  sectionStyle,
  sectionTitleStyle,
} from './form.css'

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode
  description?: ReactNode
}

export const FormSection = ({
  title,
  description,
  className,
  children,
  ...rest
}: FormSectionProps) => (
  <section className={cx(sectionStyle, className)} {...rest}>
    {title || description ? (
      <header className={sectionHeaderStyle}>
        {title ? <h3 className={sectionTitleStyle}>{title}</h3> : null}
        {description ? (
          <p className={sectionDescriptionStyle}>{description}</p>
        ) : null}
      </header>
    ) : null}
    {children}
  </section>
)
