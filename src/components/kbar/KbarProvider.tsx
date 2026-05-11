import { useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { kbarOpenAtom } from '~/atoms/kbar'
import { useKbarRegister } from '~/hooks/useKbarRegister'
import { useShortcut } from '~/hooks/useShortcut'
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

  const toggle = useCallback(() => setOpen((v) => !v), [setOpen])
  useShortcut('$mod+K', toggle, {
    scope: 'global',
    passthrough: true,
    description: '命令面板',
  })

  return <CommandPalette />
}
