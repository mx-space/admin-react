import { request } from '~/lib/request'
import type { Image, PaginateResult } from '~/models'
import type {
  DraftHistoryListItem,
  DraftModel,
  DraftRefType,
  TypeSpecificData,
} from '~/models/draft'

export interface GetDraftsParams {
  page?: number
  size?: number
  refType?: DraftRefType
  hasRef?: boolean
  sortBy?: string
  sortOrder?: 1 | -1
}

export interface CreateDraftData {
  refType: DraftRefType
  refId?: string
  title?: string
  text?: string
  contentFormat?: 'markdown' | 'lexical'
  content?: string
  images?: Image[]
  meta?: Record<string, unknown>
  typeSpecificData?: TypeSpecificData
}

export interface UpdateDraftData extends Partial<CreateDraftData> {}

export const draftsApi = {
  getList: (params?: GetDraftsParams) =>
    request<PaginateResult<DraftModel>>('/drafts', { query: params }),

  getById: (id: string) => request<DraftModel>(`/drafts/${id}`),

  getByRef: (refType: DraftRefType, refId: string) =>
    request<DraftModel | null>(`/drafts/by-ref/${refType}/${refId}`),

  getNewDrafts: (refType: DraftRefType) =>
    request<DraftModel[]>(`/drafts/by-ref/${refType}/new`),

  create: (data: CreateDraftData) =>
    request<DraftModel>('/drafts', { method: 'POST', body: data }),

  update: (id: string, data: UpdateDraftData) =>
    request<DraftModel>(`/drafts/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/drafts/${id}`, { method: 'DELETE' }),

  getHistory: (id: string) =>
    request<DraftHistoryListItem[]>(`/drafts/${id}/history`),

  getHistoryVersion: (id: string, version: number) =>
    request<DraftModel>(`/drafts/${id}/history/${version}`),

  restoreVersion: (id: string, version: number) =>
    request<DraftModel>(`/drafts/${id}/restore/${version}`, { method: 'POST' }),
}
