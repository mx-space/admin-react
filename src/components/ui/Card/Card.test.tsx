import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card } from './index'

describe('Card', () => {
  it('renders children with default elevation', () => {
    render(
      <Card data-testid="card">
        <span>content</span>
      </Card>,
    )
    const node = screen.getByTestId('card')
    expect(node).toBeInTheDocument()
    expect(node.tagName).toBe('DIV')
    expect(node).toHaveTextContent('content')
  })

  it('respects compound Header / Body / Footer slots', () => {
    render(
      <Card>
        <Card.Header>
          <span>title</span>
        </Card.Header>
        <Card.Body>
          <span>body</span>
        </Card.Body>
        <Card.Footer>
          <button type="button">ok</button>
        </Card.Footer>
      </Card>,
    )
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('body')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ok' })).toBeInTheDocument()
  })

  it('renders as a custom element when `as` prop is set', () => {
    render(
      <Card as="section" data-testid="card-section" elevation="popover">
        <span>x</span>
      </Card>,
    )
    const node = screen.getByTestId('card-section')
    expect(node.tagName).toBe('SECTION')
  })
})
