import { ExternalLink } from 'lucide-react'
import type { FC } from 'react'

import type { EffectivePost } from '~/hooks/queries/useEffectivePost'
import type { PostModel } from '~/models/post'

import {
  metaDotDraftStyle,
  metaDotPublishedStyle,
  metaDotStyle,
  metaItemStyle,
  metaLinkStyle,
  metaStripStyle,
} from '../RightPane.css'

export interface MetaStripProps {
  post: PostModel
  effective: EffectivePost
  externalUrl?: string | null
}

export const MetaStrip: FC<MetaStripProps> = ({
  post,
  effective,
  externalUrl,
}) => {
  const isPublished = effective.isPublished
  return (
    <div className={metaStripStyle} data-testid="meta-strip">
      <span className={metaItemStyle}>
        <span
          aria-hidden
          className={`${metaDotStyle} ${
            isPublished ? metaDotPublishedStyle : metaDotDraftStyle
          }`}
        />
        <span>{isPublished ? '已发布' : '草稿'}</span>
      </span>
      {post.category?.name ? (
        <span className={metaItemStyle}>· {post.category.name}</span>
      ) : null}
      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={metaLinkStyle}
          data-testid="meta-external-link"
        >
          <ExternalLink size={12} aria-hidden />
          站点查看
        </a>
      ) : null}
    </div>
  )
}
