import type { FC } from 'react'
import { toast } from 'sonner'

import { Switch } from '~/components/ui'

import { PropRow } from '../PropRow'

export interface StatusFieldProps {
  value: boolean
  onCommit: (next: boolean) => void
}

export const StatusField: FC<StatusFieldProps> = ({ value, onCommit }) => {
  const onChange = (checked: boolean) => {
    onCommit(checked)
    toast.success(checked ? '已发布' : '转草稿')
  }

  return (
    <PropRow label="状态">
      <Switch
        checked={value}
        onCheckedChange={onChange}
        data-testid="status-switch"
      />
    </PropRow>
  )
}
