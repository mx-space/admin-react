import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { useAtom, useAtomValue } from 'jotai'
import { CornerDownLeft, Search } from 'lucide-react'
import {
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'

import { kbarActionsAtom, kbarOpenAtom } from '~/atoms/kbar'

import { Scroll } from '~/components/ui'
import { ShortcutScope } from '~/lib/keymap'

import {
  backdropStyle,
  emptyStyle,
  escHintStyle,
  itemBodyStyle,
  itemEnterHintStyle,
  itemIconStyle,
  itemNameStyle,
  itemStyle,
  itemSubtitleStyle,
  listInnerStyle,
  listStyle,
  popupStyle,
  searchIconStyle,
  searchInputStyle,
  searchRowStyle,
  sectionLabelStyle,
} from './CommandPalette.css'
import type { KbarAction } from './types'

type Row =
  | { kind: 'header'; key: string; label: string }
  | { kind: 'item'; key: string; action: KbarAction }

const matches = (a: KbarAction, q: string): boolean => {
  if (!q) return true
  const hay = `${a.name} ${a.subtitle ?? ''} ${a.keywords ?? ''}`.toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token))
}

const renderActionIcon = (action: KbarAction) => {
  const icon = action.icon
  if (!icon) return null
  if (isValidElement(icon)) return icon
  if (typeof icon === 'function') {
    const Component = icon
    return <Component size={16} aria-hidden />
  }
  return icon
}

const buildRows = (actions: KbarAction[]): Row[] => {
  const groups = new Map<string, KbarAction[]>()
  for (const a of actions) {
    const sec = a.section ?? '操作'
    const list = groups.get(sec) ?? []
    list.push(a)
    groups.set(sec, list)
  }
  const rows: Row[] = []
  for (const [section, list] of groups) {
    rows.push({ kind: 'header', key: `__h:${section}`, label: section })
    for (const a of list) {
      rows.push({ kind: 'item', key: a.id, action: a })
    }
  }
  return rows
}

export const CommandPalette = () => {
  const [open, setOpen] = useAtom(kbarOpenAtom)
  const actionsMap = useAtomValue(kbarActionsAtom)

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const allActions = useMemo(
    () => Object.values(actionsMap),
    [actionsMap],
  )
  const filtered = useMemo(
    () => allActions.filter((a) => matches(a, query.trim())),
    [allActions, query],
  )
  const rows = useMemo(() => buildRows(filtered), [filtered])
  const itemRows = useMemo(
    () => rows.filter((r): r is Extract<Row, { kind: 'item' }> => r.kind === 'item'),
    [rows],
  )

  // 开窗时清查询、聚焦输入；关时清查询
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      // 微延等 portal 装载
      const t = setTimeout(() => inputRef.current?.focus(), 10)
      return () => clearTimeout(t)
    }
  }, [open])

  // 查询变更则重置激活项
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // 滚动到激活项
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector(
      `[data-kbar-index="${activeIndex}"]`,
    ) as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const execute = useCallback(
    async (action: KbarAction) => {
      try {
        await action.perform()
      } finally {
        setOpen(false)
      }
    },
    [setOpen],
  )

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (itemRows.length === 0 ? 0 : (i + 1) % itemRows.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) =>
        itemRows.length === 0 ? 0 : (i - 1 + itemRows.length) % itemRows.length,
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = itemRows[activeIndex]
      if (target) void execute(target.action)
    }
  }

  return (
    <BaseDialog.Root open={open} onOpenChange={setOpen}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={backdropStyle} />
        <BaseDialog.Popup className={popupStyle} onKeyDown={onKeyDown}>
          <ShortcutScope id="kbar" kind="overlay">
          <BaseDialog.Title style={{ display: 'none' }}>
            命令面板
          </BaseDialog.Title>
          <div className={searchRowStyle}>
            <Search className={searchIconStyle} size={16} aria-hidden />
            <input
              ref={inputRef}
              className={searchInputStyle}
              placeholder="搜索命令、页面…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className={escHintStyle} aria-hidden>
              ESC
            </kbd>
          </div>

          {itemRows.length === 0 ? (
            <div className={emptyStyle} role="status">
              <Search size={28} strokeWidth={1.5} aria-hidden />
              <span>未匹配到结果</span>
            </div>
          ) : (
            <div className={listStyle}>
              <Scroll>
                <div className={listInnerStyle} ref={listRef} role="listbox">
                  {(() => {
                let idx = -1
                return rows.map((row) => {
                  if (row.kind === 'header') {
                    return (
                      <div key={row.key} className={sectionLabelStyle}>
                        {row.label}
                      </div>
                    )
                  }
                  idx += 1
                  const myIndex = idx
                  const isActive = myIndex === activeIndex
                  return (
                    <button
                      type="button"
                      key={row.key}
                      data-kbar-index={myIndex}
                      data-active={isActive}
                      role="option"
                      aria-selected={isActive}
                      className={itemStyle}
                      onMouseEnter={() => setActiveIndex(myIndex)}
                      onClick={() => void execute(row.action)}
                    >
                      <span className={itemIconStyle}>
                        {renderActionIcon(row.action)}
                      </span>
                      <span className={itemBodyStyle}>
                        <span className={itemNameStyle}>{row.action.name}</span>
                        {row.action.subtitle && (
                          <span className={itemSubtitleStyle}>
                            {row.action.subtitle}
                          </span>
                        )}
                      </span>
                      {isActive && (
                        <span className={itemEnterHintStyle} aria-hidden>
                          <CornerDownLeft size={14} />
                        </span>
                      )}
                    </button>
                  )
                  })
                })()}
                </div>
              </Scroll>
            </div>
          )}
          </ShortcutScope>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
