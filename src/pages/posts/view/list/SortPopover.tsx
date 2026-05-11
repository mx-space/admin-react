import { ArrowDown, ArrowUp } from 'lucide-react'
import { useAtom } from 'jotai'

import { Button } from '~/components/ui'
import {
  POSTS_LIST_DISPLAY_DEFAULT,
  POSTS_LIST_SORT_DEFAULT,
  postsListDisplayAtom,
  postsListSortAtom,
  type PostsListDisplayProperty,
  type PostsListGrouping,
  type PostsListSortBy,
} from '~/atoms/posts'

import {
  checkRowStyle,
  popupFooterStyle,
  sectionDividerStyle,
  sectionLabelStyle,
  sectionStyle,
  segmentButtonRecipe,
  segmentedGroupStyle,
} from './ListSubHeader.css'

const SORT_OPTIONS: { value: PostsListSortBy; label: string }[] = [
  { value: 'modifiedAt', label: '最近修改' },
  { value: 'createdAt', label: '创建时间' },
  { value: 'title', label: '标题' },
  { value: 'readCount', label: '阅读量' },
  { value: 'likeCount', label: '点赞' },
  { value: 'pinOrder', label: '置顶顺序' },
]

const GROUP_OPTIONS: { value: PostsListGrouping; label: string }[] = [
  { value: 'none', label: '不分组' },
  { value: 'status', label: '按状态' },
  { value: 'month', label: '按月份' },
]

const DISPLAY_PROPS: { value: PostsListDisplayProperty; label: string }[] = [
  { value: 'category', label: '分类' },
  { value: 'tags', label: '标签' },
  { value: 'readCount', label: '阅读量' },
  { value: 'likeCount', label: '点赞' },
  { value: 'time', label: '时间' },
]

export const SortPopover = () => {
  const [sort, setSort] = useAtom(postsListSortAtom)
  const [display, setDisplay] = useAtom(postsListDisplayAtom)

  const toggleProp = (prop: PostsListDisplayProperty) => {
    setDisplay((prev) => {
      const has = prev.displayProps.includes(prop)
      return {
        ...prev,
        displayProps: has
          ? prev.displayProps.filter((x) => x !== prop)
          : [...prev.displayProps, prop],
      }
    })
  }

  return (
    <div data-testid="sort-popover">
      <div className={sectionStyle} role="radiogroup" aria-label="排序字段">
        <span className={sectionLabelStyle}>排序</span>
        <div className={segmentedGroupStyle}>
          {SORT_OPTIONS.map((opt) => {
            const active = sort.sortBy === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                className={
                  active ? segmentButtonRecipe.on : segmentButtonRecipe.off
                }
                data-testid={`sort-by-${opt.value}`}
                onClick={() =>
                  setSort((prev) => ({ ...prev, sortBy: opt.value }))
                }
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        <div className={segmentedGroupStyle}>
          <button
            type="button"
            className={
              sort.order === 'asc'
                ? segmentButtonRecipe.on
                : segmentButtonRecipe.off
            }
            data-testid="sort-order-asc"
            aria-label="升序"
            onClick={() => setSort((prev) => ({ ...prev, order: 'asc' }))}
          >
            <ArrowUp size={12} aria-hidden /> 升序
          </button>
          <button
            type="button"
            className={
              sort.order === 'desc'
                ? segmentButtonRecipe.on
                : segmentButtonRecipe.off
            }
            data-testid="sort-order-desc"
            aria-label="降序"
            onClick={() => setSort((prev) => ({ ...prev, order: 'desc' }))}
          >
            <ArrowDown size={12} aria-hidden /> 降序
          </button>
        </div>
      </div>

      <div className={sectionDividerStyle} aria-hidden />

      <div className={sectionStyle} role="radiogroup" aria-label="分组">
        <span className={sectionLabelStyle}>分组</span>
        <div className={segmentedGroupStyle}>
          {GROUP_OPTIONS.map((opt) => {
            const active = display.grouping === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                className={
                  active ? segmentButtonRecipe.on : segmentButtonRecipe.off
                }
                data-testid={`sort-group-${opt.value}`}
                onClick={() =>
                  setDisplay((prev) => ({ ...prev, grouping: opt.value }))
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
        <span className={sectionLabelStyle}>字段展示</span>
        {DISPLAY_PROPS.map((prop) => {
          const checked = display.displayProps.includes(prop.value)
          return (
            <label
              key={prop.value}
              className={checkRowStyle}
              data-testid={`sort-display-${prop.value}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleProp(prop.value)}
              />
              <span>{prop.label}</span>
            </label>
          )
        })}
      </div>

      <div className={popupFooterStyle}>
        <Button
          intent="tertiary"
          size="sm"
          data-testid="sort-reset"
          onClick={() => {
            setSort(POSTS_LIST_SORT_DEFAULT)
            setDisplay(POSTS_LIST_DISPLAY_DEFAULT)
          }}
        >
          重置
        </Button>
      </div>
    </div>
  )
}
