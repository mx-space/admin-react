import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Select } from './index'

const items = [
  { label: 'Alpha', value: 'a' },
  { label: 'Bravo', value: 'b' },
]

function Harness({ initial = 'a' }: { initial?: string | null }) {
  const [value, setValue] = useState<string | null>(initial)
  return (
    <Select.Root
      items={items}
      value={value}
      onValueChange={(v) => setValue(v as string)}
    >
      <Select.Trigger size="md" data-testid="trigger">
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.Item value="a">Alpha</Select.Item>
            <Select.Item value="b">Bravo</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}

describe('Select', () => {
  it('opens the popup with options and reflects current value', () => {
    render(<Harness />)
    expect(screen.getByTestId('trigger')).toHaveTextContent('Alpha')

    fireEvent.click(screen.getByTestId('trigger'))
    expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Bravo' })).toBeInTheDocument()
  })

  it('applies the size variant class on trigger', () => {
    render(
      <Select.Root defaultValue="a">
        <Select.Trigger size="lg" data-testid="trigger">
          <Select.Value />
        </Select.Trigger>
      </Select.Root>,
    )
    expect(screen.getByTestId('trigger').className).toMatch(/size_lg/)
  })
})
