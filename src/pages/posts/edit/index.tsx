import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { PostHeader } from '~/components/post-detail/header/PostHeader'
import { RouteFallback } from '~/components/shared/RouteFallback'
import { env } from '~/constants/env'
import { usePostDetail } from '~/hooks/queries/usePosts'
import { FullLayout } from '~/layouts/FullLayout'

import {
  bodyStyle,
  editorStyle,
  railStyle,
  rootStyle,
  stateMessageStyle,
} from './EditPage.css'

// Wave 3: wire to useDraftAutosave / publish / discard / delete / history
const noop = (label: string) => () => {
  console.warn(`[Wave 3 TODO] PostHeader.${label} not wired yet`)
  toast.info(`${label} — Wave 3 待接`)
}

const buildExternalUrl = (
  webUrl: string,
  categorySlug?: string | null,
  postSlug?: string | null,
): string | null => {
  if (!webUrl || !categorySlug || !postSlug) return null
  return `${webUrl.replace(/\/$/, '')}/posts/${categorySlug}/${postSlug}`
}

const EditPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id')

  const { data: post, isLoading, isError } = usePostDetail(id)

  if (!id) {
    return (
      <FullLayout className={rootStyle}>
        <FullLayout.Body padding="none">
          <div className={stateMessageStyle}>缺少 id 参数</div>
        </FullLayout.Body>
      </FullLayout>
    )
  }

  if (isLoading) {
    return (
      <FullLayout className={rootStyle}>
        <FullLayout.Body padding="none">
          <RouteFallback />
        </FullLayout.Body>
      </FullLayout>
    )
  }

  if (isError || !post) {
    return (
      <FullLayout className={rootStyle}>
        <FullLayout.Body padding="none">
          <div className={stateMessageStyle}>文章已删除或无权访问</div>
        </FullLayout.Body>
      </FullLayout>
    )
  }

  const externalUrl = buildExternalUrl(env.webUrl, post.category?.slug, post.slug)

  return (
    <FullLayout className={rootStyle}>
      <FullLayout.Header>
        <PostHeader
          variant="full"
          post={post}
          draft={null}
          saveStatus="idle"
          lastSavedAt={null}
          dirtyFieldCount={0}
          onPublish={noop('publish')}
          onDiscard={noop('discard')}
          onDelete={noop('delete')}
          onCopyId={() => {
            void navigator.clipboard.writeText(post.id)
            toast.success('已复制 ID')
          }}
          onCopyPath={() => {
            void navigator.clipboard.writeText(externalUrl ?? post.slug ?? '')
            toast.success('已复制路径')
          }}
          onBack={() => navigate('/posts/view')}
          onOpenHistory={noop('history')}
          externalUrl={externalUrl}
        />
      </FullLayout.Header>
      <FullLayout.Body padding="none">
        <div className={bodyStyle}>
          <aside className={railStyle}>Wave 3: PropsList here</aside>
          <section className={editorStyle}>Wave 3: BodyEditor here</section>
        </div>
      </FullLayout.Body>
    </FullLayout>
  )
}

export default EditPage
