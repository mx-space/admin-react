import type { CategoryModel } from './category'
import type { Image } from './base'

export interface PostModel {
  id: string
  title: string
  slug: string
  text: string
  summary?: string | null
  copyright: boolean
  tags: string[]
  readCount: number
  likeCount: number
  categoryId: string
  category: CategoryModel
  images: Image[]
  contentFormat?: 'markdown' | 'lexical'
  content?: string
  createdAt: string
  modifiedAt: string | null
  pinAt?: string | null
  pinOrder?: number | null
  isPublished?: boolean
  meta?: Record<string, unknown> | null
  related?: Pick<
    PostModel,
    | 'id'
    | 'title'
    | 'slug'
    | 'categoryId'
    | 'modifiedAt'
    | 'createdAt'
    | 'category'
    | 'summary'
  >[]
}
