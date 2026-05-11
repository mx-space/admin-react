import { ChevronDown, Edit3, Search } from 'lucide-react'
import { useState } from 'react'

import { Scroll, toast } from '~/components/ui'
import { useKbar } from '~/hooks/useKbar'
import { cx } from '~/utils/cx'

import {
  groupChevronStyle,
  groupHeaderLabelStyle,
  groupHeaderStyle,
  groupStyle,
  iconBtnStyle,
  iconRowStyle,
  orgAvatarStyle,
  orgChevronStyle,
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
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (label: string) =>
    setCollapsedGroups((s) => ({ ...s, [label]: !s[label] }))

  return (
    <aside
      className={cx(
        sidebarRecipe({
          collapsed: !mobile && collapsed,
          mobile: mobile || undefined,
        }),
        className,
      )}
    >
      {/* L0 · Workspace header (52px) */}
      <div className={topRowStyle}>
        <button type="button" className={orgChipStyle}>
          <span className={orgAvatarStyle}>M</span>
          {showLabels && (
            <>
              <span className={orgNameStyle}>MX Admin</span>
              <ChevronDown size={14} className={orgChevronStyle} strokeWidth={1.5} />
            </>
          )}
        </button>
        {showLabels && (
          <div className={iconRowStyle}>
            <button
              type="button"
              className={iconBtnStyle}
              aria-label="Search (⌘K)"
              onClick={openKbar}
            >
              <Search size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className={iconBtnStyle}
              aria-label="New"
              onClick={() => toast.info('quick-create 待业务接入')}
            >
              <Edit3 size={16} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      {/* L1–L4 · nav */}
      <nav className={scrollAreaStyle}>
        <Scroll>
          <div className={scrollInnerStyle}>
            {navItems.map((node, idx) => {
              if (node.kind === 'item') {
                return (
                  <SidebarItem
                    key={(node as NavItemLeaf).to}
                    item={node}
                    collapsed={collapsed && !mobile}
                  />
                )
              }
              const group = node as NavGroup
              const isCollapsed = Boolean(collapsedGroups[group.label])
              return (
                <div key={`group-${idx}-${group.label}`} className={groupStyle}>
                  {showLabels && (
                    <button
                      type="button"
                      className={groupHeaderStyle}
                      onClick={() => toggleGroup(group.label)}
                      aria-expanded={!isCollapsed}
                    >
                      <ChevronDown
                        size={12}
                        strokeWidth={1.5}
                        className={groupChevronStyle}
                        data-collapsed={isCollapsed ? 'true' : 'false'}
                      />
                      <span className={groupHeaderLabelStyle}>{group.label}</span>
                    </button>
                  )}
                  {!isCollapsed &&
                    group.children.map((child) => (
                      <SidebarItem
                        key={child.to}
                        item={child}
                        collapsed={collapsed && !mobile}
                      />
                    ))}
                </div>
              )
            })}
          </div>
        </Scroll>
      </nav>

      <UserChip collapsed={collapsed && !mobile} />
    </aside>
  )
}
