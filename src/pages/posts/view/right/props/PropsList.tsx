import type { FC, ReactNode } from 'react'

import { propsListStyle } from '../RightPane.css'

export interface PropsListProps {
  children: ReactNode
}

export const PropsList: FC<PropsListProps> = ({ children }) => (
  <div className={propsListStyle} data-testid="props-list">
    {children}
  </div>
)
