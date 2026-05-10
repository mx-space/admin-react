import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Spinner } from './index'

describe('Spinner', () => {
  it('renders an inline svg with given size', () => {
    const { container } = render(<Spinner size="lg" />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '16')
    expect(svg).toHaveAttribute('height', '16')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('exposes role=status when aria-label is provided', () => {
    render(<Spinner size="md" aria-label="loading" />)
    expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument()
  })
})
