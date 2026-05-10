import { Popover as BasePopover } from '@base-ui/react/popover'
import { LogOut, Moon, Settings as SettingsIcon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router'

import { useLogout } from '~/hooks/useLogout'
import { useAuthStore, useUIStore } from '~/stores'

import {
  popoverItemStyle,
  popoverPanelStyle,
  userAvatarStyle,
  userChipStyle,
  userMetaStyle,
  userNameStyle,
  userRoleStyle,
} from './Sidebar.css'

export interface UserChipProps {
  collapsed?: boolean
}

const initials = (name: string | undefined) => {
  if (!name) return '?'
  const trimmed = name.trim()
  if (!trimmed) return '?'
  const parts = trimmed.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return trimmed.slice(0, 2).toUpperCase()
}

export const UserChip = ({ collapsed = false }: UserChipProps) => {
  const user = useAuthStore((s) => s.user)
  const themeMode = useUIStore((s) => s.themeMode)
  const setThemeMode = useUIStore((s) => s.setThemeMode)
  const navigate = useNavigate()
  const logout = useLogout()

  const displayName = user?.name ?? user?.username ?? 'guest'
  const role = user?.username ?? '—'

  const toggleTheme = () => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')

  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        className={userChipStyle}
        aria-label="User menu"
        style={{
          background: 'transparent',
          border: 0,
          width: '100%',
          cursor: 'pointer',
          color: 'inherit',
        }}
      >
        <span className={userAvatarStyle}>{initials(displayName)}</span>
        {!collapsed && (
          <span className={userMetaStyle}>
            <span className={userNameStyle}>{displayName}</span>
            <span className={userRoleStyle}>{role}</span>
          </span>
        )}
        {!collapsed && (
          <span aria-hidden style={{ color: 'var(--ink-tertiary)', flex: 'none' }}>
            ⋯
          </span>
        )}
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={6} align="end">
          <BasePopover.Popup className={popoverPanelStyle}>
            <button
              type="button"
              className={popoverItemStyle}
              onClick={toggleTheme}
            >
              {themeMode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              切换主题（{themeMode}）
            </button>
            <button
              type="button"
              className={popoverItemStyle}
              onClick={() => navigate('/setting/user')}
            >
              <SettingsIcon size={14} /> 设置
            </button>
            <button
              type="button"
              className={popoverItemStyle}
              onClick={() => {
                void logout()
              }}
            >
              <LogOut size={14} /> 登出
            </button>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  )
}
