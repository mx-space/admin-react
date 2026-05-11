import { useMemo } from 'react'

import type { DraftModel, PostSpecificData } from '~/models/draft'
import type { PostModel } from '~/models/post'

export interface EffectivePost {
  title: string
  slug: string
  categoryId: string
  tags: string[]
  summary: string | null | undefined
  copyright: boolean
  isPublished: boolean
  pinAt?: string | null
  pinOrder?: number | null
  content?: string
  contentFormat?: 'markdown' | 'lexical'
  text: string
}

const hasOwn = (obj: object | undefined | null, key: string): boolean =>
  obj != null && Object.prototype.hasOwnProperty.call(obj, key)

const pickDraftField = <K extends keyof PostSpecificData>(
  draftData: PostSpecificData | undefined,
  key: K,
): PostSpecificData[K] | undefined => {
  if (!draftData || !hasOwn(draftData, key)) return undefined
  return draftData[key]
}

export function deriveEffectivePost(
  post: PostModel,
  draft: DraftModel | null,
): EffectivePost {
  const draftData = (draft?.typeSpecificData as PostSpecificData | undefined)

  const title =
    draft && draft.title !== undefined && draft.title !== ''
      ? draft.title
      : post.title

  const text =
    draft && draft.text !== undefined && draft.text !== ''
      ? draft.text
      : post.text

  const draftSlug = pickDraftField(draftData, 'slug')
  const draftCategoryId = pickDraftField(draftData, 'categoryId')
  const draftTags = pickDraftField(draftData, 'tags')
  const draftSummary = hasOwn(draftData, 'summary')
    ? (draftData as PostSpecificData).summary
    : undefined
  const draftCopyright = pickDraftField(draftData, 'copyright')
  const draftIsPublished = pickDraftField(draftData, 'isPublished')
  const draftPin = hasOwn(draftData, 'pin')
    ? (draftData as PostSpecificData).pin
    : undefined
  const draftPinOrder = pickDraftField(draftData, 'pinOrder')

  const draftHasContent = draft != null && draft.content !== undefined
  const content = draftHasContent ? draft!.content : post.content
  const contentFormat = draftHasContent
    ? draft!.contentFormat ?? post.contentFormat
    : post.contentFormat

  return {
    title,
    slug: draftSlug ?? post.slug,
    categoryId: draftCategoryId ?? post.categoryId,
    tags: draftTags ?? post.tags,
    summary: hasOwn(draftData, 'summary') ? draftSummary : post.summary,
    copyright: draftCopyright ?? post.copyright,
    isPublished: draftIsPublished ?? post.isPublished ?? false,
    pinAt: hasOwn(draftData, 'pin') ? draftPin : post.pinAt,
    pinOrder: draftPinOrder ?? post.pinOrder,
    content,
    contentFormat,
    text,
  }
}

export function useEffectivePost(
  post: PostModel | null,
  draft: DraftModel | null,
): EffectivePost | null {
  return useMemo(() => {
    if (!post) return null
    return deriveEffectivePost(post, draft)
  }, [post, draft])
}

const COMPARED_KEYS: (keyof EffectivePost)[] = [
  'title',
  'slug',
  'categoryId',
  'tags',
  'summary',
  'copyright',
  'isPublished',
  'pinAt',
  'pinOrder',
  'content',
  'contentFormat',
  'text',
]

const isEqualValue = (a: unknown, b: unknown): boolean => {
  if (a === b) return true
  if (a == null && b == null) return true
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }
    return true
  }
  return false
}

const postEquivalent = (post: PostModel, key: keyof EffectivePost): unknown => {
  switch (key) {
    case 'pinAt':
      return post.pinAt
    case 'isPublished':
      return post.isPublished ?? false
    default:
      return (post as unknown as Record<string, unknown>)[key as string]
  }
}

export function diffEffectiveVsPublished(
  effective: EffectivePost,
  post: PostModel,
): string[] {
  const diff: string[] = []
  for (const key of COMPARED_KEYS) {
    const eVal = effective[key]
    const pVal = postEquivalent(post, key)
    if (!isEqualValue(eVal, pVal)) diff.push(key)
  }
  return diff
}
