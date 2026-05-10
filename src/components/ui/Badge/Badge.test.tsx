import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from './index'

describe('Badge', () => {
  it('renders count as label', () => {
    render(<Badge count={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('formats count above max as `${max}+`', () => {
    render(<Badge count={120} max={99} />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('hides number badge with count 0 when showZero=false', () => {
    render(
      <Badge count={0} showZero={false}>
        <button type="button">inbox</button>
      </Badge>,
    )
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('renders dot shape without label', () => {
    const { container } = render(
      <Badge shape="dot" data-testid="dot">
        <button type="button">x</button>
      </Badge>,
    )
    const dot = container.querySelector('[data-testid="dot"]')!
    expect(dot.textContent).toBe('')
    expect(dot.className).toMatch(/shape_dot/)
  })
})
