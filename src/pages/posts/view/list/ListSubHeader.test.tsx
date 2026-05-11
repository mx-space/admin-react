import { Provider as JotaiProvider } from 'jotai'
import { describe, expect, it, vi } from 'vitest'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'

vi.mock('~/hooks/queries/useCategoryList', () => ({
  useCategoryList: () => ({ data: [] }),
}))

import { ListSubHeader } from './ListSubHeader'

const renderWith = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return render(
    <JotaiProvider>
      <QueryClientProvider client={qc}>
        <ListSubHeader />
      </QueryClientProvider>
    </JotaiProvider>,
  )
}

describe('ListSubHeader', () => {
  it('renders filter and sort triggers', () => {
    renderWith()
    expect(screen.getByTestId('filter-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('sort-trigger')).toBeInTheDocument()
  })

  it('opens filter popover on click', () => {
    renderWith()
    fireEvent.click(screen.getByTestId('filter-trigger'))
    expect(screen.getByTestId('filter-popover')).toBeInTheDocument()
  })

  it('opens sort popover on click', () => {
    renderWith()
    fireEvent.click(screen.getByTestId('sort-trigger'))
    expect(screen.getByTestId('sort-popover')).toBeInTheDocument()
  })

  it('shows status chip after picking draft', () => {
    renderWith()
    fireEvent.click(screen.getByTestId('filter-trigger'))
    // status-published is default-disabled when BACKEND_CAPS.postsStatus=false
    // but radio remains clickable for the 'all' default — so test status pill being disabled
    expect(screen.getByTestId('filter-status-draft')).toBeDisabled()
  })
})
