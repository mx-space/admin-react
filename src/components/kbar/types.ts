import type { ComponentType, ReactNode } from 'react'

export interface KbarActionIconProps {
  size?: number
  className?: string
  'aria-hidden'?: boolean
}

export interface KbarAction {
  id: string
  name: string
  /** 子标题，显示于 name 之下，常用以示路径 */
  subtitle?: string
  /** 检索关键字（空格分隔），与 name + subtitle 一并参与匹配 */
  keywords?: string
  /** 分组标签，同 group 之 actions 同列；无则归 "Actions" */
  section?: string
  /** 行首图标。可为 lucide 图标组件或任意 ReactNode */
  icon?: ComponentType<KbarActionIconProps> | ReactNode
  /** 命中时之操作 */
  perform: () => void | Promise<void>
}
