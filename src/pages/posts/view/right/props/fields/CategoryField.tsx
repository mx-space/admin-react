import { useMemo, useState } from 'react'
import type { FC } from 'react'

import { Combobox } from '~/components/ui'
import { useCategoryList } from '~/hooks/queries/useCategoryList'

import { PropRow } from '../PropRow'

export interface CategoryFieldProps {
  value: string
  onCommit: (categoryId: string) => void
}

export const CategoryField: FC<CategoryFieldProps> = ({ value, onCommit }) => {
  const { data: categories } = useCategoryList()
  const [input, setInput] = useState('')

  const items = useMemo(() => categories ?? [], [categories])
  const itemIds = useMemo(() => items.map((c) => c.id), [items])
  const nameOf = (id: string | null) =>
    items.find((c) => c.id === id)?.name ?? ''

  return (
    <PropRow label="分类">
      <Combobox.Root<string>
        items={itemIds}
        value={value}
        onValueChange={(v) => {
          if (typeof v === 'string' && v && v !== value) onCommit(v)
        }}
        inputValue={input || nameOf(value)}
        onInputValueChange={setInput}
      >
        <Combobox.Trigger size="sm" data-testid="category-trigger">
          <Combobox.Input
            placeholder="选分类"
            data-testid="category-input"
          />
          <Combobox.Icon />
        </Combobox.Trigger>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.List>
                {items.map((c) => (
                  <Combobox.Item key={c.id} value={c.id}>
                    {c.name}
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                ))}
              </Combobox.List>
              <Combobox.Empty>无匹配</Combobox.Empty>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </PropRow>
  )
}
