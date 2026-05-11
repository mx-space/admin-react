import { fireEvent, render, screen } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Modal } from '~/components/ui/Modal'
import { keymapManager, ShortcutScope } from '~/lib/keymap'

import { useShortcut } from './useShortcut'

let detach: (() => void) | null = null

const ensureAttached = () => {
  if (!detach) detach = keymapManager.attach()
}

afterEach(() => {
  detach?.()
  detach = null
})

const PressJ = ({ onJ }: { onJ: () => void }) => {
  useShortcut('j', onJ, { allowRepeat: true })
  return <div data-testid="page-body">page</div>
}

describe('useShortcut', () => {
  it('fires handler when chord is pressed inside its scope', () => {
    ensureAttached()
    const handler = vi.fn()
    render(
      <ShortcutScope id="test.page" kind="page">
        <PressJ onJ={handler} />
      </ShortcutScope>,
    )
    fireEvent.keyDown(window, { key: 'j' })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not fire when scope is unmounted', () => {
    ensureAttached()
    const handler = vi.fn()
    const Harness = () => {
      const [mounted, setMounted] = useState(true)
      return (
        <>
          <button type="button" onClick={() => setMounted(false)}>
            unmount
          </button>
          {mounted && (
            <ShortcutScope id="test.page2" kind="page">
              <PressJ onJ={handler} />
            </ShortcutScope>
          )}
        </>
      )
    }
    render(<Harness />)
    fireEvent.keyDown(window, { key: 'j' })
    expect(handler).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByText('unmount'))
    fireEvent.keyDown(window, { key: 'j' })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('letter-class chords do not fire while typing in an input', () => {
    ensureAttached()
    const handler = vi.fn()
    render(
      <ShortcutScope id="test.input" kind="page">
        <input data-testid="search" />
        <PressJ onJ={handler} />
      </ShortcutScope>,
    )
    const input = screen.getByTestId('search')
    fireEvent.keyDown(input, { key: 'j' })
    expect(handler).not.toHaveBeenCalled()
    fireEvent.keyDown(window, { key: 'j' })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('mod+letter still fires inside an input', () => {
    ensureAttached()
    const handler = vi.fn()
    const Harness = () => {
      useShortcut('$mod+K', handler, { scope: 'global', passthrough: true })
      return <input data-testid="search" />
    }
    render(<Harness />)
    fireEvent.keyDown(screen.getByTestId('search'), {
      key: 'k',
      ctrlKey: true,
    })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('IME composing event does not fire any handler', () => {
    ensureAttached()
    const handler = vi.fn()
    render(
      <ShortcutScope id="test.ime" kind="page">
        <PressJ onJ={handler} />
      </ShortcutScope>,
    )
    fireEvent.keyDown(window, { key: 'j', isComposing: true })
    expect(handler).not.toHaveBeenCalled()
    fireEvent.keyDown(window, { key: 'j', keyCode: 229 })
    expect(handler).not.toHaveBeenCalled()
  })

  it('overlay scope occludes underlying page chord without passthrough', () => {
    ensureAttached()
    const pageHandler = vi.fn()
    const Harness = () => {
      const [open, setOpen] = useState(false)
      return (
        <ShortcutScope id="test.page3" kind="page">
          <button type="button" onClick={() => setOpen(true)}>
            open
          </button>
          <PressJ onJ={pageHandler} />
          <Modal.Root open={open} onOpenChange={setOpen}>
            <Modal.Portal>
              <Modal.Backdrop />
              <Modal.Content>
                <Modal.Body>modal body</Modal.Body>
              </Modal.Content>
            </Modal.Portal>
          </Modal.Root>
        </ShortcutScope>
      )
    }
    render(<Harness />)
    fireEvent.keyDown(window, { key: 'j' })
    expect(pageHandler).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByText('open'))
    expect(screen.getByText('modal body')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'j' })
    expect(pageHandler).toHaveBeenCalledTimes(1)
  })

  it('passthrough chord at global scope fires while overlay is open', () => {
    ensureAttached()
    const handler = vi.fn()
    const Harness = () => {
      const [open, setOpen] = useState(false)
      useShortcut('$mod+K', handler, { scope: 'global', passthrough: true })
      useEffect(() => {
        setOpen(true)
      }, [])
      return (
        <Modal.Root open={open} onOpenChange={setOpen}>
          <Modal.Portal>
            <Modal.Backdrop />
            <Modal.Content>
              <Modal.Body>modal body</Modal.Body>
            </Modal.Content>
          </Modal.Portal>
        </Modal.Root>
      )
    }
    render(<Harness />)
    // happy-dom platform is non-Mac → mod = ctrl
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('autorepeat is suppressed unless allowRepeat: true', () => {
    ensureAttached()
    const repeatYes = vi.fn()
    const repeatNo = vi.fn()
    const Harness = () => {
      useShortcut('j', repeatYes, { allowRepeat: true })
      useShortcut('p', repeatNo)
      return null
    }
    render(
      <ShortcutScope id="test.repeat" kind="page">
        <Harness />
      </ShortcutScope>,
    )
    fireEvent.keyDown(window, { key: 'j', repeat: true })
    expect(repeatYes).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(window, { key: 'p', repeat: true })
    expect(repeatNo).not.toHaveBeenCalled()
    fireEvent.keyDown(window, { key: 'p' })
    expect(repeatNo).toHaveBeenCalledTimes(1)
  })

  // tab rejection is verified at the parser level in parse.test.ts
})
