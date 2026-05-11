import { allHeadlessNodes, allHeadlessTransformers } from '@haklex/rich-headless'
import { $convertFromMarkdownString } from '@lexical/markdown'
import { createEditor, type SerializedEditorState } from 'lexical'

import type { PostModel } from '~/models/post'

const safeParseLexical = (raw: string): SerializedEditorState | null => {
  try {
    const parsed = JSON.parse(raw) as unknown
    if (
      parsed &&
      typeof parsed === 'object' &&
      'root' in (parsed as Record<string, unknown>)
    ) {
      return parsed as SerializedEditorState
    }
    return null
  } catch {
    return null
  }
}

export function convertMarkdownToInitialState(
  md: string,
): SerializedEditorState | null {
  if (typeof md !== 'string' || md.length === 0) return null
  try {
    const editor = createEditor({
      namespace: 'lexical-content-headless',
      nodes: allHeadlessNodes,
      onError: (err) => {
        throw err
      },
    })
    editor.setEditable(false)
    let serialized: SerializedEditorState | null = null
    editor.update(
      () => {
        $convertFromMarkdownString(md, allHeadlessTransformers)
      },
      { discrete: true },
    )
    serialized = editor.getEditorState().toJSON()
    return serialized
  } catch {
    return null
  }
}

export function decodeInitialValue(
  post: PostModel,
): SerializedEditorState | null {
  if (!post.content) {
    if (post.text && post.text.length > 0) {
      return convertMarkdownToInitialState(post.text)
    }
    return null
  }
  if (post.contentFormat === 'lexical') {
    return safeParseLexical(post.content)
  }
  return convertMarkdownToInitialState(post.content)
}
