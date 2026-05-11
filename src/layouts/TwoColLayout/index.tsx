import { Children, forwardRef, isValidElement } from 'react'
import type {
  ComponentType,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react'

import { Drawer, Scroll } from '~/components/ui'
import { useViewport } from '~/hooks/useViewport'
import { chrome } from '~/styles/tokens'
import { cx } from '~/utils/cx'

import {
  actionsStyle,
  headerStyle,
  titleStyle,
} from '../FullLayout/FullLayout.css'
import {
  bodyStyle,
  detailDrawerInnerStyle,
  detailPaneStyle,
  listHeaderSlotStyle,
  listPaneStyle,
  rootStyle,
  slotFillStyle,
} from './TwoColLayout.css'

const SLOT_KEY = '__two-col-slot'
type Slot = 'header' | 'list-header' | 'list' | 'detail'

const tagSlot = <P extends object>(Comp: ComponentType<P>, slot: Slot) => {
  ;(Comp as unknown as Record<string, string>)[SLOT_KEY] = slot
  return Comp
}

const findSlot = (children: ReactNode, slot: Slot): ReactElement | null => {
  let found: ReactElement | null = null
  Children.forEach(children, (child) => {
    if (
      !found &&
      isValidElement(child) &&
      typeof child.type === 'function' &&
      (child.type as unknown as Record<string, string>)[SLOT_KEY] === slot
    ) {
      found = child
    }
  })
  return found
}

const HeaderImpl = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) => (
  <header className={cx(headerStyle, className)} {...rest}>
    {children}
  </header>
)

const TitleImpl = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className={cx(titleStyle, className)} {...rest}>
    {children}
  </h1>
)

const ActionsImpl = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(actionsStyle, className)} {...rest}>
    {children}
  </div>
)

const ListHeaderImpl = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(listHeaderSlotStyle, className)} {...rest}>
    {children}
  </div>
)

const ListImpl = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(slotFillStyle, className)} {...rest}>
    {children}
  </div>
)

const DetailImpl = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx(slotFillStyle, className)} {...rest}>
    {children}
  </div>
)

const Header = tagSlot(HeaderImpl, 'header')
const ListHeader = tagSlot(ListHeaderImpl, 'list-header')
const List = tagSlot(ListImpl, 'list')
const Detail = tagSlot(DetailImpl, 'detail')

export interface TwoColLayoutProps extends HTMLAttributes<HTMLDivElement> {
  listWidth?: number
  selectedId?: string | null
  onSelectedIdChange?: (id: string | null) => void
}

const Root = forwardRef<HTMLDivElement, TwoColLayoutProps>(function TwoColLayout(
  {
    className,
    children,
    listWidth,
    selectedId = null,
    onSelectedIdChange,
    ...rest
  },
  ref,
) {
  const { isMobile } = useViewport()
  const header = findSlot(children, 'header')
  const listHeader = findSlot(children, 'list-header')
  const list = findSlot(children, 'list')
  const detail = findSlot(children, 'detail')

  const width = listWidth ?? Number.parseInt(chrome.twoColListDefaultWidth, 10)

  if (isMobile) {
    const detailOpen = selectedId !== null && detail !== null
    return (
      <div ref={ref} className={cx(rootStyle, className)} {...rest}>
        {header}
        <div className={bodyStyle}>
          <div className={listPaneStyle}>
            {listHeader}
            <Scroll>{list}</Scroll>
          </div>
        </div>
        <Drawer.Root
          open={detailOpen}
          onOpenChange={(open) => {
            if (!open) onSelectedIdChange?.(null)
          }}
        >
          <Drawer.Portal>
            <Drawer.Backdrop />
            <Drawer.Content placement="right" size="full">
              <div className={detailDrawerInnerStyle}>{detail}</div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    )
  }

  return (
    <div ref={ref} className={cx(rootStyle, className)} {...rest}>
      {header}
      <div className={bodyStyle}>
        <div className={listPaneStyle} style={{ width: `${width}px` }}>
          {listHeader}
          <Scroll>{list}</Scroll>
        </div>
        <div className={detailPaneStyle}>{detail}</div>
      </div>
    </div>
  )
})

type TwoColCompound = typeof Root & {
  Header: typeof Header
  Title: typeof TitleImpl
  Actions: typeof ActionsImpl
  ListHeader: typeof ListHeader
  List: typeof List
  Detail: typeof Detail
}

export const TwoColLayout = Root as TwoColCompound
TwoColLayout.Header = Header
TwoColLayout.Title = TitleImpl
TwoColLayout.Actions = ActionsImpl
TwoColLayout.ListHeader = ListHeader
TwoColLayout.List = List
TwoColLayout.Detail = Detail
