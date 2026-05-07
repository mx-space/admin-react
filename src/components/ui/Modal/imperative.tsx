import { useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'

import { Button } from '~/components/ui/Button'

import { Modal } from './index'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

type FooterCtx = { close: () => void }
type FooterRender = ReactNode | ((ctx: FooterCtx) => ReactNode)

export interface ModalOpenOptions {
  id?: string
  title?: ReactNode
  description?: ReactNode
  body?: ReactNode
  footer?: FooterRender
  size?: ModalSize
  dismissOnBackdrop?: boolean
  dismissOnEscape?: boolean
  onClose?: () => void
}

interface Entry {
  id: string
  open: boolean
  size: ModalSize
  title?: ReactNode
  description?: ReactNode
  body?: ReactNode
  footer?: FooterRender
  dismissOnBackdrop: boolean
  dismissOnEscape: boolean
  onClose?: () => void
}

const listeners = new Set<() => void>()
let entries: Entry[] = []

const emit = () => {
  for (const l of listeners) l()
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

const getSnapshot = () => entries

const nextId = () => `mx-modal-${Math.random().toString(36).slice(2, 9)}`

const beginClose = (id: string) => {
  entries = entries.map((e) => (e.id === id ? { ...e, open: false } : e))
  emit()
}

const finalizeClose = (id: string) => {
  const target = entries.find((e) => e.id === id)
  target?.onClose?.()
  entries = entries.filter((e) => e.id !== id)
  emit()
}

export interface ModalHandle {
  id: string
  close: () => void
}

const open = (opts: ModalOpenOptions = {}): ModalHandle => {
  const id = opts.id ?? nextId()
  const entry: Entry = {
    id,
    open: true,
    size: opts.size ?? 'md',
    title: opts.title,
    description: opts.description,
    body: opts.body,
    footer: opts.footer,
    dismissOnBackdrop: opts.dismissOnBackdrop ?? true,
    dismissOnEscape: opts.dismissOnEscape ?? true,
    onClose: opts.onClose,
  }
  entries = [...entries, entry]
  emit()
  return { id, close: () => beginClose(id) }
}

const close = (id: string) => beginClose(id)

const dismissAll = () => {
  entries = entries.map((e) => ({ ...e, open: false }))
  emit()
}

export interface ModalConfirmOptions {
  title: ReactNode
  description?: ReactNode
  body?: ReactNode
  confirmText?: ReactNode
  cancelText?: ReactNode
  danger?: boolean
  size?: ModalSize
}

const confirm = (opts: ModalConfirmOptions): Promise<boolean> =>
  new Promise<boolean>((resolve) => {
    let result = false
    open({
      size: opts.size ?? 'sm',
      title: opts.title,
      description: opts.description,
      body: opts.body,
      onClose: () => resolve(result),
      footer: (ctx) => (
        <>
          <Button intent="tertiary" onClick={ctx.close}>
            {opts.cancelText ?? 'Cancel'}
          </Button>
          <Button
            intent={opts.danger ? 'danger' : 'primary'}
            onClick={() => {
              result = true
              ctx.close()
            }}
          >
            {opts.confirmText ?? 'Confirm'}
          </Button>
        </>
      ),
    })
  })

export const modal = {
  open,
  confirm,
  close,
  dismissAll,
}

const renderFooter = (footer: FooterRender, id: string): ReactNode => {
  if (typeof footer === 'function') return footer({ close: () => beginClose(id) })
  return footer
}

export const ModalHost = () => {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return (
    <>
      {snap.map((entry) => (
        <Modal.Root
          key={entry.id}
          open={entry.open}
          onOpenChange={(next) => {
            if (!next) beginClose(entry.id)
          }}
          onOpenChangeComplete={(next) => {
            if (!next) finalizeClose(entry.id)
          }}
          disablePointerDismissal={!entry.dismissOnBackdrop}
        >
          <Modal.Portal>
            <Modal.Backdrop />
            <Modal.Content size={entry.size}>
              {entry.title || entry.description ? (
                <Modal.Header>
                  <div>
                    {entry.title ? (
                      <Modal.Title>{entry.title}</Modal.Title>
                    ) : null}
                    {entry.description ? (
                      <Modal.Description>{entry.description}</Modal.Description>
                    ) : null}
                  </div>
                </Modal.Header>
              ) : null}
              {entry.body ? <Modal.Body>{entry.body}</Modal.Body> : null}
              {entry.footer ? (
                <Modal.Footer>{renderFooter(entry.footer, entry.id)}</Modal.Footer>
              ) : null}
            </Modal.Content>
          </Modal.Portal>
        </Modal.Root>
      ))}
    </>
  )
}
