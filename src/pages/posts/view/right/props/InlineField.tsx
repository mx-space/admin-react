import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { propEditStyle, propRenderStyle } from '../RightPane.css'

export interface InlineFieldEditApi<T> {
  value: T
  onChange: (next: T) => void
  onCommit: () => void
  onCancel: () => void
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void
}

export interface InlineFieldProps<T> {
  value: T
  render: (v: T) => ReactNode
  edit: (api: InlineFieldEditApi<T>) => ReactNode
  onCommit: (next: T) => void
  isEmpty?: (v: T) => boolean
  testId?: string
}

export function InlineField<T>({
  value,
  render,
  edit,
  onCommit,
  isEmpty,
  testId,
}: InlineFieldProps<T>) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<T>(value)
  const cancelledRef = useRef(false)

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  const commit = () => {
    if (cancelledRef.current) {
      cancelledRef.current = false
      setEditing(false)
      return
    }
    setEditing(false)
    onCommit(draft)
  }

  const cancel = () => {
    cancelledRef.current = true
    setDraft(value)
    setEditing(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    } else if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
      e.preventDefault()
      commit()
    }
  }

  if (editing) {
    return (
      <div className={propEditStyle} data-testid={testId ?? 'inline-edit'}>
        {edit({
          value: draft,
          onChange: setDraft,
          onCommit: commit,
          onCancel: cancel,
          onKeyDown,
        })}
      </div>
    )
  }

  const empty = isEmpty?.(value) ?? false
  return (
    <button
      type="button"
      className={propRenderStyle}
      data-empty={empty || undefined}
      data-testid={testId ?? 'inline-render'}
      onClick={() => setEditing(true)}
    >
      {render(value)}
    </button>
  )
}
