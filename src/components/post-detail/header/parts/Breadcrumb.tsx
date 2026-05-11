import {
  breadcrumbCrumbStyle,
  breadcrumbCurrentStyle,
  breadcrumbSepStyle,
  breadcrumbStyle,
} from '../PostHeader.css'

export interface BreadcrumbProps {
  title: string
}

export const Breadcrumb = ({ title }: BreadcrumbProps) => (
  <nav
    className={breadcrumbStyle}
    aria-label="breadcrumb"
    data-testid="post-header-breadcrumb"
  >
    <span className={breadcrumbCrumbStyle}>文章</span>
    <span className={breadcrumbSepStyle} aria-hidden>
      /
    </span>
    <span className={breadcrumbCurrentStyle} title={title}>
      编辑「{title}」
    </span>
  </nav>
)
