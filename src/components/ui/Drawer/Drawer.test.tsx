import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Drawer } from './index'

function Harness({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger>open</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Content placement="left" size="full">
          <p>drawer body</p>
          <Drawer.Close>close</Drawer.Close>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

describe('Drawer', () => {
  it('opens via Trigger and closes via Close', () => {
    render(<Harness />)
    expect(screen.queryByText('drawer body')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByText('drawer body')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(screen.queryByText('drawer body')).not.toBeInTheDocument()
  })

  it('applies the configured placement variant class', () => {
    render(
      <Drawer.Root open onOpenChange={() => {}}>
        <Drawer.Portal>
          <Drawer.Content placement="right" size="md" data-testid="content">
            <span>x</span>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>,
    )
    const node = screen.getByTestId('content')
    expect(node.className).toMatch(/placement_right/)
    expect(node.className).toMatch(/size_md/)
  })
})
