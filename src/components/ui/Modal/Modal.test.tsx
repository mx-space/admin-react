import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Modal } from './index'

function Harness({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger>open</Modal.Trigger>
      <Modal.Portal>
        <Modal.Backdrop />
        <Modal.Content size="lg">
          <Modal.Header>
            <Modal.Title>hello</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>body content</p>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>close</Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Portal>
    </Modal.Root>
  )
}

describe('Modal', () => {
  it('opens via Trigger and closes via Close', () => {
    render(<Harness />)
    expect(screen.queryByText('hello')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByText('body content')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(screen.queryByText('hello')).not.toBeInTheDocument()
  })

  it('renders Title and Description when provided', () => {
    render(
      <Modal.Root open onOpenChange={() => {}}>
        <Modal.Portal>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>Heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Modal.Description>Subline</Modal.Description>
            </Modal.Body>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>,
    )
    expect(screen.getByText('Heading')).toBeInTheDocument()
    expect(screen.getByText('Subline')).toBeInTheDocument()
  })
})
