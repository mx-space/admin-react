import { useSetAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { kbarOpenAtom } from '~/atoms/kbar'
import { useKbarRegister } from '~/hooks/useKbarRegister'
import { navItems } from '~/layouts/AppShell/navItems'

import { CommandPalette } from './CommandPalette'
import type { KbarAction } from './types'

const useNavActions = (): KbarAction[] => {
  const navigate = useNavigate()
  return useMemo(() => {
    const out: KbarAction[] = []
    for (const node of navItems) {
      if (node.kind === 'item') {
        out.push({
          id: `nav:${node.to}`,
          name: node.label,
          subtitle: node.to,
          section: '导航',
          icon: node.icon,
          perform: () => navigate(node.to),
        })
      } else {
        for (const child of node.children) {
          out.push({
            id: `nav:${child.to}`,
            name: child.label,
            subtitle: `${node.label} · ${child.to}`,
            section: node.label,
            keywords: node.label,
            icon: child.icon,
            perform: () => navigate(child.to),
          })
        }
      }
    }
    return out
  }, [navigate])
}

export const KbarProvider = () => {
  const setOpen = useSetAtom(kbarOpenAtom)
  const navActions = useNavActions()
  useKbarRegister(navActions)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K 全局热键：编辑态亦可触发，俾随处召唤面板
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  return <CommandPalette />
}
