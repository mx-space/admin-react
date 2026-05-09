import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './index'

describe('Button', () => {
  it('renders children with default secondary intent', () => {
    render(<Button>Save</Button>)
    const btn = screen.getByRole('button', { name: 'Save' })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('type', 'button')
    expect(btn).not.toBeDisabled()
  })

  it('fires onClick when not disabled and blocks it when disabled', () => {
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>Go</Button>)
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies loading state with aria-busy and blocks clicks', () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Submitting
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Submitting' })
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toHaveAttribute('data-loading', 'true')
    expect(btn).toBeDisabled()
    fireEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('forwards ref to the underlying button element', () => {
    let captured: HTMLButtonElement | null = null
    render(
      <Button
        ref={(node) => {
          captured = node
        }}
      >
        Ref
      </Button>,
    )
    expect(captured).toBeInstanceOf(HTMLButtonElement)
  })
})
