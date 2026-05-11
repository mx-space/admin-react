import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { FC, ReactNode } from 'react'

// haklex's transitive ssr graph imports raw .css from third-party packages
// (react-photo-view, etc.) which vitest's node loader can't ingest. Replace
// the editor + provider modules with thin stubs so the wrapper's wiring is
// still observable while keeping the css graph out of scope.
vi.mock('@haklex/rich-editor/style.css', () => ({}))

vi.mock('@haklex/rich-kit-shiro', () => ({
  ShiroEditor: ({
    header,
    children,
  }: {
    header?: ReactNode
    children?: ReactNode
  }) => (
    <div data-testid="shiro-editor">
      {header && <div data-testid="shiro-header">{header}</div>}
      {children}
    </div>
  ),
  ExcalidrawConfigProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
  LinkCardRenderer: (() => null) as FC,
  LinkCardSkeleton: (() => null) as FC,
  enhancedEditRendererConfig: {} as Record<string, unknown>,
  enhancedRendererConfig: {} as Record<string, unknown>,
}))

vi.mock('@haklex/rich-editor-ui', () => ({
  DialogStackProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

vi.mock('@haklex/rich-plugin-toolbar', () => ({
  ToolbarPlugin: (() => (
    <div data-testid="toolbar-plugin">toolbar</div>
  )) as FC,
}))

vi.mock('@haklex/rich-ext-nested-doc', () => ({
  NestedDocPlugin: (() => null) as FC,
  NestedDocDialogEditorProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
  nestedDocEditNodes: [],
}))

const { RichEditor } = await import('./RichEditor')

describe('RichEditor', () => {
  it('renders without crash with no props', () => {
    expect(() => render(<RichEditor />)).not.toThrow()
    expect(screen.getByTestId('shiro-editor')).toBeInTheDocument()
  })

  it('renders the toolbar plugin when showToolbar=true (default)', () => {
    render(<RichEditor />)
    expect(screen.getByTestId('toolbar-plugin')).toBeInTheDocument()
  })

  it('does not render the toolbar plugin when showToolbar=false', () => {
    render(<RichEditor showToolbar={false} />)
    expect(screen.queryByTestId('toolbar-plugin')).toBeNull()
    expect(screen.queryByTestId('shiro-header')).toBeNull()
  })

  // The wrapper is uncontrolled and Lexical needs full DOM (Selection,
  // contenteditable) which happy-dom doesn't fully implement. Once we mount
  // a real editor in jsdom we can assert onChange via $insertText commands;
  // for now we cover the wiring path through the tests above.
  it.skip('fires onChange after the user types into the editor', () => {
    const onChange = vi.fn()
    render(<RichEditor onChange={onChange} />)
  })
})
