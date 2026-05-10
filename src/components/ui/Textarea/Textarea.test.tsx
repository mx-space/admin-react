import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Textarea } from './index'

describe('Textarea', () => {
  it('renders a textarea with given rows', () => {
    render(<Textarea rows={5} placeholder="hello" />)
    const node = screen.getByPlaceholderText('hello') as HTMLTextAreaElement
    expect(node.tagName).toBe('TEXTAREA')
    expect(node).toHaveAttribute('rows', '5')
  })

  it('fires onChange when typing', () => {
    const onChange = vi.fn()
    render(<Textarea onChange={onChange} placeholder="x" />)
    fireEvent.change(screen.getByPlaceholderText('x'), {
      target: { value: 'abc' },
    })
    expect(onChange).toHaveBeenCalled()
  })

  it('exposes aria-invalid when invalid', () => {
    render(<Textarea invalid placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveAttribute('aria-invalid', 'true')
  })
})
