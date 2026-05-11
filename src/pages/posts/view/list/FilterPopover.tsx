import { X } from 'lucide-react'
import { useAtom } from 'jotai'
import { useState, type KeyboardEvent } from 'react'

import { Button, Input } from '~/components/ui'
import { BACKEND_CAPS } from '~/constants/backend-caps'
import { useCategoryList } from '~/hooks/queries/useCategoryList'
import {
  POSTS_LIST_FILTER_DEFAULT,
  postsListFilterAtom,
  type PostsListPin,
  type PostsListStatus,
} from '~/atoms/posts'

import {
  categoryListStyle,
  checkRowStyle,
  popupFooterStyle,
  sectionDividerStyle,
  sectionLabelStyle,
  sectionStyle,
  segmentButtonRecipe,
  segmentedGroupStyle,
  tagChipRemoveStyle,
  tagChipStyle,
  tagInputRowStyle,
} from './ListSubHeader.css'

const STATUS_OPTIONS: { value: PostsListStatus; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'published', label: '已发布' },
  { value: 'draft', label: '草稿' },
  { value: 'hidden', label: '隐藏' },
]

const PIN_OPTIONS: { value: PostsListPin; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pinned', label: '已置顶' },
  { value: 'unpinned', label: '未置顶' },
]

export const FilterPopover = () => {
  const [filter, setFilter] = useAtom(postsListFilterAtom)
  const { data: categories } = useCategoryList()
  const [tagInput, setTagInput] = useState('')

  const toggleCategory = (id: string) => {
    setFilter((prev) => {
      const has = prev.categoryIds.includes(id)
      return {
        ...prev,
        categoryIds: has
          ? prev.categoryIds.filter((x) => x !== id)
          : [...prev.categoryIds, id],
      }
    })
  }

  const addTag = (raw: string) => {
    const next = raw.trim()
    if (!next) return
    setFilter((prev) =>
      prev.tagIds.includes(next)
        ? prev
        : { ...prev, tagIds: [...prev.tagIds, next] },
    )
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setFilter((prev) => ({
      ...prev,
      tagIds: prev.tagIds.filter((x) => x !== tag),
    }))
  }

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    addTag(tagInput)
  }

  return (
    <div data-testid="filter-popover">
      <div
        className={sectionStyle}
        role="radiogroup"
        aria-label="状态"
      >
        <span className={sectionLabelStyle}>状态</span>
        <div className={segmentedGroupStyle}>
          {STATUS_OPTIONS.map((opt) => {
            const active = filter.status === opt.value
            const disabled =
              opt.value !== 'all' && !BACKEND_CAPS.postsStatus
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={disabled}
                title={
                  disabled
                    ? '后端尚未支持此筛选'
                    : undefined
                }
                className={
                  active
                    ? segmentButtonRecipe.on
                    : segmentButtonRecipe.off
                }
                data-testid={`filter-status-${opt.value}`}
                onClick={() =>
                  setFilter((prev) => ({ ...prev, status: opt.value }))
                }
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className={sectionDividerStyle} aria-hidden />

      <div className={sectionStyle}>
        <span className={sectionLabelStyle}>分类</span>
        <div className={categoryListStyle}>
          {(categories ?? []).map((c) => {
            const checked = filter.categoryIds.includes(c.id)
            return (
              <label
                key={c.id}
                className={checkRowStyle}
                data-testid={`filter-category-${c.id}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCategory(c.id)}
                />
                <span>{c.name}</span>
              </label>
            )
          })}
          {(categories?.length ?? 0) === 0 ? (
            <div className={checkRowStyle} aria-disabled>
              无分类
            </div>
          ) : null}
        </div>
      </div>

      <div className={sectionDividerStyle} aria-hidden />

      <div className={sectionStyle}>
        <span className={sectionLabelStyle}>标签</span>
        <Input
          size="sm"
          placeholder={
            BACKEND_CAPS.postsTagIds ? '输入后按 Enter 加之' : '后端尚未支持'
          }
          value={tagInput}
          disabled={!BACKEND_CAPS.postsTagIds}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          data-testid="filter-tag-input"
        />
        {filter.tagIds.length > 0 ? (
          <div className={tagInputRowStyle}>
            {filter.tagIds.map((t) => (
              <span key={t} className={tagChipStyle}>
                {t}
                <button
                  type="button"
                  className={tagChipRemoveStyle}
                  aria-label={`移除标签 ${t}`}
                  data-testid={`filter-tag-remove-${t}`}
                  onClick={() => removeTag(t)}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className={sectionDividerStyle} aria-hidden />

      <div
        className={sectionStyle}
        role="radiogroup"
        aria-label="置顶"
      >
        <span className={sectionLabelStyle}>置顶</span>
        <div className={segmentedGroupStyle}>
          {PIN_OPTIONS.map((opt) => {
            const active = filter.pin === opt.value
            const disabled = opt.value !== 'all' && !BACKEND_CAPS.postsPin
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={disabled}
                title={disabled ? '后端尚未支持此筛选' : undefined}
                className={
                  active
                    ? segmentButtonRecipe.on
                    : segmentButtonRecipe.off
                }
                data-testid={`filter-pin-${opt.value}`}
                onClick={() =>
                  setFilter((prev) => ({ ...prev, pin: opt.value }))
                }
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className={popupFooterStyle}>
        <Button
          intent="tertiary"
          size="sm"
          data-testid="filter-reset"
          onClick={() => {
            setFilter(POSTS_LIST_FILTER_DEFAULT)
            setTagInput('')
          }}
        >
          重置
        </Button>
      </div>
    </div>
  )
}
