import { useState } from 'react'
import type { FC } from 'react'

import { Input } from '~/components/ui'

import { InlineField } from '../InlineField'
import { PropRow } from '../PropRow'

import { validateSlug } from './validation'

export interface SlugFieldProps {
  value: string
  onCommit: (next: string) => void
}

export const SlugField: FC<SlugFieldProps> = ({ value, onCommit }) => {
  const [error, setError] = useState<string | null>(null)

  const tryCommit = (next: string) => {
    const trimmed = next.trim()
    const err = validateSlug(trimmed)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    if (trimmed !== value) onCommit(trimmed)
  }

  return (
    <PropRow label="Slug" error={error}>
      <InlineField<string>
        value={value}
        isEmpty={(v) => !v}
        testId="slug-field"
        render={(v) => <span>{v || '—'}</span>}
        edit={({ value: v, onChange, onCommit: doCommit, onKeyDown }) => (
          <Input
            autoFocus
            value={v}
            invalid={!!error}
            data-testid="slug-input"
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
