import { LayoutDashboard } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItemLeaf = {
  kind: 'item'
  to: string
  label: string
  icon: LucideIcon
  /** When true the route is not yet implemented; render dimmed but still clickable. */
  stub?: boolean
}

export type NavGroup = {
  kind: 'group'
  label: string
  children: NavItemLeaf[]
}

export type NavNode = NavItemLeaf | NavGroup
export type NavTree = NavNode[]

// P1 ships only Dashboard. Items are added per business iteration in P3.
export const navItems: NavTree = [
  { kind: 'item', to: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
]
