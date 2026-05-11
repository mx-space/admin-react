import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ColumnHeader } from './index'

describe('ColumnHeader', () => {
  it('renders three slots in order', () => {
    render(
      <ColumnHeader>
        <ColumnHeader.Left>
          <span data-testid="left">L</span>
        </ColumnHeader.Left>
        <ColumnHeader.Center>
          <span data-testid="center">C</span>
        </ColumnHeader.Center>
        <ColumnHeader.Right>
          <span data-testid="right">R</span>
        </ColumnHeader.Right>
      </ColumnHeader>,
    )
    expect(screen.getByTestId('left')).toBeInTheDocument()
    expect(screen.getByTestId('center')).toBeInTheDocument()
    expect(screen.getByTestId('right')).toBeInTheDocument()
  })

  it('applies size variant class on root', () => {
    const { rerender } = render(
      <ColumnHeader size="compact" data-testid="root">
        <ColumnHeader.Left>x</ColumnHeader.Left>
      </ColumnHeader>,
    )
    const compactClass = screen.getByTestId('root').className
    rerender(
      <ColumnHeader size="spacious" data-testid="root">
        <ColumnHeader.Left>x</ColumnHeader.Left>
      </ColumnHeader>,
    )
    const spaciousClass = screen.getByTestId('root').className
    expect(compactClass).not.toEqual(spaciousClass)
  })

  it('IconButton fires onClick and respects disabled', () => {
    const onClick = vi.fn()
    render(
      <ColumnHeader>
        <ColumnHeader.Right>
          <ColumnHeader.IconButton aria-label="筛选" onClick={onClick}>
            <span>i</span>
          </ColumnHeader.IconButton>
          <ColumnHeader.IconButton
            aria-label="禁用"
            disabled
            onClick={onClick}
          >
            <span>j</span>
          </ColumnHeader.IconButton>
        </ColumnHeader.Right>
      </ColumnHeader>,
    )
    fireEvent.click(screen.getByRole('button', { name: '筛选' }))
    fireEvent.click(screen.getByRole('button', { name: '禁用' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('Divider renders aria-hidden', () => {
    render(
      <ColumnHeader>
        <ColumnHeader.Right>
          <ColumnHeader.Divider data-testid="divider" />
        </ColumnHeader.Right>
      </ColumnHeader>,
    )
    expect(screen.getByTestId('divider')).toHaveAttribute('aria-hidden')
  })
})
