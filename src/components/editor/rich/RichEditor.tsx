import '@haklex/rich-editor/style.css'

import { DialogStackProvider } from '@haklex/rich-editor-ui'
import {
  NestedDocPlugin,
  NestedDocDialogEditorProvider,
  nestedDocEditNodes,
} from '@haklex/rich-ext-nested-doc'
import { ExcalidrawConfigProvider, ShiroEditor } from '@haklex/rich-kit-shiro'
import { ToolbarPlugin } from '@haklex/rich-plugin-toolbar'
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown'
import { useCallback, useRef } from 'react'
import type { RichEditorVariant } from '@haklex/rich-editor'
import type { LexicalEditor, SerializedEditorState } from 'lexical'
import type { FC } from 'react'

import { env } from '~/constants/env'

import { EnrichmentFetcherProvider } from './EnrichmentLinkCardContext'
import { NestedDocDialogEditor } from './NestedDocDialogEditor'
import { fetchEnrichment } from './helpers/fetchEnrichment'
import { imageUpload as defaultImageUpload } from './helpers/imageUpload'
import { saveExcalidrawSnapshot } from './helpers/saveExcalidrawSnapshot'

import './setup-enrichment-linkcard'

export interface RichEditorProps {
  initialValue?: SerializedEditorState
  variant?: RichEditorVariant
  autoFocus?: boolean
  placeholder?: string
  showToolbar?: boolean
  className?: string
  contentClassName?: string
  debounceMs?: number
  imageUpload?: (file: File) => Promise<{
    src: string
    altText?: string
    width?: number
    height?: number
    thumbhash?: string
  }>
  onChange?: (state: SerializedEditorState) => void
  onTextChange?: (markdown: string) => void
  onSubmit?: () => void
  onEditorReady?: (editor: LexicalEditor | null) => void
}

export const RichEditor: FC<RichEditorProps> = ({
  initialValue,
  variant,
  autoFocus,
  placeholder,
  showToolbar = true,
  className,
  contentClassName,
  debounceMs,
  imageUpload,
  onChange,
  onTextChange,
  onSubmit,
  onEditorReady,
}) => {
  const editorRef = useRef<LexicalEditor | null>(null)

  const handleEditorReady = useCallback(
    (editor: LexicalEditor | null) => {
      editorRef.current = editor
      onEditorReady?.(editor)
      if (editor && onTextChange) {
        editor.read(() => onTextChange($convertToMarkdownString(TRANSFORMERS)))
      }
    },
    [onEditorReady, onTextChange],
  )

  const handleChange = useCallback(
    (state: SerializedEditorState) => {
      onChange?.(state)
      const editor = editorRef.current
      if (editor && onTextChange) {
        editor.read(() => onTextChange($convertToMarkdownString(TRANSFORMERS)))
      }
    },
    [onChange, onTextChange],
  )

  return (
    <EnrichmentFetcherProvider value={fetchEnrichment}>
      <NestedDocDialogEditorProvider value={NestedDocDialogEditor}>
        <DialogStackProvider>
          <ExcalidrawConfigProvider
            saveSnapshot={saveExcalidrawSnapshot}
            apiUrl={env.baseApi}
          >
            <ShiroEditor
              initialValue={initialValue}
              variant={variant}
              autoFocus={autoFocus}
              placeholder={placeholder}
              className={className}
              contentClassName={contentClassName}
              debounceMs={debounceMs}
              extraNodes={nestedDocEditNodes}
              header={showToolbar ? <ToolbarPlugin /> : undefined}
              imageUpload={imageUpload ?? defaultImageUpload}
              onChange={handleChange}
              onSubmit={onSubmit}
              onEditorReady={handleEditorReady}
            >
              <NestedDocPlugin />
            </ShiroEditor>
          </ExcalidrawConfigProvider>
        </DialogStackProvider>
      </NestedDocDialogEditorProvider>
    </EnrichmentFetcherProvider>
  )
}
