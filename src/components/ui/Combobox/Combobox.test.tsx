import { fireEvent, render, screen } from '@testing-library/react'
import { useState, type KeyboardEvent } from 'react'
import { describe, expect, it } from 'vitest'

import { Combobox } from './index'

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango']

function SingleHarness({
  initial = null,
  defaultOpen = false,
}: {
  initial?: string | null
  defaultOpen?: boolean
}) {
  const [value, setValue] = useState<string | null>(initial)
  const [input, setInput] = useState('')
  return (
    <Combobox.Root<string>
      items={fruits}
      value={value}
      onValueChange={(v) => setValue(v)}
      inputValue={input}
      onInputValueChange={(v) => setInput(v)}
      defaultOpen={defaultOpen}
    >
      <Combobox.Trigger size="md" data-testid="trigger">
        <Combobox.Input placeholder="Pick a fruit" data-testid="input" />
        <Combobox.Icon />
      </Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup>
            <Combobox.List>
              {(item: string) => (
                <Combobox.Item key={item} value={item}>
                  {item}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              )}
            </Combobox.List>
            <Combobox.Empty>No matches</Combobox.Empty>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}

function MultiHarness({
  initial = [],
  freeSolo = false,
}: {
  initial?: string[]
  freeSolo?: boolean
}) {
  const [value, setValue] = useState<string[]>(initial)
  const [input, setInput] = useState('')

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!freeSolo) return
    if (event.key !== 'Enter') return
    const next = input.trim()
    if (!next) return
    if (value.includes(next)) return
    if (fruits.includes(next)) return
    event.preventDefault()
    setValue((prev) => [...prev, next])
    setInput('')
  }

  return (
    <Combobox.Root<string, true>
      multiple
      items={fruits}
      value={value}
      onValueChange={(v) => setValue(v)}
      inputValue={input}
      onInputValueChange={(v) => setInput(v)}
    >
      <Combobox.Trigger size="md" data-testid="trigger">
        <Combobox.Chips>
          {value.map((tag, index) => (
            <Combobox.Chip key={tag} aria-label={tag} data-testid={`chip-${tag}`}>
              {tag}
              <Combobox.ChipRemove
                data-testid={`chip-remove-${tag}`}
                aria-label={`remove ${tag}`}
                onClick={(event) => {
                  event.preventDefault()
                  setValue((prev) => prev.filter((_, i) => i !== index))
                }}
              />
            </Combobox.Chip>
          ))}
          <Combobox.Input
            data-testid="input"
            placeholder="Add a tag"
            onKeyDown={handleKeyDown}
          />
        </Combobox.Chips>
        <Combobox.Clear data-testid="clear" aria-label="clear" />
      </Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup>
            <Combobox.List>
              {fruits.map((it) => (
                <Combobox.Item key={it} value={it}>
                  {it}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
            </Combobox.List>
            <Combobox.Empty>No matches</Combobox.Empty>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}

describe('Combobox', () => {
  it('selects a single item from the popup', () => {
    render(<SingleHarness />)
    const input = screen.getByTestId('input') as HTMLInputElement
    fireEvent.mouseDown(input.parentElement!)
    input.focus()
    const option = screen.getByRole('option', { name: /Apple/ })
    fireEvent.click(option)
    expect(input.value).toBe('Apple')
  })

  it('adds and removes chips in multi mode', () => {
    render(<MultiHarness initial={['Apple']} />)
    expect(screen.getByTestId('chip-Apple')).toBeInTheDocument()

    const input = screen.getByTestId('input') as HTMLInputElement
    fireEvent.mouseDown(input.parentElement!)
    input.focus()
    const banana = screen.getByRole('option', { name: /Banana/ })
    fireEvent.click(banana)
    expect(screen.getByTestId('chip-Banana')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('chip-remove-Apple'))
    expect(screen.queryByTestId('chip-Apple')).not.toBeInTheDocument()
  })

  it('creates a new entry via freeSolo Enter', () => {
    render(<MultiHarness freeSolo />)
    const input = screen.getByTestId('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Durian' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByTestId('chip-Durian')).toBeInTheDocument()
    expect(input.value).toBe('')
  })

  it('clears the value when the Clear button is pressed', () => {
    render(<MultiHarness initial={['Apple', 'Banana']} />)
    expect(screen.getByTestId('chip-Apple')).toBeInTheDocument()
    expect(screen.getByTestId('chip-Banana')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('clear'))
    expect(screen.queryByTestId('chip-Apple')).not.toBeInTheDocument()
    expect(screen.queryByTestId('chip-Banana')).not.toBeInTheDocument()
  })

  it('hides non-matching items via the default substring filter', () => {
    render(<SingleHarness defaultOpen />)
    const input = screen.getByTestId('input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'ban' } })
    expect(screen.queryByRole('option', { name: /Apple/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Cherry/ })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Banana/ })).toBeInTheDocument()
  })

  it('renders an item indicator on selected items', () => {
    render(<SingleHarness initial="Cherry" />)
    const input = screen.getByTestId('input') as HTMLInputElement
    fireEvent.mouseDown(input.parentElement!)
    input.focus()
    const cherry = screen.getByRole('option', { name: /Cherry/ })
    expect(cherry).toHaveAttribute('aria-selected', 'true')
    expect(cherry.querySelector('svg')).toBeInTheDocument()
  })

  it('applies the size variant class on the trigger', () => {
    render(
      <Combobox.Root<string> items={fruits} defaultValue={null}>
        <Combobox.Trigger size="sm" data-testid="trigger">
          <Combobox.Input data-testid="input" />
        </Combobox.Trigger>
      </Combobox.Root>,
    )
    expect(screen.getByTestId('trigger').className).toMatch(/size_sm/)
  })
})
