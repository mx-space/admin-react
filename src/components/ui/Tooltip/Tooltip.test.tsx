import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Tooltip } from './index'

describe('Tooltip', () => {
  it('renders the trigger child and hides content by default', () => {
    render(
      <Tooltip content="hello there">
        <button type="button">trigger</button>
      </Tooltip>,
    )
    expect(screen.getByRole('button', { name: 'trigger' })).toBeInTheDocument()
    expect(screen.queryByText('hello there')).not.toBeInTheDocument()
  })

  it('mounts the popup when open', () => {
    render(
      <Tooltip content="visible tip" open>
        <button type="button">trigger</button>
      </Tooltip>,
    )
    expect(screen.getByText('visible tip')).toBeInTheDocument()
  })

  it('applies the tone variant class', () => {
    render(
      <Tooltip content={<span data-testid="tip">x</span>} open tone="inverse">
        <button type="button">trigger</button>
      </Tooltip>,
    )
    const tip = screen.getByTestId('tip')
    const popup = tip.parentElement!
    expect(popup.className).toMatch(/tone_inverse/)
  })
})
