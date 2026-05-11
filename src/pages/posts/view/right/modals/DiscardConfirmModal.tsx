import type { FC } from 'react'

import { Button, Modal } from '~/components/ui'

export interface DiscardConfirmModalProps {
  open: boolean
  dirtyFieldCount: number
  onConfirm: () => void
  onClose: () => void
}

export const DiscardConfirmModal: FC<DiscardConfirmModalProps> = ({
  open,
  dirtyFieldCount,
  onConfirm,
  onClose,
}) => (
  <Modal.Root
    open={open}
    onOpenChange={(next) => {
      if (!next) onClose()
    }}
  >
    <Modal.Portal>
      <Modal.Backdrop />
      <Modal.Content size="sm" data-testid="discard-modal">
        <Modal.Header>
          <Modal.Title>弃改？</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Description>
            将放弃 {dirtyFieldCount} 项字段改动 + 正文改动，回到已发布版本。
          </Modal.Description>
        </Modal.Body>
        <Modal.Footer>
          <Button
            intent="tertiary"
            onClick={onClose}
            data-testid="discard-cancel"
          >
            取消
          </Button>
          <Button
            intent="danger"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            data-testid="discard-confirm"
          >
            弃改
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Portal>
  </Modal.Root>
)
