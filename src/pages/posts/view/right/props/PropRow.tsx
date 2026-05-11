import type { FC, ReactNode } from 'react'

import {
  propErrorStyle,
  propLabelStyle,
  propRowStyle,
  propValueStyle,
} from '../RightPane.css'

export interface PropRowProps {
  label: ReactNode
  error?: string | null
  children: ReactNode
}

export const PropRow: FC<PropRowProps> = ({ label, error, children }) => (
  <div className={propRowStyle} data-testid="prop-row">
    <div className={propLabelStyle}>{label}</div>
    <div className={propValueStyle}>
      {children}
      {error ? (
        <p className={propErrorStyle} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  </div>
)
