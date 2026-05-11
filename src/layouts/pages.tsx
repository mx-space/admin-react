import type { ReactNode } from 'react'

import { FullLayout, type FullLayoutBodyProps } from './FullLayout'
import { TwoColLayout, type TwoColLayoutProps } from './TwoColLayout'

export interface FullPageProps {
  title?: ReactNode
  actions?: ReactNode
  bodyPadding?: FullLayoutBodyProps['padding']
  className?: string
  children?: ReactNode
}

export const FullPage = ({
  title,
  actions,
  bodyPadding = 'default',
  className,
  children,
}: FullPageProps) => (
  <FullLayout className={className}>
    {(title !== undefined || actions !== undefined) && (
      <FullLayout.Header>
        {title !== undefined && <FullLayout.Title>{title}</FullLayout.Title>}
        {actions !== undefined && (
          <FullLayout.Actions>{actions}</FullLayout.Actions>
        )}
      </FullLayout.Header>
    )}
    <FullLayout.Body padding={bodyPadding}>{children}</FullLayout.Body>
  </FullLayout>
)

export interface TwoColPageProps {
  title?: ReactNode
  actions?: ReactNode
  listHeader?: ReactNode
  list?: ReactNode
  listWidth?: TwoColLayoutProps['listWidth']
  selectedId?: TwoColLayoutProps['selectedId']
  onSelectedIdChange?: TwoColLayoutProps['onSelectedIdChange']
  className?: string
  children?: ReactNode
}

export const TwoColPage = ({
  title,
  actions,
  listHeader,
  list,
  listWidth,
  selectedId,
  onSelectedIdChange,
  className,
  children,
}: TwoColPageProps) => (
  <TwoColLayout
    className={className}
    listWidth={listWidth}
    selectedId={selectedId}
    onSelectedIdChange={onSelectedIdChange}
  >
    {(title !== undefined || actions !== undefined) && (
      <TwoColLayout.Header>
        {title !== undefined && (
          <TwoColLayout.Title>{title}</TwoColLayout.Title>
        )}
        {actions !== undefined && (
          <TwoColLayout.Actions>{actions}</TwoColLayout.Actions>
        )}
      </TwoColLayout.Header>
    )}
    {listHeader !== undefined && (
      <TwoColLayout.ListHeader>{listHeader}</TwoColLayout.ListHeader>
    )}
    {list !== undefined && <TwoColLayout.List>{list}</TwoColLayout.List>}
    {children !== undefined && (
      <TwoColLayout.Detail>{children}</TwoColLayout.Detail>
    )}
  </TwoColLayout>
)
