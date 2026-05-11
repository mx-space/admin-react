import { useState } from 'react'
import type { ChangeEvent, FC } from 'react'

import { Input, Switch } from '~/components/ui'

import { PropRow } from '../PropRow'
import { pinOrderStyle, switchRowStyle } from '../../RightPane.css'

import { validatePinOrder } from './validation'

export interface PinFieldProps {
  pinAt: string | null | undefined
  pinOrder: number | null | undefined
  onCommitPin: (pinAt: string | null) => void
  onCommitOrder: (order: number | undefined) => void
}

export const PinField: FC<PinFieldProps> = ({
  pinAt,
  pinOrder,
  onCommitPin,
  onCommitOrder,
}) => {
  const isPinned = !!pinAt
  const [orderError, setOrderError] = useState<string | null>(null)

  const onSwitch = (checked: boolean) => {
    onCommitPin(checked ? new Date().toISOString() : null)
  }

  const onOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === '') {
      setOrderError(null)
      onCommitOrder(undefined)
      return
    }
    const n = Number(raw)
    if (Number.isNaN(n)) {
      setOrderError('须为数')
      return
    }
    const err = validatePinOrder(n)
    if (err) {
      setOrderError(err)
      return
    }
    setOrderError(null)
    onCommitOrder(n)
  }

  return (
    <PropRow label="置顶" error={orderError}>
      <div className={switchRowStyle}>
        <Switch
          checked={isPinned}
          onCheckedChange={onSwitch}
          data-testid="pin-switch"
        />
        {isPinned ? (
          <Input
            size="sm"
            type="number"
            min={0}
            placeholder="序"
            value={pinOrder == null ? '' : String(pinOrder)}
            onChange={onOrderChange}
            invalid={!!orderError}
            rootClassName={pinOrderStyle}
            data-testid="pin-order-input"
          />
        ) : null}
      </div>
    </PropRow>
  )
}
