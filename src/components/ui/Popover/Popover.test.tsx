import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Popover } from './index'

function Harness({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup padding="md" width="md">
            <p>popover body</p>
            <Popover.Close>close</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

describe('Popover', () => {
  it('opens via Trigger and closes via Close', () => {
    render(<Harness />)
    expect(screen.queryByText('popover body')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByText('popover body')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(screen.queryByText('popover body')).not.toBeInTheDocument()
  })

  it('applies padding + width variant classes', () => {
    render(
      <Popover.Root open onOpenChange={() => {}}>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup padding="lg" width="sm" data-testid="popup">
              <span>x</span>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>,
    )
    const node = screen.getByTestId('popup')
    expect(node.className).toMatch(/padding_lg/)
    expect(node.className).toMatch(/width_sm/)
  })
})
