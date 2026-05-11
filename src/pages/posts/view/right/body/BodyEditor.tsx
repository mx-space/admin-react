import type { FC } from 'react'
import type { SerializedEditorState } from 'lexical'

import { RichEditor } from '~/components/editor/rich/RichEditor'

import { bodyEditorStyle } from './BodyEditor.css'

export interface BodyEditorProps {
  initialValue: SerializedEditorState | null
  onChangeJSON: (json: string) => void
  onChangeText: (markdown: string) => void
  showToolbar?: boolean
}

export const BodyEditor: FC<BodyEditorProps> = ({
  initialValue,
  onChangeJSON,
  onChangeText,
  showToolbar = false,
}) => (
  <div className={bodyEditorStyle} data-testid="body-editor">
    <RichEditor
      variant="article"
      showToolbar={showToolbar}
      initialValue={initialValue ?? undefined}
      onChange={(state) => onChangeJSON(JSON.stringify(state))}
      onTextChange={onChangeText}
    />
  </div>
)
