import { useState } from 'react'
import type { FC, KeyboardEvent } from 'react'

import { Combobox } from '~/components/ui'

import { PropRow } from '../PropRow'

import { validateTags } from './validation'

export interface TagsFieldProps {
  value: string[]
  options?: string[]
  onCommit: (next: string[]) => void
}

export const TagsField: FC<TagsFieldProps> = ({
  value,
  options = [],
  onCommit,
}) => {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const tryCommit = (next: string[]) => {
    const err = validateTags(next)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    onCommit(next)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    const next = input.trim()
    if (!next) return
    if (value.includes(next)) {
      event.preventDefault()
      setInput('')
      return
    }
    event.preventDefault()
    tryCommit([...value, next])
    setInput('')
  }

  const removeAt = (idx: number) => {
    tryCommit(value.filter((_, i) => i !== idx))
  }

  return (
    <PropRow label="标签" error={error}>
      <Combobox.Root<string, true>
        multiple
        items={options}
        value={value}
        onValueChange={(v) => tryCommit(v as string[])}
        inputValue={input}
        onInputValueChange={setInput}
      >
        <Combobox.Trigger size="sm" data-testid="tags-trigger">
          <Combobox.Chips>
            {value.map((tag, index) => (
              <Combobox.Chip
                key={tag}
                aria-label={tag}
                data-testid={`tag-chip-${tag}`}
              >
                {tag}
                <Combobox.ChipRemove
                  aria-label={`remove ${tag}`}
                  data-testid={`tag-chip-remove-${tag}`}
                  onClick={(event) => {
                    event.preventDefault()
                    removeAt(index)
                  }}
                />
              </Combobox.Chip>
            ))}
            <Combobox.Input
              placeholder={value.length === 0 ? '加标签' : ''}
              data-testid="tags-input"
              onKeyDown={handleKeyDown}
            />
          </Combobox.Chips>
        </Combobox.Trigger>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.List>
                {options.map((opt) => (
                  <Combobox.Item key={opt} value={opt}>
                    {opt}
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                ))}
              </Combobox.List>
              <Combobox.Empty>无匹配；按 Enter 新建</Combobox.Empty>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </PropRow>
  )
}
