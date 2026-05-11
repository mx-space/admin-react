import type { FC } from 'react'

import { Button, Modal } from '~/components/ui'

export interface RecoveryModalProps {
  open: boolean
  onUseDraft: () => void
  onUsePublished: () => void
  onClose: () => void
}

export const RecoveryModal: FC<RecoveryModalProps> = ({
  open,
  onUseDraft,
  onUsePublished,
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
      <Modal.Content size="md" data-testid="recovery-modal">
        <Modal.Header>
          <Modal.Title>本文有未提交草稿</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Description>
            上次编辑此文留有草稿。要恢复这些改动，还是放弃，回到已发布版本？
          </Modal.Description>
        </Modal.Body>
        <Modal.Footer>
          <Button
            intent="tertiary"
            onClick={() => {
              onUsePublished()
              onClose()
            }}
            data-testid="recovery-use-published"
          >
            用已发布
          </Button>
          <Button
            intent="primary"
            onClick={() => {
              onUseDraft()
              onClose()
            }}
            data-testid="recovery-use-draft"
          >
            恢复草稿
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Portal>
  </Modal.Root>
)
