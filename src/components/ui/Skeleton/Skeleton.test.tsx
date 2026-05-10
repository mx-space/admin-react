import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton, SkeletonGroup } from './index'

describe('Skeleton', () => {
  it('exposes role=status with aria-busy', () => {
    render(<Skeleton shape="text" data-testid="s" />)
    const node = screen.getByTestId('s')
    expect(node).toHaveAttribute('role', 'status')
    expect(node).toHaveAttribute('aria-busy', 'true')
  })

  it('applies shape variant class', () => {
    render(<Skeleton shape="circle" data-testid="s" />)
    expect(screen.getByTestId('s').className).toMatch(/shape_circle/)
  })

  it('SkeletonGroup renders the requested number of lines', () => {
    const { container } = render(<SkeletonGroup lines={4} />)
    expect(container.querySelectorAll('[role="status"]').length).toBe(4)
  })
})
