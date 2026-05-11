import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import {
  draftsApi,
  type CreateDraftData,
  type UpdateDraftData,
} from '~/api/drafts'
import { postsApi } from '~/api/posts'
import { postDraftDirtyMapAtom } from '~/atoms/draft'
import {
  DraftRefType,
  type DraftModel,
  type PostSpecificData,
} from '~/models/draft'
import type { PostModel } from '~/models/post'

import { deriveEffectivePost } from './useEffectivePost'
import { postDetailQueryKey } from './usePosts'

const POSTS_LIST_KEY = 'posts.list'
const AUTOSAVE_DEBOUNCE_MS = 10_000
const SAVED_DECAY_MS = 2_000

export const draftByRefQueryKey = (refType: DraftRefType, refId: string) =>
  ['drafts', 'by-ref', refType, refId] as const

export const useDraftByRef = (
  refType: DraftRefType,
  refId: string | null,
) =>
  useQuery({
    queryKey: refId
      ? draftByRefQueryKey(refType, refId)
      : ['drafts', 'by-ref', refType, null],
    queryFn: () => draftsApi.getByRef(refType, refId as string),
    enabled: !!refId,
    staleTime: 30_000,
  })

export const useCreateDraft = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDraftData) => draftsApi.create(data),
    onSuccess: (draft) => {
      if (draft.refType && draft.refId) {
        qc.setQueryData(draftByRefQueryKey(draft.refType, draft.refId), draft)
      }
    },
  })
}

export const useUpdateDraft = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDraftData }) =>
      draftsApi.update(id, data),
    onSuccess: (draft) => {
      if (draft.refType && draft.refId) {
        qc.setQueryData(draftByRefQueryKey(draft.refType, draft.refId), draft)
      }
    },
  })
}

export const useDeleteDraft = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: string
      refType?: DraftRefType
      refId?: string
    }) => draftsApi.delete(id),
    onSuccess: (_res, vars) => {
      if (vars.refType && vars.refId) {
        qc.setQueryData(draftByRefQueryKey(vars.refType, vars.refId), null)
      }
    },
  })
}

interface PublishVars {
  draftId: string | null
  post: PostModel
  draft: DraftModel | null
}

export const usePublishDraft = (postId: string | null) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ draftId, post, draft }: PublishVars) => {
      if (!postId) throw new Error('postId is required')
      const merged = deriveEffectivePost(post, draft)
      const updated = await postsApi.patch(postId, merged as Partial<PostModel>)
      if (draftId) {
        try {
          await draftsApi.delete(draftId)
        } catch {
          // ignore: post is already published; draft cleanup is best-effort
        }
      }
      return updated
    },
    onSuccess: (updated) => {
      if (!postId) return
      qc.setQueryData(postDetailQueryKey(postId), updated)
      qc.setQueryData(draftByRefQueryKey(DraftRefType.Post, postId), null)
      qc.invalidateQueries({ queryKey: ['table', POSTS_LIST_KEY] })
    },
  })
}

export const useDiscardDraft = (postId: string | null) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ draftId }: { draftId: string }) => {
      await draftsApi.delete(draftId)
    },
    onSuccess: () => {
      if (!postId) return
      qc.setQueryData(draftByRefQueryKey(DraftRefType.Post, postId), null)
      qc.invalidateQueries({ queryKey: postDetailQueryKey(postId) })
    },
  })
}

export type AutosaveStatus =
  | 'idle'
  | 'pending'
  | 'saving'
  | 'saved'
  | 'error'

export interface DraftAutosaveBuffer {
  fields: Partial<PostSpecificData>
  content?: string
  contentFormat?: 'lexical'
  text?: string
}

export interface DraftAutosave {
  commit(patch: Partial<PostSpecificData>): void
  commitBody(content: string): void
  commitText(text: string): void
  flush(): Promise<void>
  retry(): void
  status: AutosaveStatus
  lastSavedAt: string | null
  lastError: Error | null
  draftId: string | null
  dirtyFieldCount: number
}

const emptyBuffer = (): DraftAutosaveBuffer => ({ fields: {} })

const isBufferEmpty = (b: DraftAutosaveBuffer): boolean =>
  Object.keys(b.fields).length === 0 &&
  b.content === undefined &&
  b.text === undefined

const countDirtyFields = (b: DraftAutosaveBuffer): number => {
  let n = Object.keys(b.fields).length
  if (b.content !== undefined) n += 1
  if (b.text !== undefined) n += 1
  return n
}

export const useDraftAutosave = (postId: string | null): DraftAutosave => {
  const qc = useQueryClient()
  const setDirtyMap = useSetAtom(postDraftDirtyMapAtom)

  const bufferRef = useRef<DraftAutosaveBuffer>(emptyBuffer())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const decayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inflightRef = useRef<Promise<void> | null>(null)
  const draftIdRef = useRef<string | null>(null)

  const [status, setStatus] = useState<AutosaveStatus>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [lastError, setLastError] = useState<Error | null>(null)
  const [draftId, setDraftId] = useState<string | null>(null)
  const [dirtyFieldCount, setDirtyFieldCount] = useState(0)

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const clearDecay = useCallback(() => {
    if (decayRef.current != null) {
      clearTimeout(decayRef.current)
      decayRef.current = null
    }
  }, [])

  const syncDirtyAtom = useCallback(
    (dirty: boolean) => {
      if (!postId) return
      setDirtyMap((prev) => {
        const cur = prev[postId] ?? false
        if (cur === dirty) return prev
        const next = { ...prev }
        if (dirty) next[postId] = true
        else delete next[postId]
        return next
      })
    },
    [postId, setDirtyMap],
  )

  const refreshDirtyCount = useCallback(() => {
    const n = countDirtyFields(bufferRef.current)
    setDirtyFieldCount(n)
    syncDirtyAtom(n > 0)
  }, [syncDirtyAtom])

  const performSave = useCallback(async (): Promise<void> => {
    if (!postId) return
    if (isBufferEmpty(bufferRef.current)) return

    const snapshot: DraftAutosaveBuffer = {
      fields: { ...bufferRef.current.fields },
      content: bufferRef.current.content,
      contentFormat: bufferRef.current.contentFormat,
      text: bufferRef.current.text,
    }

    setStatus('saving')

    try {
      let saved: DraftModel
      if (draftIdRef.current == null) {
        const payload: CreateDraftData = {
          refType: DraftRefType.Post,
          refId: postId,
          typeSpecificData: snapshot.fields,
        }
        if (snapshot.content !== undefined) payload.content = snapshot.content
        if (snapshot.contentFormat !== undefined) {
          payload.contentFormat = snapshot.contentFormat
        }
        if (snapshot.text !== undefined) payload.text = snapshot.text
        saved = await draftsApi.create(payload)
        draftIdRef.current = saved.id
        setDraftId(saved.id)
      } else {
        const payload: UpdateDraftData = {
          typeSpecificData: snapshot.fields,
        }
        if (snapshot.content !== undefined) payload.content = snapshot.content
        if (snapshot.contentFormat !== undefined) {
          payload.contentFormat = snapshot.contentFormat
        }
        if (snapshot.text !== undefined) payload.text = snapshot.text
        saved = await draftsApi.update(draftIdRef.current, payload)
      }

      // Drain only what we sent. Newer commits while saving stay in buffer.
      const cur = bufferRef.current
      const drainedFields: Partial<PostSpecificData> = { ...cur.fields }
      for (const key of Object.keys(snapshot.fields)) {
        delete drainedFields[key as keyof PostSpecificData]
      }
      const next: DraftAutosaveBuffer = { fields: drainedFields }
      if (cur.content !== undefined && cur.content !== snapshot.content) {
        next.content = cur.content
        next.contentFormat = cur.contentFormat
      }
      if (cur.text !== undefined && cur.text !== snapshot.text) {
        next.text = cur.text
      }
      bufferRef.current = next
      refreshDirtyCount()

      if (saved.refId) {
        qc.setQueryData(
          draftByRefQueryKey(DraftRefType.Post, saved.refId),
          saved,
        )
      }

      setLastError(null)
      setLastSavedAt(saved.updatedAt ?? new Date().toISOString())
      setStatus('saved')
      clearDecay()
      decayRef.current = setTimeout(() => {
        setStatus((s) => (s === 'saved' ? 'idle' : s))
        decayRef.current = null
      }, SAVED_DECAY_MS)
    } catch (err) {
      setLastError(err instanceof Error ? err : new Error(String(err)))
      setStatus('error')
    }
  }, [postId, qc, refreshDirtyCount, clearDecay])

  const fire = useCallback((): Promise<void> => {
    clearTimer()
    if (inflightRef.current) return inflightRef.current
    const p = performSave().finally(() => {
      inflightRef.current = null
    })
    inflightRef.current = p
    return p
  }, [clearTimer, performSave])

  const scheduleSave = useCallback(() => {
    clearTimer()
    setStatus((s) => (s === 'saving' ? s : 'pending'))
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      void fire()
    }, AUTOSAVE_DEBOUNCE_MS)
  }, [clearTimer, fire])

  const commit = useCallback(
    (patch: Partial<PostSpecificData>) => {
      if (!postId) return
      bufferRef.current = {
        ...bufferRef.current,
        fields: { ...bufferRef.current.fields, ...patch },
      }
      refreshDirtyCount()
      scheduleSave()
    },
    [postId, refreshDirtyCount, scheduleSave],
  )

  const commitBody = useCallback(
    (content: string) => {
      if (!postId) return
      bufferRef.current = {
        ...bufferRef.current,
        content,
        contentFormat: 'lexical',
      }
      refreshDirtyCount()
      scheduleSave()
    },
    [postId, refreshDirtyCount, scheduleSave],
  )

  const commitText = useCallback(
    (text: string) => {
      if (!postId) return
      bufferRef.current = { ...bufferRef.current, text }
      refreshDirtyCount()
      scheduleSave()
    },
    [postId, refreshDirtyCount, scheduleSave],
  )

  const flush = useCallback(async (): Promise<void> => {
    clearTimer()
    if (inflightRef.current) {
      await inflightRef.current
      if (!isBufferEmpty(bufferRef.current)) {
        await fire()
      }
      return
    }
    if (isBufferEmpty(bufferRef.current)) return
    await fire()
  }, [clearTimer, fire])

  const retry = useCallback(() => {
    if (status !== 'error') return
    void fire()
  }, [status, fire])

  // Reset between posts. New postId -> drop everything tied to the old one.
  useEffect(() => {
    bufferRef.current = emptyBuffer()
    draftIdRef.current = null
    setDraftId(null)
    setStatus('idle')
    setLastError(null)
    setLastSavedAt(null)
    setDirtyFieldCount(0)
    clearTimer()
    clearDecay()
  }, [postId, clearTimer, clearDecay])

  // Tear down timers when the host unmounts.
  useEffect(
    () => () => {
      clearTimer()
      clearDecay()
    },
    [clearTimer, clearDecay],
  )

  return useMemo(
    () => ({
      commit,
      commitBody,
      commitText,
      flush,
      retry,
      status,
      lastSavedAt,
      lastError,
      draftId,
      dirtyFieldCount,
    }),
    [
      commit,
      commitBody,
      commitText,
      flush,
      retry,
      status,
      lastSavedAt,
      lastError,
      draftId,
      dirtyFieldCount,
    ],
  )
}
