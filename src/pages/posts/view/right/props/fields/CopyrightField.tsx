import type { FC } from 'react'

import { Switch } from '~/components/ui'

import { PropRow } from '../PropRow'

export interface CopyrightFieldProps {
  value: boolean
  onCommit: (next: boolean) => void
}

export const CopyrightField: FC<CopyrightFieldProps> = ({
  value,
  onCommit,
}) => (
  <PropRow label="版权">
    <Switch
      checked={value}
      onCheckedChange={(checked) => onCommit(checked)}
      data-testid="copyright-switch"
    />
  </PropRow>
)
