import { useAtom } from 'jotai'
import { Menu } from 'lucide-react'
import { useEffect } from 'react'
import { Outlet } from 'react-router'

import { Drawer } from '~/components/ui'
import { AuthErrorBridge } from '~/components/shared/AuthErrorBridge'
import { SocketBridge } from '~/components/shared/SocketBridge'
import { KbarProvider } from '~/components/kbar/KbarProvider'
import { useViewport } from '~/hooks/useViewport'
import { sidebarMobileOpenAtom } from '~/atoms/sidebar'
import { useUIStore } from '~/stores'

import {
  mainStyle,
  mobileBrandStyle,
  mobileHamburgerStyle,
  mobileHeaderStyle,
  rootRecipe,
} from './AppShell.css'
import { Sidebar } from './Sidebar'

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return true
  if (target.isContentEditable) return true
  if (target.closest('.monaco-editor')) return true
  if (target.closest('[role="textbox"]')) return true
  return false
}

export const AppShell = () => {
  const { isMobile } = useViewport()
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [mobileOpen, setMobileOpen] = useAtom(sidebarMobileOpenAtom)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        if (isEditableTarget(e.target)) return
        e.preventDefault()
        setSidebarCollapsed(!useUIStore.getState().sidebarCollapsed)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSidebarCollapsed])

  if (isMobile) {
    return (
      <div className={rootRecipe({ sidebar: 'mobile' })}>
        <AuthErrorBridge />
        <SocketBridge />
        <KbarProvider />
        <div className={mainStyle}>
          <header className={mobileHeaderStyle}>
            <button
              type="button"
              className={mobileHamburgerStyle}
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <span className={mobileBrandStyle}>MX Admin</span>
          </header>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <Outlet />
          </div>
        </div>
        <Drawer.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Drawer.Portal>
            <Drawer.Backdrop />
            <Drawer.Content placement="left" size="sm">
              <Sidebar mobile />
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    )
  }

  return (
    <div className={rootRecipe({ sidebar: collapsed ? 'collapsed' : 'expanded' })}>
      <AuthErrorBridge />
      <SocketBridge />
      <KbarProvider />
      <Sidebar collapsed={collapsed} />
      <div className={mainStyle}>
        <Outlet />
      </div>
    </div>
  )
}
