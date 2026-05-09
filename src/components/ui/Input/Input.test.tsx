import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Input } from './index'

describe('Input', () => {
  it('renders prefix, suffix, and forwards typing through onChange', () => {
    const onChange = vi.fn()
    render(
      <Input
        placeholder="search"
        prefix={<span data-testid="prefix">P</span>}
        suffix={<span data-testid="suffix">S</span>}
        onChange={onChange}
      />,
    )
    const field = screen.getByPlaceholderText('search') as HTMLInputElement
    expect(screen.getByTestId('prefix')).toBeInTheDocument()
    expect(screen.getByTestId('suffix')).toBeInTheDocument()

    fireEvent.change(field, { target: { value: 'hello' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(field.value).toBe('hello')
  })

  it('marks the field aria-invalid when invalid prop is set', () => {
    render(<Input placeholder="email" invalid />)
    const field = screen.getByPlaceholderText('email')
    expect(field).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables the field and freezes the root', () => {
    render(<Input placeholder="x" disabled defaultValue="locked" />)
    const field = screen.getByPlaceholderText('x') as HTMLInputElement
    expect(field).toBeDisabled()
    expect(field.value).toBe('locked')
  })
})
