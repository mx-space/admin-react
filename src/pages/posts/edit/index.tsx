import { useEffect, useMemo, useRef, useState } from 'react'
import { useSetAtom } from 'jotai'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { Button, Empty, Input, Modal, Scroll, Skeleton } from '~/components/ui'
import { PostHeader } from '~/components/post-detail/header/PostHeader'
import { env } from '~/constants/env'
import {
  useCreateDraft,
  useDiscardDraft,
  useDraftAutosave,
  useDraftByRef,
  usePublishDraft,
  useUpdateDraft,
} from '~/hooks/queries/useDrafts'
import {
  diffEffectiveVsPublished,
  useEffectivePost,
} from '~/hooks/queries/useEffectivePost'
import { usePostDelete, usePostDetail } from '~/hooks/queries/usePosts'
import { useShortcut } from '~/hooks/useShortcut'
import { decodeInitialValue } from '~/lib/lexical-content'
import { ShortcutScope } from '~/lib/keymap'
import { postsListCursorAtom } from '~/atoms/posts'
import { DraftRefType } from '~/models/draft'
import { FullLayout } from '~/layouts/FullLayout'

import { BodyEditor } from '../view/right/body/BodyEditor'
import { MetaStrip } from '../view/right/meta/MetaStrip'
import { TitleField } from '../view/right/meta/TitleField'
import { DiscardConfirmModal } from '../view/right/modals/DiscardConfirmModal'
import { RecoveryModal } from '../view/right/modals/RecoveryModal'
import { CategoryField } from '../view/right/props/fields/CategoryField'
import { CopyrightField } from '../view/right/props/fields/CopyrightField'
import { PinField } from '../view/right/props/fields/PinField'
import { SlugField } from '../view/right/props/fields/SlugField'
import { StatusField } from '../view/right/props/fields/StatusField'
import { SummaryField } from '../view/right/props/fields/SummaryField'
import { TagsField } from '../view/right/props/fields/TagsField'
import { validateTitle } from '../view/right/props/fields/validation'
import { PropsList } from '../view/right/props/PropsList'

import {
  deleteConfirmInputStyle,
  editorColStyle,
  editorInnerStyle,
  editorScrollStyle,
  hairlineStyle,
  railInnerStyle,
  railScrollStyle,
  railSectionHeadingStyle,
  railStyle,
  rootStyle,
  shellStyle,
  stateMessageStyle,
  titleRowStyle,
} from './EditPage.css'

const buildExternalUrl = (
  webUrl: string,
  categorySlug?: string | null,
  postSlug?: string | null,
): string | null => {
  if (!webUrl || !categorySlug || !postSlug) return null
  return `${webUrl.replace(/\/$/, '')}/posts/${categorySlug}/${postSlug}`
}

const focusBodyEditor = () => {
  const el = document.querySelector(
    '[data-testid="body-editor"] [contenteditable="true"]',
  ) as HTMLElement | null
  el?.focus()
}

const EditPageInner = ({ id }: { id: string }) => {
  const navigate = useNavigate()
  const setCursor = useSetAtom(postsListCursorAtom)

  const { data: post, isLoading, isError } = usePostDetail(id)
  const { data: draft } = useDraftByRef(DraftRefType.Post, id)
  const effective = useEffectivePost(post ?? null, draft ?? null)

  const autosave = useDraftAutosave(id)
  const publish = usePublishDraft(id)
  const discard = useDiscardDraft(id)
  const updateDraft = useUpdateDraft()
  const createDraft = useCreateDraft()
  const deletePost = usePostDelete()

  // cursor sync — back-nav lands on the same post in the list
  useEffect(() => {
    setCursor(id)
  }, [id, setCursor])

  const recoveryShown = useRef<Set<string>>(new Set())
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  useEffect(() => {
    if (!post || !draft) return
    if (recoveryShown.current.has(id)) return
    recoveryShown.current.add(id)
    setRecoveryOpen(true)
  }, [id, post, draft])

  // flush draft when post changes / unmount
  useEffect(() => {
    return () => {
      void autosave.flush()
    }
  }, [id, autosave])

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

  // title bypasses autosave debounce (lives on draft top-level, not in PostSpecificData)
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
        refId: id,
        title: next,
      })
    }
  }

  useShortcut('$mod+S', () => {
    void autosave.flush()
  })
  useShortcut('$mod+Enter', () => {
    if (!post) return
    publish.mutate(
      { post, draft: draft ?? null, draftId: autosave.draftId },
      {
        onSuccess: () => toast.success('已提交'),
        onError: (err: Error) => toast.error(err.message ?? '提交失败'),
      },
    )
  })
  useShortcut('$mod+Shift+Backspace', () => {
    setDeleteOpen(true)
  })
  useShortcut('e', () => focusBodyEditor())
  useShortcut('i', () => focusBodyEditor())

  if (isLoading) {
    return (
      <FullLayout className={rootStyle}>
        <FullLayout.Body padding="none">
          <div className={editorInnerStyle} style={{ paddingTop: 48 }}>
            <Skeleton shape="text" width="60%" height={32} />
            <Skeleton shape="text" width="40%" />
            <Skeleton shape="rect" height={240} />
          </div>
        </FullLayout.Body>
      </FullLayout>
    )
  }

  if (isError || !post || !effective) {
    return (
      <FullLayout className={rootStyle}>
        <FullLayout.Body padding="none">
          <div className={stateMessageStyle}>
            <Empty
              title="文章已删除或无权访问"
              action={
                <Button onClick={() => navigate('/posts/view')}>回列表</Button>
              }
            />
          </div>
        </FullLayout.Body>
      </FullLayout>
    )
  }

  const initialBody = decodeInitialValue(post)

  const onPublish = () => {
    publish.mutate(
      { post, draft: draft ?? null, draftId: autosave.draftId },
      {
        onSuccess: () => {
          toast.success('已提交')
          setRecoveryOpen(false)
        },
        onError: (err: Error) => toast.error(err.message ?? '提交失败'),
      },
    )
  }

  const onDiscard = () => {
    if (!draft?.id && dirtyFieldCount === 0) {
      toast.info('无可弃改之物')
      return
    }
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

  const onDelete = () => setDeleteOpen(true)

  const onConfirmDelete = () => {
    deletePost.mutate(post.id, {
      onSuccess: () => {
        toast.success('已删除')
        setDeleteOpen(false)
        setDeleteConfirmText('')
        navigate('/posts/view')
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

  return (
    <FullLayout className={rootStyle}>
      <PostHeader
        variant="full"
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
        onBack={() => navigate('/posts/view')}
        externalUrl={externalUrl}
      />
      <main className={shellStyle}>
        <div className={editorColStyle}>
          <div className={editorScrollStyle}>
            <Scroll>
              <div className={editorInnerStyle}>
                <div className={titleRowStyle}>
                  <TitleField
                    value={effective.title}
                    onCommit={commitTitle}
                  />
                  <MetaStrip
                    post={post}
                    effective={effective}
                    externalUrl={externalUrl}
                  />
                </div>
                <div className={hairlineStyle} />
                <BodyEditor
                  key={post.id}
                  showToolbar
                  initialValue={initialBody}
                  onChangeJSON={autosave.commitBody}
                  onChangeText={autosave.commitText}
                />
              </div>
            </Scroll>
          </div>
        </div>
        <aside className={railStyle} aria-label="属性面板">
          <div className={railScrollStyle}>
            <Scroll>
              <div className={railInnerStyle}>
                <h2 className={railSectionHeadingStyle}>属性</h2>
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
              </div>
            </Scroll>
          </div>
        </aside>
      </main>
      <RecoveryModal
        open={recoveryOpen}
        onUseDraft={() => {
          // No-op: draft already loaded as effective.
        }}
        onUsePublished={() => {
          if (draft?.id) {
            discard.mutate(
              { draftId: draft.id },
              {
                onSuccess: () => toast.success('已切回已发布'),
                onError: (err: Error) =>
                  toast.error(err.message ?? '操作失败'),
              },
            )
          }
        }}
        onClose={() => setRecoveryOpen(false)}
      />
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
    </FullLayout>
  )
}

const EditPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id')

  if (!id) {
    return (
      <FullLayout className={rootStyle}>
        <FullLayout.Body padding="none">
          <div className={stateMessageStyle}>
            <Empty
              title="缺少 id 参数"
              action={
                <Button onClick={() => navigate('/posts/view')}>回列表</Button>
              }
            />
          </div>
        </FullLayout.Body>
      </FullLayout>
    )
  }

  return (
    <ShortcutScope id="posts.edit" kind="page">
      <EditPageInner id={id} />
    </ShortcutScope>
  )
}

export default EditPage
