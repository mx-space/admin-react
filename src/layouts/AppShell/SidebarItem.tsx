import { Link, useLocation } from 'react-router'

import {
  itemBadgeStyle,
  itemIconStyle,
  itemLabelStyle,
  itemRecipe,
} from './Sidebar.css'
import type { NavItemLeaf } from './navItems'

const matchPath = (pathname: string, to: string) => {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export interface SidebarItemProps {
  item: NavItemLeaf
  collapsed: boolean
}

export const SidebarItem = ({ item, collapsed }: SidebarItemProps) => {
  const { to, label, icon: Icon, stub } = item
  const { pathname } = useLocation()
  const active = matchPath(pathname, to)
  return (
    <Link
      to={to}
      title={collapsed ? label : undefined}
      data-active={active ? '' : undefined}
      className={itemRecipe({
        active: active || undefined,
        stub: stub || undefined,
        collapsed: collapsed || undefined,
      })}
    >
      <Icon className={itemIconStyle} strokeWidth={1.75} />
      {!collapsed && <span className={itemLabelStyle}>{label}</span>}
      {!collapsed && stub && <span className={itemBadgeStyle}>stub</span>}
    </Link>
  )
}
