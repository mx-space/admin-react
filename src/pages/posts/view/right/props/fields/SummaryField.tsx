import { useState } from 'react'
import type { FC } from 'react'

import { Textarea } from '~/components/ui'

import { InlineField } from '../InlineField'
import { PropRow } from '../PropRow'

import { validateSummary } from './validation'

export interface SummaryFieldProps {
  value: string | null | undefined
  onCommit: (next: string | null) => void
}

export const SummaryField: FC<SummaryFieldProps> = ({ value, onCommit }) => {
  const [error, setError] = useState<string | null>(null)

  const tryCommit = (next: string) => {
    const trimmed = next.trim()
    const normalized = trimmed.length === 0 ? null : trimmed
    const err = validateSummary(normalized)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    if ((normalized ?? '') !== (value ?? '')) onCommit(normalized)
  }

  return (
    <PropRow label="摘要" error={error}>
      <InlineField<string>
        value={value ?? ''}
        isEmpty={(v) => !v}
        testId="summary-field"
        render={(v) => <span>{v || '—'}</span>}
        edit={({ value: v, onChange, onCommit: doCommit, onKeyDown }) => (
          <Textarea
            autoFocus
            value={v}
            rows={3}
            invalid={!!error}
            data-testid="summary-textarea"
            onChange={(e) => onChange(e.target.value)}
            onBlur={doCommit}
            onKeyDown={onKeyDown}
          />
        )}
        onCommit={tryCommit}
      />
    </PropRow>
  )
}
