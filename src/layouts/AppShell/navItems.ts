import { FileText, LayoutDashboard } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItemLeaf = {
  kind: 'item'
  to: string
  label: string
  icon: LucideIcon
  /** 未实现路由：dim 显示，仍可点击。 */
  stub?: boolean
  /** 右侧 counter pill；空或 0 不显示，>= 100 截断为 "99+"。 */
  count?: number
  /** L4 子树：作为父项之下的嵌套行，缩进 16px + 1px 连接线。 */
  children?: NavItemLeaf[]
}

export type NavGroup = {
  kind: 'group'
  label: string
  children: NavItemLeaf[]
}

export type NavNode = NavItemLeaf | NavGroup
export type NavTree = NavNode[]

export const navItems: NavTree = [
  { kind: 'item', to: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { kind: 'item', to: '/posts/view', label: '文章', icon: FileText },
]
