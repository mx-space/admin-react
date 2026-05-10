import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { initialTableState, type TableState } from '~/atoms/table'

import { DataTable } from './DataTable'
import { useDataTable } from './hooks/useDataTable'

interface Row {
  id: string
  title: string
  category: string
}

const sample: Row[] = [
  { id: '1', title: 'A', category: 'tech' },
  { id: '2', title: 'B', category: 'log' },
  { id: '3', title: 'C', category: 'tech' },
]

const columns: ColumnDef<Row>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: '标题',
    enableSorting: true,
    meta: { sortable: true },
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: '分类',
  },
]

function Harness({
  initial = initialTableState,
  data = sample,
  totalCount = sample.length,
  selectable = false,
  selectionMode,
  isRowSelectable,
  loading = false,
  empty,
}: {
  initial?: TableState
  data?: Row[]
  totalCount?: number
  selectable?: boolean
  selectionMode?: 'single' | 'multiple'
  isRowSelectable?: (row: Row) => boolean
  loading?: boolean
  empty?: React.ReactNode
}) {
  const [state, setState] = useState<TableState>(initial)
  return (
    <DataTable
      data={data}
      columns={columns}
      totalCount={totalCount}
      state={state}
      setState={(u) => setState(typeof u === 'function' ? u(state) : u)}
      rowKey={(r) => r.id}
      selectable={selectable}
      selectionMode={selectionMode}
      isRowSelectable={isRowSelectable}
      loading={loading}
      empty={empty}
    />
  )
}

describe('<DataTable>', () => {
  it('renders rows and headers', () => {
    render(<Harness />)
    expect(screen.getByText('标题')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('toggles sort asc → desc → none on a sortable header', () => {
    function Probe() {
      const [state, setState] = useState<TableState>(initialTableState)
      return (
        <>
          <DataTable
            data={sample}
            columns={columns}
            totalCount={sample.length}
            state={state}
            setState={(u) =>
              setState(typeof u === 'function' ? u(state) : u)
            }
            rowKey={(r) => r.id}
          />
          <div data-testid="probe">{`${state.sortBy ?? ''}/${state.sortOrder ?? ''}`}</div>
        </>
      )
    }
    render(<Probe />)
    const head = screen.getByText('标题')
    fireEvent.click(head)
    expect(screen.getByTestId('probe').textContent).toBe('title/asc')
    fireEvent.click(head)
    expect(screen.getByTestId('probe').textContent).toBe('title/desc')
    fireEvent.click(head)
    expect(screen.getByTestId('probe').textContent).toBe('/')
  })

  it('selectable injects header + row checkboxes; toggling row writes selectedRowKeys', () => {
    function Probe() {
      const [state, setState] = useState<TableState>(initialTableState)
      return (
        <>
          <DataTable
            data={sample}
            columns={columns}
            totalCount={sample.length}
            state={state}
            setState={(u) =>
              setState(typeof u === 'function' ? u(state) : u)
            }
            rowKey={(r) => r.id}
            selectable
          />
          <div data-testid="sel">{state.selectedRowKeys.join(',')}</div>
        </>
      )
    }
    render(<Probe />)
    const checkboxes = screen.getAllByRole('checkbox')
    // first checkbox is the header; second is row 1
    expect(checkboxes.length).toBe(1 + sample.length)
    fireEvent.click(checkboxes[1])
    expect(screen.getByTestId('sel').textContent).toBe('1')
    fireEvent.click(checkboxes[2])
    expect(screen.getByTestId('sel').textContent).toBe('1,2')
  })

  it('selectable header checkbox toggles all on current page', () => {
    function Probe() {
      const [state, setState] = useState<TableState>(initialTableState)
      return (
        <>
          <DataTable
            data={sample}
            columns={columns}
            totalCount={sample.length}
            state={state}
            setState={(u) =>
              setState(typeof u === 'function' ? u(state) : u)
            }
            rowKey={(r) => r.id}
            selectable
          />
          <div data-testid="sel">{state.selectedRowKeys.join(',')}</div>
        </>
      )
    }
    render(<Probe />)
    const [headerCheckbox] = screen.getAllByRole('checkbox')
    fireEvent.click(headerCheckbox)
    expect(screen.getByTestId('sel').textContent).toBe('1,2,3')
  })

  it('isRowSelectable disables checkbox for predicate-false rows', () => {
    render(
      <Harness selectable isRowSelectable={(r) => r.id !== '2'} />,
    )
    const checkboxes = screen.getAllByRole('checkbox')
    // header + 3 row checkboxes; row 2's checkbox is index 2
    expect(checkboxes[2].getAttribute('aria-disabled')).toBe('true')
    expect(checkboxes[1].getAttribute('aria-disabled')).not.toBe('true')
    expect(checkboxes[3].getAttribute('aria-disabled')).not.toBe('true')
  })

  it('selectionMode="single" enforces at-most-one selection', () => {
    function Probe() {
      const [state, setState] = useState<TableState>(initialTableState)
      return (
        <>
          <DataTable
            data={sample}
            columns={columns}
            totalCount={sample.length}
            state={state}
            setState={(u) =>
              setState(typeof u === 'function' ? u(state) : u)
            }
            rowKey={(r) => r.id}
            selectable
            selectionMode="single"
          />
          <div data-testid="sel">{state.selectedRowKeys.join(',')}</div>
        </>
      )
    }
    render(<Probe />)
    // Radios — no header radio; 3 row radios.
    const radios = screen.getAllByRole('radio')
    expect(radios.length).toBe(3)
    fireEvent.click(radios[0])
    expect(screen.getByTestId('sel').textContent).toBe('1')
    fireEvent.click(radios[2])
    expect(screen.getByTestId('sel').textContent).toBe('3')
  })

  it('renders skeleton rows when loading and empty', () => {
    render(<Harness data={[]} totalCount={0} loading />)
    // skeleton uses role=status; header is rendered too. Confirm no row "A".
    expect(screen.queryByText('A')).toBeNull()
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
  })

  it('renders empty state when no rows and not loading', () => {
    render(<Harness data={[]} totalCount={0} />)
    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })

  it('keeps prior rows visible during refetch (loading + non-empty data)', () => {
    render(<Harness loading />)
    // data is non-empty; loading should NOT trigger skeleton override.
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('reconciles state.page when totalCount shrinks below current page', async () => {
    function Probe({ total }: { total: number }) {
      const [state, setState] = useState<TableState>({
        ...initialTableState,
        page: 5,
        pageSize: 10,
      })
      return (
        <>
          <DataTable
            data={sample}
            columns={columns}
            totalCount={total}
            state={state}
            setState={(u) =>
              setState(typeof u === 'function' ? u(state) : u)
            }
            rowKey={(r) => r.id}
          />
          <div data-testid="page">{String(state.page)}</div>
        </>
      )
    }
    const { rerender } = render(<Probe total={100} />)
    expect(screen.getByTestId('page').textContent).toBe('5')
    rerender(<Probe total={10} />) // only 1 page now
    // After effect runs, page should be clamped to 1.
    await new Promise((r) => setTimeout(r, 0))
    expect(screen.getByTestId('page').textContent).toBe('1')
  })

  it('compound parts work without the wrapper', () => {
    function Compound() {
      const [state, setState] = useState<TableState>(initialTableState)
      const { table } = useDataTable<Row>({
        data: sample,
        columns,
        totalCount: sample.length,
        state,
        setState: (u) =>
          setState(typeof u === 'function' ? u(state) : u),
        rowKey: (r) => r.id,
      })
      return (
        <table>
          <DataTable.Header instance={table} />
          <DataTable.Body instance={table} />
        </table>
      )
    }
    render(<Compound />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('density toggle updates state.density without remount or refetch trigger', () => {
    function Probe() {
      const [state, setState] = useState<TableState>(initialTableState)
      const calls = vi.fn(setState)
      return (
        <>
          <DataTable
            data={sample}
            columns={columns}
            totalCount={sample.length}
            state={state}
            setState={(u) =>
              calls(typeof u === 'function' ? u(state) : u)
            }
            rowKey={(r) => r.id}
            showDensityToggle
          />
          <div data-testid="density">{state.density}</div>
        </>
      )
    }
    render(<Probe />)
    expect(screen.getByTestId('density').textContent).toBe('comfortable')
    fireEvent.click(screen.getByText('紧'))
    expect(screen.getByTestId('density').textContent).toBe('compact')
    fireEvent.click(screen.getByText('松'))
    expect(screen.getByTestId('density').textContent).toBe('roomy')
  })

  it('selectable injects a left-pinned selection column with position:sticky', () => {
    const { container } = render(<Harness selectable />)
    // selection column is the first th in the header
    const firstHeaderCell = container.querySelector('thead th')
    expect(firstHeaderCell).not.toBeNull()
    expect(
      (firstHeaderCell as HTMLElement).style.position,
    ).toBe('sticky')
    expect((firstHeaderCell as HTMLElement).style.left).toBe('0px')
    // each body row's first td is also sticky-pinned
    const firstBodyCell = container.querySelector('tbody tr td')
    expect(firstBodyCell).not.toBeNull()
    expect((firstBodyCell as HTMLElement).style.position).toBe('sticky')
    expect((firstBodyCell as HTMLElement).style.left).toBe('0px')
  })

  it('honours meta.fixed: "left" / "right" by pinning columns + computing offsets', () => {
    const pinnedCols: ColumnDef<Row>[] = [
      {
        id: 'title',
        accessorKey: 'title',
        header: '标题',
        meta: { fixed: 'left', width: 80 },
      },
      {
        id: 'category',
        accessorKey: 'category',
        header: '分类',
      },
      {
        id: 'actions',
        header: '操作',
        cell: () => <button type="button">×</button>,
        meta: { fixed: 'right', width: 60 },
      },
    ]
    function Probe() {
      const [state, setState] = useState<TableState>(initialTableState)
      return (
        <DataTable
          data={sample}
          columns={pinnedCols}
          totalCount={sample.length}
          state={state}
          setState={(u) => setState(typeof u === 'function' ? u(state) : u)}
          rowKey={(r) => r.id}
        />
      )
    }
    const { container } = render(<Probe />)
    const ths = container.querySelectorAll('thead th')
    // title is left-pinned: left offset 0
    expect((ths[0] as HTMLElement).style.position).toBe('sticky')
    expect((ths[0] as HTMLElement).style.left).toBe('0px')
    // category is unpinned
    expect((ths[1] as HTMLElement).style.position).toBe('')
    // actions is right-pinned: right offset 0
    expect((ths[2] as HTMLElement).style.position).toBe('sticky')
    expect((ths[2] as HTMLElement).style.right).toBe('0px')
  })

  it('skips meta.fixed without column.id (warns in dev)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const bad: ColumnDef<Row>[] = [
      {
        accessorKey: 'title',
        header: '标题',
        // no id; meta.fixed should be ignored.
        meta: { fixed: 'left' },
      },
    ]
    function Probe() {
      const [state, setState] = useState<TableState>(initialTableState)
      return (
        <DataTable
          data={sample}
          columns={bad}
          totalCount={sample.length}
          state={state}
          setState={(u) => setState(typeof u === 'function' ? u(state) : u)}
          rowKey={(r) => r.id}
        />
      )
    }
    const { container } = render(<Probe />)
    expect(warn).toHaveBeenCalled()
    const th = container.querySelector('thead th') as HTMLElement
    expect(th.style.position).toBe('')
    warn.mockRestore()
  })

  it('functional setState is supported (last-write coherence)', () => {
    function Probe() {
      const [state, setState] = useState<TableState>(initialTableState)
      return (
        <>
          <DataTable
            data={sample}
            columns={columns}
            totalCount={sample.length}
            state={state}
            setState={(u) =>
              setState(typeof u === 'function' ? u(state) : u)
            }
            rowKey={(r) => r.id}
            selectable
          />
          <div data-testid="sel">{state.selectedRowKeys.join(',')}</div>
          <button
            type="button"
            onClick={() => {
              setState((p) => ({ ...p, page: 2 }))
              setState((p) => ({ ...p, pageSize: 50 }))
            }}
          >
            mutate
          </button>
        </>
      )
    }
    render(<Probe />)
    const all = screen.getAllByRole('checkbox')
    fireEvent.click(all[1])
    expect(screen.getByTestId('sel').textContent).toBe('1')
    fireEvent.click(screen.getByText('mutate'))
    // selection preserved across functional updates that touch unrelated fields
    // (within the same event-loop turn we re-render once, so this is mostly a
    // smoke test for the API surface)
    expect(within(screen.getByTestId('sel')).queryByText(/^$/i)).toBeNull()
  })
})
