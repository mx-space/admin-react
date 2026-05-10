import { useEffect } from 'react'
import { Provider as JotaiProvider, useSetAtom } from 'jotai'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { initialTableState, tableStateAtomFamily } from '~/atoms/table'

import { useTableQuery } from './useTableQuery'

interface Row {
  id: string
  title: string
}

function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
}

function Wrap({
  children,
  client,
}: {
  children: React.ReactNode
  client: QueryClient
}) {
  return (
    <JotaiProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </JotaiProvider>
  )
}

describe('useTableQuery', () => {
  it('passes server fields to queryFn and exposes data + totalCount', async () => {
    const client = makeClient()
    const queryFn = vi.fn(async (s: typeof initialTableState) => {
      expect(s.page).toBeTypeOf('number')
      return { data: [{ id: '1', title: 'A' }] satisfies Row[], total: 1 }
    })

    function Probe() {
      const { data, totalCount, isLoading } = useTableQuery<Row>({
        key: 'qk-test:basic',
        queryFn,
      })
      return (
        <div>
          <div data-testid="loading">{String(isLoading)}</div>
          <div data-testid="total">{String(totalCount)}</div>
          <div data-testid="rows">{data.map((r) => r.id).join(',')}</div>
        </div>
      )
    }

    render(
      <Wrap client={client}>
        <Probe />
      </Wrap>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('rows').textContent).toBe('1')
    })
    expect(screen.getByTestId('total').textContent).toBe('1')
    expect(queryFn).toHaveBeenCalledTimes(1)
  })

  it('does NOT refetch when only selection or density changes (query-key purity)', async () => {
    const client = makeClient()
    const queryFn = vi.fn(async () => ({
      data: [{ id: '1', title: 'A' }] satisfies Row[],
      total: 1,
    }))

    function Probe() {
      const setState = useSetAtom(
        tableStateAtomFamily('qk-test:purity'),
      )
      const { data } = useTableQuery<Row>({
        key: 'qk-test:purity',
        queryFn,
      })
      useEffect(() => {
        // Trigger non-server-affecting changes after first fetch:
        const t = setTimeout(() => {
          setState((p) => ({ ...p, selectedRowKeys: ['1'] }))
          setState((p) => ({ ...p, density: 'compact' }))
        }, 0)
        return () => clearTimeout(t)
      }, [setState])
      return <div data-testid="rows">{data.map((r) => r.id).join(',')}</div>
    }

    render(
      <Wrap client={client}>
        <Probe />
      </Wrap>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('rows').textContent).toBe('1')
    })

    // Wait a tick for the side-effect changes to propagate.
    await new Promise((r) => setTimeout(r, 50))

    expect(queryFn).toHaveBeenCalledTimes(1)
  })

  it('refetches when filters change (server field)', async () => {
    const client = makeClient()
    const queryFn = vi.fn(async (s: typeof initialTableState) => ({
      data: [{ id: String(Object.keys(s.filters).length), title: 'X' }] satisfies Row[],
      total: 1,
    }))

    function Probe() {
      const setState = useSetAtom(
        tableStateAtomFamily('qk-test:filter'),
      )
      const { data } = useTableQuery<Row>({
        key: 'qk-test:filter',
        queryFn,
      })
      return (
        <div>
          <div data-testid="rows">{data.map((r) => r.id).join(',')}</div>
          <button
            type="button"
            onClick={() =>
              setState((p) => ({
                ...p,
                filters: { search: 'foo' },
                page: 1,
              }))
            }
          >
            filter
          </button>
        </div>
      )
    }

    render(
      <Wrap client={client}>
        <Probe />
      </Wrap>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('rows').textContent).toBe('0')
    })
    fireEvent.click(screen.getByText('filter'))
    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(2)
    })
  })
})
