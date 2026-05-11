import { Link, useLocation } from 'react-router'

import {
  counterStyle,
  itemBadgeStyle,
  itemIconStyle,
  itemLabelStyle,
  itemRecipe,
  subtreeStyle,
} from './Sidebar.css'
import type { NavItemLeaf } from './navItems'

const matchPath = (pathname: string, to: string) => {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

const formatCount = (n: number) => (n >= 100 ? '99+' : String(n))

export interface SidebarItemProps {
  item: NavItemLeaf
  collapsed: boolean
}

export const SidebarItem = ({ item, collapsed }: SidebarItemProps) => {
  const { to, label, icon: Icon, stub, count, children } = item
  const { pathname } = useLocation()
  const active = matchPath(pathname, to)
  const showCount = !collapsed && typeof count === 'number' && count > 0

  return (
    <>
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
        <Icon className={itemIconStyle} size={16} strokeWidth={1.5} />
        {!collapsed && <span className={itemLabelStyle}>{label}</span>}
        {showCount && <span className={counterStyle}>{formatCount(count)}</span>}
        {!collapsed && stub && <span className={itemBadgeStyle}>stub</span>}
      </Link>
      {!collapsed && children && children.length > 0 && (
        <div className={subtreeStyle}>
          {children.map((child) => (
            <SidebarItem key={child.to} item={child} collapsed={collapsed} />
          ))}
        </div>
      )}
    </>
  )
}
