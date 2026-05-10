import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Ellipsis } from './index'

describe('Ellipsis', () => {
  it('renders children with truncate class', () => {
    render(<Ellipsis data-testid="el">long text</Ellipsis>)
    const node = screen.getByTestId('el')
    expect(node.textContent).toBe('long text')
    expect(node.className).toMatch(/block_false/)
  })

  it('applies block variant', () => {
    render(<Ellipsis block data-testid="el">x</Ellipsis>)
    expect(screen.getByTestId('el').className).toMatch(/block_true/)
  })
})
