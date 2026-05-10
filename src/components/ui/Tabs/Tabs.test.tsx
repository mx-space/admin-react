import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Tabs } from './index'

describe('Tabs', () => {
  it('renders only the active panel and switches on click', () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
          <Tabs.Tab value="b">B</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel value="a">panel-a</Tabs.Panel>
        <Tabs.Panel value="b">panel-b</Tabs.Panel>
      </Tabs.Root>,
    )

    expect(screen.getByText('panel-a')).toBeInTheDocument()
    expect(screen.queryByText('panel-b')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(screen.getByText('panel-b')).toBeInTheDocument()
  })

  it('applies the pill variant class to list', () => {
    render(
      <Tabs.Root defaultValue="x" variant="pill">
        <Tabs.List data-testid="list">
          <Tabs.Tab value="x">X</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="x">x</Tabs.Panel>
      </Tabs.Root>,
    )
    expect(screen.getByTestId('list').className).toMatch(/variant_pill/)
  })
})
