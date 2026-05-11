import { useEffect, useRef, useState } from 'react'
import type { FC, KeyboardEvent } from 'react'

import { titleInputStyle, titleRenderStyle } from '../RightPane.css'

export interface TitleFieldProps {
  value: string
  onCommit: (next: string) => void
}

export const TitleField: FC<TitleFieldProps> = ({ value, onCommit }) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commit = () => {
    setEditing(false)
    const next = draft.trim()
    if (next !== value) onCommit(next)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      commit()
    }
  }

  if (!editing) {
    return (
      <h1
        className={titleRenderStyle}
        data-empty={!value || undefined}
        data-testid="title-render"
        onClick={() => setEditing(true)}
      >
        {value || '未命名'}
      </h1>
    )
  }

  return (
    <input
      ref={inputRef}
      className={titleInputStyle}
      value={draft}
      placeholder="未命名"
      data-testid="title-input"
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={onKey}
    />
  )
}
