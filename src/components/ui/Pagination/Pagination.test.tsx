import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Pagination } from './index'

describe('Pagination', () => {
  it('renders total label and current page', () => {
    render(<Pagination page={1} total={100} pageSize={20} onPageChange={() => {}} />)
    expect(screen.getByText('共 100 条')).toBeInTheDocument()
    expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent(
      '1',
    )
  })

  it('clicks next/prev to navigate', () => {
    function Harness() {
      const [page, setPage] = useState(2)
      return (
        <Pagination page={page} total={100} pageSize={20} onPageChange={setPage} />
      )
    }
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent('3')
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }))
    expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent('2')
  })

  it('disables prev on first page and next on last page', () => {
    const onChange = vi.fn()
    const { unmount } = render(
      <Pagination page={1} total={20} pageSize={20} onPageChange={onChange} />,
    )
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
    unmount()
  })

  it('shows ellipsis for many pages', () => {
    render(
      <Pagination
        page={1}
        total={1000}
        pageSize={20}
        siblingCount={1}
        onPageChange={() => {}}
      />,
    )
    // Should produce at least one ellipsis since 50 pages > 7 surrounding
    const buttons = screen.getAllByRole('button')
    const labels = buttons.map((b) => b.textContent)
    expect(labels).toContain('1')
    expect(labels).toContain('50')
    expect(screen.getAllByText('…').length).toBeGreaterThan(0)
  })
})
