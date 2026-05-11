import { Plus } from 'lucide-react'
import { useAtom, useAtomValue } from 'jotai'
import { useNavigate } from 'react-router'

import { Button } from '~/components/ui'
import { TwoColPage } from '~/layouts/pages'
import { ShortcutScope } from '~/lib/keymap'
import { postsListCursorAtom } from '~/atoms/posts'
import { usePostsList } from '~/hooks/queries/usePosts'

import { paneActionsStyle, paneCountStyle, paneTitleStyle } from './PostsView.css'
import { ListSubHeader } from './list/ListSubHeader'
import { PostsList } from './list/PostsList'
import { RightPane } from './right/RightPane'

const PostsViewPageBody = () => {
  const navigate = useNavigate()
  const { totalCount } = usePostsList()
  const [cursor, setCursor] = useAtom(postsListCursorAtom)
  void useAtomValue(postsListCursorAtom)

  return (
    <TwoColPage
      title={
        <span className={paneTitleStyle}>
          文章
          <span className={paneCountStyle}>{totalCount}</span>
        </span>
      }
      actions={
        <span className={paneActionsStyle}>
          <Button
            intent="primary"
            size="sm"
            onClick={() => navigate('/posts/edit')}
          >
            <Plus size={14} />
            新建
          </Button>
        </span>
      }
      listHeader={<ListSubHeader />}
      list={<PostsList />}
      selectedId={cursor}
      onSelectedIdChange={setCursor}
    >
      <RightPane />
    </TwoColPage>
  )
}

const PostsViewPage = () => (
  <ShortcutScope id="posts.list" kind="page">
    <PostsViewPageBody />
  </ShortcutScope>
)

export default PostsViewPage
