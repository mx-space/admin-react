import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Avatar } from './index'

describe('Avatar', () => {
  it('renders fallback initials when no src', () => {
    render(<Avatar initials="IN" />)
    expect(screen.getByText('IN')).toBeInTheDocument()
  })

  it('applies size + shape variant classes', () => {
    render(<Avatar size="lg" shape="rounded" data-testid="a" initials="X" />)
    const node = screen.getByTestId('a')
    expect(node.className).toMatch(/size_lg/)
    expect(node.className).toMatch(/shape_rounded/)
  })
})
