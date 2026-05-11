import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { DraftModel, PostModel } from '~/models'

import { PostHeader } from './PostHeader'
import { formatRelative } from './SaveIndicator'
import type { PostHeaderProps } from './types'

const fakePost: PostModel = {
  id: 'post-1',
  title: 'Hello World',
  slug: 'hello',
  text: '',
  copyright: false,
  tags: [],
  readCount: 0,
  likeCount: 0,
  categoryId: 'cat-1',
  category: { id: 'cat-1', name: 'cat', slug: 'cat', type: 0 } as never,
  images: [],
  createdAt: '',
  modifiedAt: null,
}

const fakeDraft: DraftModel = {
  id: 'draft-1',
  refType: 'post' as never,
  refId: 'post-1',
  title: 'Hello World',
  text: '',
  version: 1,
  updatedAt: '',
  createdAt: '',
  history: [],
}

const baseProps: PostHeaderProps = {
  post: fakePost,
  draft: fakeDraft,
  variant: 'compact',
  saveStatus: 'idle',
  lastSavedAt: null,
  dirtyFieldCount: 0,
  onPublish: vi.fn(),
  onDiscard: vi.fn(),
  onDelete: vi.fn(),
}

describe('PostHeader', () => {
  it('compact: renders kebab; hides breadcrumb and inline delete', () => {
    render(<PostHeader {...baseProps} variant="compact" />)
    expect(screen.getByTestId('kebab-trigger')).toBeInTheDocument()
    expect(
      screen.queryByTestId('post-header-breadcrumb'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('delete-btn-inline'),
    ).not.toBeInTheDocument()
  })

  it('full: renders breadcrumb with title; renders inline delete; hides fullscreen icon', () => {
    render(
      <PostHeader
        {...baseProps}
        variant="full"
        onJumpToFullscreen={vi.fn()}
      />,
    )
    const crumb = screen.getByTestId('post-header-breadcrumb')
    expect(crumb).toBeInTheDocument()
    expect(crumb.textContent).toContain('Hello World')
    expect(screen.getByTestId('delete-btn-inline')).toBeInTheDocument()
    expect(screen.queryByTestId('fullscreen-btn')).not.toBeInTheDocument()
  })

  it('SaveIndicator hidden when status=idle and lastSavedAt=null', () => {
    render(<PostHeader {...baseProps} saveStatus="idle" lastSavedAt={null} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('SaveIndicator visible when saving even without lastSavedAt', () => {
    render(<PostHeader {...baseProps} saveStatus="saving" lastSavedAt={null} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('DraftBadge hidden when dirtyFieldCount=0', () => {
    render(<PostHeader {...baseProps} dirtyFieldCount={0} />)
    expect(
      screen.queryByTestId('draft-badge-compact'),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('draft-badge-full')).not.toBeInTheDocument()
  })

  it('DraftBadge visible (compact) when dirtyFieldCount>0', () => {
    render(<PostHeader {...baseProps} dirtyFieldCount={3} />)
    expect(screen.getByTestId('draft-badge-compact')).toBeInTheDocument()
  })

  it('Publish primary button disabled when dirtyFieldCount=0; enabled otherwise', () => {
    const { rerender } = render(
      <PostHeader {...baseProps} dirtyFieldCount={0} />,
    )
    expect(screen.getByTestId('publish-primary')).toBeDisabled()
    rerender(<PostHeader {...baseProps} dirtyFieldCount={2} />)
    expect(screen.getByTestId('publish-primary')).not.toBeDisabled()
  })

  it('clicking publish primary fires onPublish', () => {
    const onPublish = vi.fn()
    render(
      <PostHeader
        {...baseProps}
        dirtyFieldCount={1}
        onPublish={onPublish}
      />,
    )
    fireEvent.click(screen.getByTestId('publish-primary'))
    expect(onPublish).toHaveBeenCalledTimes(1)
  })

  it('ColumnHeader.css.ts uses chrome.headerHeight (no hardcoded 44px)', () => {
    const here = dirname(fileURLToPath(import.meta.url))
    const src = readFileSync(
      join(here, '../../ui/ColumnHeader/ColumnHeader.css.ts'),
      'utf8',
    )
    expect(src).toContain("from '~/styles/tokens'")
    expect(src).toContain('chrome.headerHeight')
    expect(src).not.toMatch(/height:\s*['"]?44px['"]?/)
  })

  it('formatRelative: returns 刚才 / Ns / Nm / Nh thresholds', () => {
    const now = Date.now()
    const iso = (msAgo: number) => new Date(now - msAgo).toISOString()
    expect(formatRelative(iso(2_000))).toBe('刚才')
    expect(formatRelative(iso(20_000))).toBe('20s 前')
    expect(formatRelative(iso(5 * 60_000))).toBe('5m 前')
    expect(formatRelative(iso(2 * 3_600_000))).toBe('2h 前')
  })
})
