import { Edit3, Search } from 'lucide-react'

import { Scroll, toast } from '~/components/ui'
import { useKbar } from '~/hooks/useKbar'
import { cx } from '~/utils/cx'

import {
  groupHeaderStyle,
  groupStyle,
  iconBtnStyle,
  orgAvatarStyle,
  orgChipStyle,
  orgNameStyle,
  scrollAreaStyle,
  scrollInnerStyle,
  sidebarRecipe,
  topRowStyle,
} from './Sidebar.css'
import { SidebarItem } from './SidebarItem'
import { UserChip } from './UserChip'
import { navItems, type NavGroup, type NavItemLeaf } from './navItems'

export interface SidebarProps {
  collapsed?: boolean
  mobile?: boolean
  className?: string
}

export const Sidebar = ({
  collapsed = false,
  mobile = false,
  className,
}: SidebarProps) => {
  const showLabels = !collapsed || mobile
  const { open: openKbar } = useKbar()
  return (
    <aside
      className={cx(
        sidebarRecipe({ collapsed: !mobile && collapsed, mobile: mobile || undefined }),
        className,
      )}
    >
      <div className={topRowStyle}>
        <button type="button" className={orgChipStyle}>
          <span className={orgAvatarStyle}>M</span>
          {showLabels && <span className={orgNameStyle}>MX Admin</span>}
        </button>
        {showLabels && (
          <div style={{ display: 'flex', gap: 2 }}>
            <button
              type="button"
              className={iconBtnStyle}
              aria-label="Search (⌘K)"
              onClick={openKbar}
            >
              <Search size={14} />
            </button>
            <button
              type="button"
              className={iconBtnStyle}
              aria-label="New"
              onClick={() => toast.info('quick-create 待业务接入')}
            >
              <Edit3 size={14} />
            </button>
          </div>
        )}
      </div>

      <nav className={scrollAreaStyle}>
        <Scroll>
          <div className={scrollInnerStyle}>
            {navItems.map((node, idx) =>
              node.kind === 'item' ? (
                <SidebarItem
                  key={(node as NavItemLeaf).to}
                  item={node}
                  collapsed={collapsed && !mobile}
                />
              ) : (
                <div key={`group-${idx}-${(node as NavGroup).label}`} className={groupStyle}>
                  {showLabels && (
                    <div className={groupHeaderStyle}>{(node as NavGroup).label}</div>
                  )}
                  {(node as NavGroup).children.map((child) => (
                    <SidebarItem
                      key={child.to}
                      item={child}
                      collapsed={collapsed && !mobile}
                    />
                  ))}
                </div>
              ),
            )}
          </div>
        </Scroll>
      </nav>

      <UserChip collapsed={collapsed && !mobile} />
    </aside>
  )
}
