import type { Image, Pager } from './base'

export enum DraftRefType {
  Post = 'post',
  Note = 'note',
  Page = 'page',
}

export interface DraftHistoryModel {
  version: number
  title: string
  text: string
  contentFormat?: 'markdown' | 'lexical'
  content?: string
  typeSpecificData?: Record<string, unknown>
  savedAt: string
}

export interface DraftModel {
  id: string
  refType: DraftRefType
  refId?: string
  title: string
  text: string
  contentFormat?: 'markdown' | 'lexical'
  content?: string
  images?: Image[]
  meta?: Record<string, unknown>
  typeSpecificData?: TypeSpecificData
  version: number
  updatedAt: string
  createdAt: string
  history: DraftHistoryModel[]
}

export interface DraftResponse {
  data: DraftModel[]
  pagination: Pager
}

export interface DraftHistoryListItem {
  version: number
  title: string
  savedAt: string
  isFullSnapshot: boolean
  refVersion?: number
  baseVersion?: number
}

export interface PostSpecificData {
  slug?: string
  categoryId?: string
  copyright?: boolean
  tags?: string[]
  summary?: string | null
  pin?: string | null
  pinOrder?: number
  relatedId?: string[]
  isPublished?: boolean
}

export interface NoteSpecificData {
  mood?: string
  weather?: string
  password?: string | null
  publicAt?: string | null
  bookmark?: boolean
  location?: string
  coordinates?: {
    latitude: number
    longitude: number
  } | null
  topicId?: string | null
  isPublished?: boolean
}

export interface PageSpecificData {
  slug?: string
  subtitle?: string | null
  order?: number
}

export type TypeSpecificData =
  | PostSpecificData
  | NoteSpecificData
  | PageSpecificData
