import { useEffect, useMemo, useRef, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Button, Empty, Input, Modal, Scroll, Skeleton } from '~/components/ui'
import { PostHeader } from '~/components/post-detail/header/PostHeader'
import { env } from '~/constants/env'
import {
  useDiscardDraft,
  useDraftAutosave,
  useDraftByRef,
  usePublishDraft,
  useUpdateDraft,
  useCreateDraft,
} from '~/hooks/queries/useDrafts'
import {
  diffEffectiveVsPublished,
  useEffectivePost,
} from '~/hooks/queries/useEffectivePost'
import { usePostDelete, usePostDetail } from '~/hooks/queries/usePosts'
import { useShortcut } from '~/hooks/useShortcut'
import { decodeInitialValue } from '~/lib/lexical-content'
import { ShortcutScope } from '~/lib/keymap'
import { postsListClearTransientAtom, postsListCursorAtom } from '~/atoms/posts'
import { DraftRefType } from '~/models/draft'

import {
  bodyStyle,
  deleteConfirmInputStyle,
  hairlineStyle,
  paneStyle,
  scrollWrapStyle,
  skeletonStyle,
  stateStyle,
} from './RightPane.css'
import { RecoveryBanner } from './banners/RecoveryBanner'
import { BodyEditor } from './body/BodyEditor'
import { MetaStrip } from './meta/MetaStrip'
import { TitleField } from './meta/TitleField'
import { DiscardConfirmModal } from './modals/DiscardConfirmModal'
import { CategoryField } from './props/fields/CategoryField'
import { CopyrightField } from './props/fields/CopyrightField'
import { PinField } from './props/fields/PinField'
import { SlugField } from './props/fields/SlugField'
import { StatusField } from './props/fields/StatusField'
import { SummaryField } from './props/fields/SummaryField'
import { TagsField } from './props/fields/TagsField'
import { validateTitle } from './props/fields/validation'
import { PropsList } from './props/PropsList'

const buildExternalUrl = (
  webUrl: string,
  categorySlug: string | undefined,
  postSlug: string,
): string | null => {
  if (!webUrl || !categorySlug || !postSlug) return null
  return `${webUrl.replace(/\/$/, '')}/posts/${categorySlug}/${postSlug}`
}

const RightPaneInner = ({ cursor }: { cursor: string }) => {
  const navigate = useNavigate()
  const setClearTransient = useSetAtom(postsListClearTransientAtom)

  const { data: post, isLoading, isError } = usePostDetail(cursor)
  const { data: draft } = useDraftByRef(DraftRefType.Post, cursor)
  const effective = useEffectivePost(post ?? null, draft ?? null)

  const autosave = useDraftAutosave(cursor)
  const publish = usePublishDraft(cursor)
  const discard = useDiscardDraft(cursor)
  const updateDraft = useUpdateDraft()
  const createDraft = useCreateDraft()
  const deletePost = usePostDelete()

  // Title commit bypasses autosave debounce — it lives on the draft top-level
  // (not in PostSpecificData), and useDraftAutosave.commit only handles fields.
  // TODO(spec §6.3): extend useDraftAutosave to merge title into its buffer.
  const commitTitle = (next: string) => {
    if (!post) return
    const err = validateTitle(next)
    if (err) {
      toast.error(err)
      return
    }
    if (next === effective?.title) return
    if (draft?.id) {
      updateDraft.mutate({ id: draft.id, data: { title: next } })
    } else {
      createDraft.mutate({
        refType: DraftRefType.Post,
        refId: cursor,
        title: next,
      })
    }
  }

  const recoveryShown = useRef<Set<string>>(new Set())
  const [recoveryVisible, setRecoveryVisible] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  useEffect(() => {
    if (!post || !draft) return
    if (recoveryShown.current.has(cursor)) return
    recoveryShown.current.add(cursor)
    setRecoveryVisible(true)
  }, [cursor, post, draft])

  // flush draft when post changes — see spec §6.8
  useEffect(() => {
    return () => {
      void autosave.flush()
    }
  }, [cursor, autosave])

  const externalUrl = useMemo(
    () =>
      post
        ? buildExternalUrl(env.webUrl, post.category?.slug, post.slug)
        : null,
    [post],
  )

  const dirtyFieldCount = useMemo(() => {
    if (!post || !effective) return 0
    return diffEffectiveVsPublished(effective, post).length
  }, [post, effective])

  useShortcut('$mod+S', () => {
    void autosave.flush()
  })
  useShortcut('$mod+Enter', () => {
    if (!post) return
    publish.mutate({ post, draft: draft ?? null, draftId: autosave.draftId })
  })
  useShortcut('$mod+\\', () => {
    if (!post) return
    const qs = autosave.draftId ? `&draftId=${autosave.draftId}` : ''
    navigate(`/posts/edit?id=${post.id}${qs}`)
  })
  useShortcut('$mod+Shift+Backspace', () => {
    setDeleteOpen(true)
  })
  useShortcut('e', () => {
    const el = document.querySelector(
      '[data-testid="body-editor"] [contenteditable="true"]',
    ) as HTMLElement | null
    el?.focus()
  })
  useShortcut('i', () => {
    const el = document.querySelector(
      '[data-testid="body-editor"] [contenteditable="true"]',
    ) as HTMLElement | null
    el?.focus()
  })

  if (isLoading) {
    return (
      <div className={paneStyle}>
        <div className={skeletonStyle}>
          <Skeleton shape="text" width="60%" height={24} />
          <Skeleton shape="text" width="40%" />
          <Skeleton shape="rect" height={120} />
        </div>
      </div>
    )
  }

  if (isError || !post || !effective) {
    return (
      <div className={paneStyle}>
        <div className={stateStyle}>
          <Empty
            title="文章已删除或无权访问"
            action={
              <Button onClick={() => navigate('/posts/view')}>回列表</Button>
            }
          />
        </div>
      </div>
    )
  }

  const initialBody = decodeInitialValue(post)

  const onPublish = () => {
    publish.mutate(
      { post, draft: draft ?? null, draftId: autosave.draftId },
      {
        onSuccess: () => {
          toast.success('已提交')
          setRecoveryVisible(false)
        },
        onError: (err: Error) => toast.error(err.message ?? '提交失败'),
      },
    )
  }

  const onDiscard = () => {
    setDiscardOpen(true)
  }

  const onConfirmDiscard = () => {
    if (!draft?.id) {
      setDiscardOpen(false)
      return
    }
    discard.mutate(
      { draftId: draft.id },
      {
        onSuccess: () => toast.success('已弃改'),
        onError: (err: Error) => toast.error(err.message ?? '弃改失败'),
      },
    )
  }

  const onDelete = () => {
    setDeleteOpen(true)
  }

  const onConfirmDelete = () => {
    deletePost.mutate(post.id, {
      onSuccess: () => {
        toast.success('已删除')
        setClearTransient()
        setDeleteOpen(false)
      },
      onError: (err: Error) => toast.error(err.message ?? '删除失败'),
    })
  }

  const onCopyId = () => {
    void navigator.clipboard.writeText(post.id)
    toast.success('已复制 ID')
  }
  const onCopyPath = () => {
    if (!externalUrl) return
    void navigator.clipboard.writeText(externalUrl)
    toast.success('已复制路径')
  }
  const onJumpToFullscreen = () => {
    const qs = autosave.draftId ? `&draftId=${autosave.draftId}` : ''
    navigate(`/posts/edit?id=${post.id}${qs}`)
  }

  return (
    <div className={paneStyle} data-testid="right-pane">
      <PostHeader
        variant="compact"
        post={post}
        draft={draft ?? null}
        saveStatus={autosave.status}
        lastSavedAt={autosave.lastSavedAt}
        dirtyFieldCount={dirtyFieldCount}
        onPublish={onPublish}
        onDiscard={onDiscard}
        onDelete={onDelete}
        onCopyId={onCopyId}
        onCopyPath={externalUrl ? onCopyPath : undefined}
        onJumpToFullscreen={onJumpToFullscreen}
        externalUrl={externalUrl}
      />
      <div className={scrollWrapStyle}>
        <Scroll>
          <div className={bodyStyle}>
          {recoveryVisible && draft ? (
            <RecoveryBanner
              lastEditedAt={draft.updatedAt ?? null}
              onUseDraft={() => setRecoveryVisible(false)}
              onUsePublished={() => {
                if (draft.id) {
                  discard.mutate(
                    { draftId: draft.id },
                    {
                      onSuccess: () => toast.success('已切回已发布'),
                      onError: (err: Error) =>
                        toast.error(err.message ?? '操作失败'),
                    },
                  )
                }
                setRecoveryVisible(false)
              }}
            />
          ) : null}
          <TitleField value={effective.title} onCommit={commitTitle} />
          <MetaStrip
            post={post}
            effective={effective}
            externalUrl={externalUrl}
          />
          <PropsList>
            <SlugField
              value={effective.slug}
              onCommit={(v) => autosave.commit({ slug: v })}
            />
            <CategoryField
              value={effective.categoryId}
              onCommit={(v) => autosave.commit({ categoryId: v })}
            />
            <TagsField
              value={effective.tags}
              onCommit={(v) => autosave.commit({ tags: v })}
            />
            <SummaryField
              value={effective.summary}
              onCommit={(v) => autosave.commit({ summary: v })}
            />
            <PinField
              pinAt={effective.pinAt}
              pinOrder={effective.pinOrder}
              onCommitPin={(v) => autosave.commit({ pin: v })}
              onCommitOrder={(v) => autosave.commit({ pinOrder: v })}
            />
            <CopyrightField
              value={effective.copyright}
              onCommit={(v) => autosave.commit({ copyright: v })}
            />
            <StatusField
              value={effective.isPublished}
              onCommit={(v) => autosave.commit({ isPublished: v })}
            />
          </PropsList>
          <div className={hairlineStyle} />
          <BodyEditor
            key={post.id}
            initialValue={initialBody}
            onChangeJSON={autosave.commitBody}
            onChangeText={autosave.commitText}
          />
        </div>
        </Scroll>
      </div>
      <DiscardConfirmModal
        open={discardOpen}
        dirtyFieldCount={dirtyFieldCount}
        onConfirm={onConfirmDiscard}
        onClose={() => setDiscardOpen(false)}
      />
      <Modal.Root
        open={deleteOpen}
        onOpenChange={(next) => {
          if (!next) {
            setDeleteOpen(false)
            setDeleteConfirmText('')
          }
        }}
      >
        <Modal.Portal>
          <Modal.Backdrop />
          <Modal.Content size="sm" data-testid="delete-modal">
            <Modal.Header>
              <Modal.Title>移至回收站？</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Modal.Description>
                此动作将移此文至回收站。键入文章标题以解锁删除：
                <strong style={{ color: 'inherit' }}>「{post.title}」</strong>
              </Modal.Description>
              <Input
                rootClassName={deleteConfirmInputStyle}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={post.title}
                data-testid="delete-confirm-input"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                intent="tertiary"
                onClick={() => {
                  setDeleteOpen(false)
                  setDeleteConfirmText('')
                }}
              >
                取消
              </Button>
              <Button
                intent="danger"
                disabled={deleteConfirmText !== post.title}
                onClick={onConfirmDelete}
                data-testid="delete-confirm"
              >
                移至回收站
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>
    </div>
  )
}

export const RightPane = () => {
  const cursor = useAtomValue(postsListCursorAtom)

  if (!cursor) {
    return (
      <div className={paneStyle}>
        <div className={stateStyle}>
          <Empty
            title="选一篇文章以预览"
            description="左侧点击或按 j/k 切换"
          />
        </div>
      </div>
    )
  }

  return (
    <ShortcutScope id="posts.detail" kind="page">
      <RightPaneInner cursor={cursor} />
    </ShortcutScope>
  )
}
