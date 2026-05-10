import { useState } from 'react'
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BellIcon,
  CheckCircle2Icon,
  HeartIcon,
  InboxIcon,
  InfoIcon,
  KeyRoundIcon,
  MailIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UserIcon,
  XIcon,
  XCircleIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Ellipsis,
  Empty,
  Input,
  InputAffix,
  InputField,
  InputRoot,
  Modal,
  modal,
  Pagination,
  Popover,
  Progress,
  Radio,
  Scroll,
  Select,
  Skeleton,
  SkeletonGroup,
  Space,
  Spinner,
  Switch,
  Tabs,
  Tag,
  Textarea,
  toast,
  Tooltip,
} from '~/components/ui'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

import type { ColumnDef } from '@tanstack/react-table'

import { Form, FormField, FormSection } from '~/components/form'
import { DataTable } from '~/components/table'
import { initialTableState, type TableState } from '~/atoms/table'

import * as s from './page.css'

const buttonIntents = [
  'primary',
  'secondary',
  'tertiary',
  'inverse',
  'danger',
] as const
const buttonSizes = ['sm', 'md', 'lg'] as const
const inputSizes = ['sm', 'md', 'lg'] as const
const cardElevations = ['flat', 'raised', 'raisedStrong', 'popover'] as const
const cardPaddings = ['none', 'sm', 'md', 'lg'] as const
const modalSizes = ['sm', 'md', 'lg', 'xl', 'full'] as const
const switchSizes = ['sm', 'md', 'lg'] as const
const checkboxSizes = ['sm', 'md', 'lg'] as const

const fontItems = [
  { label: 'Sans-serif', value: 'sans' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'mono' },
  { label: 'Cursive', value: 'cursive' },
]

const Hero = () => (
  <header className={s.hero}>
    <span className={s.heroEyebrow}>mx_admin · spec 03 · ui primitives</span>
    <h1 className={s.heroTitle}>Five primitives, one voice.</h1>
    <p className={s.heroLede}>
      Button, Input, Card, Modal, Toast — the P0 surface that lights up `/login`
      and `/dashboard`. Every variant ships against the design tokens; nothing
      leaks an inline literal.
    </p>
    <div className={s.navRow}>
      <Link to="/_dev/design" className={s.navLink}>
        ← spec 02 · tokens
      </Link>
    </div>
  </header>
)

type SectionProps = {
  eyebrow: string
  title: string
  lede?: string
  delay: number
  children: React.ReactNode
}

const Section = ({ eyebrow, title, lede, delay, children }: SectionProps) => (
  <section className={s.section} style={{ animationDelay: `${delay}ms` }}>
    <div className={s.sectionHeader}>
      <span className={s.eyebrow}>{eyebrow}</span>
      <h2 className={s.sectionTitle}>{title}</h2>
      {lede ? <p className={s.sectionLede}>{lede}</p> : null}
    </div>
    {children}
  </section>
)

const ButtonSection = () => (
  <Section
    eyebrow="01 · button"
    title="Intent · size · state"
    lede="Five intents map to roles, not colors. Tertiary stays invisible until hovered; inverse is the rare white-pill CTA."
    delay={120}
  >
    <div className={s.cluster}>
      <span className={s.subEyebrow}>intent</span>
      <div className={s.row}>
        {buttonIntents.map((intent) => (
          <Button key={intent} intent={intent}>
            {intent}
          </Button>
        ))}
      </div>
    </div>

    <div className={s.cluster}>
      <span className={s.subEyebrow}>size</span>
      <div className={s.rowBaseline}>
        {buttonSizes.map((size) => (
          <Button key={size} intent="primary" size={size}>
            size · {size}
          </Button>
        ))}
      </div>
    </div>

    <div className={s.cluster}>
      <span className={s.subEyebrow}>state</span>
      <div className={s.row}>
        <Button intent="primary" loading>
          Saving
        </Button>
        <Button intent="secondary" disabled>
          Disabled
        </Button>
        <Button intent="primary" startIcon={<KeyRoundIcon size={14} />}>
          Continue with passkey
        </Button>
        <Button intent="tertiary" endIcon={<ArrowRightIcon size={14} />}>
          Read more
        </Button>
      </div>
    </div>
  </Section>
)

const InputSection = () => {
  const [value, setValue] = useState('')
  const invalid = value.length > 0 && value.length < 3
  return (
    <Section
      eyebrow="02 · input"
      title="Field · adornments · invalid"
      lede="Type three chars to pass validation. Prefix and suffix are decomposable through `InputRoot` + `InputField`."
      delay={200}
    >
      <div className={s.cluster}>
        <span className={s.subEyebrow}>size</span>
        <div className={s.rowBaseline}>
          {inputSizes.map((size) => (
            <div key={size} className={s.labelStack}>
              <span className={s.inlineLabel}>size · {size}</span>
              <Input size={size} placeholder="Hello, admin" />
            </div>
          ))}
        </div>
      </div>

      <div className={s.cluster}>
        <span className={s.subEyebrow}>adornments</span>
        <div className={s.rowBaseline}>
          <div className={s.labelStack}>
            <span className={s.inlineLabel}>prefix · search</span>
            <Input
              prefix={<SearchIcon size={14} />}
              placeholder="Search anything"
            />
          </div>
          <div className={s.labelStack}>
            <span className={s.inlineLabel}>suffix · unit</span>
            <Input
              suffix={<span className={s.codeline}>ms</span>}
              defaultValue="220"
            />
          </div>
          <div className={s.labelStack}>
            <span className={s.inlineLabel}>composed</span>
            <InputRoot>
              <InputAffix>
                <KeyRoundIcon size={14} />
              </InputAffix>
              <InputField placeholder="Token" />
              <InputAffix>
                <Button intent="tertiary" size="sm">
                  Paste
                </Button>
              </InputAffix>
            </InputRoot>
          </div>
        </div>
      </div>

      <div className={s.cluster}>
        <span className={s.subEyebrow}>invalid · disabled</span>
        <div className={s.rowBaseline}>
          <div className={s.labelStack}>
            <span className={s.inlineLabel}>min 3 chars</span>
            <Input
              value={value}
              invalid={invalid}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type to validate"
            />
          </div>
          <div className={s.labelStack}>
            <span className={s.inlineLabel}>disabled</span>
            <Input disabled placeholder="Read-only" defaultValue="locked" />
          </div>
        </div>
      </div>
    </Section>
  )
}

const CardSection = () => (
  <Section
    eyebrow="03 · card"
    title="Elevation · padding · subparts"
    lede="Four elevations map straight to the surface ladder. Card.Header / Body / Footer are spacing-only — no interaction logic."
    delay={280}
  >
    <div className={s.cluster}>
      <span className={s.subEyebrow}>elevation</span>
      <div className={s.gridSurfaceCells}>
        {cardElevations.map((elevation) => (
          <Card key={elevation} elevation={elevation}>
            <span className={s.cellLabel}>{elevation}</span>
            <p className={s.cardTitle}>Surface · {elevation}</p>
            <p className={s.cardDescription}>
              Hairlines do the work shadows used to.
            </p>
          </Card>
        ))}
      </div>
    </div>

    <div className={s.cluster}>
      <span className={s.subEyebrow}>padding</span>
      <div className={s.grid}>
        {cardPaddings.map((padding) => (
          <Card key={padding} padding={padding}>
            <span className={s.cellLabel}>padding · {padding}</span>
            {padding === 'none' ? (
              <div
                style={{
                  padding: '12px',
                  marginTop: 8,
                  background: 'rgba(94, 105, 209, 0.12)',
                }}
              >
                content fills edge-to-edge
              </div>
            ) : (
              <p className={s.cardDescription}>
                Spacing token resolves at compile time.
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>

    <div className={s.cluster}>
      <span className={s.subEyebrow}>composition</span>
      <Card elevation="raised" padding="lg">
        <Card.Header>
          <div>
            <p className={s.cardTitle}>Pinned posts</p>
            <p className={s.cardDescription}>3 drafts · last edited 4h ago</p>
          </div>
          <Button
            intent="tertiary"
            size="sm"
            endIcon={<ArrowRightIcon size={12} />}
          >
            All
          </Button>
        </Card.Header>
        <Card.Body>
          <p className={s.modalText}>
            Header / Body / Footer are styled div elements — they enforce
            vertical rhythm so consumers don&apos;t reinvent it.
          </p>
        </Card.Body>
        <Card.Footer>
          <Button intent="tertiary">Cancel</Button>
          <Button intent="primary">Save draft</Button>
        </Card.Footer>
      </Card>
    </div>
  </Section>
)

const ModalSection = () => {
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState<(typeof modalSizes)[number]>('md')
  return (
    <Section
      eyebrow="04 · modal"
      title="Sizes · composition · motion"
      lede="Animation is driven by Base UI `data-starting-style` / `data-ending-style` attributes. Focus trap, scroll lock, and Escape are wired by the library."
      delay={360}
    >
      <div className={s.cluster}>
        <span className={s.subEyebrow}>size</span>
        <div className={s.row}>
          {modalSizes.map((variant) => (
            <Button
              key={variant}
              intent="secondary"
              onClick={() => {
                setSize(variant)
                setOpen(true)
              }}
            >
              Open · {variant}
            </Button>
          ))}
        </div>
      </div>

      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Portal>
          <Modal.Backdrop />
          <Modal.Content size={size}>
            <Modal.Header>
              <div>
                <Modal.Title>Confirm migration · size {size}</Modal.Title>
                <Modal.Description>
                  Move the selected posts into the archive collection.
                </Modal.Description>
              </div>
              <Modal.Close
                render={
                  <Button intent="tertiary" size="sm" aria-label="Close">
                    <XIcon size={14} />
                  </Button>
                }
              />
            </Modal.Header>
            <Modal.Body>
              <p className={s.modalText}>
                The Modal composes a Base UI `dialog` with our recipe layer. Try
                Escape to close, Tab to walk focus, or click the backdrop to
                dismiss — every behavior is provided by the headless layer; we
                supply the styling and the motion timing.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close render={<Button intent="tertiary">Cancel</Button>} />
              <Modal.Close
                render={
                  <Button
                    intent="primary"
                    onClick={() =>
                      toast.success('Migration queued', {
                        description: 'Three posts will move at the next tick.',
                      })
                    }
                  >
                    Confirm
                  </Button>
                }
              />
            </Modal.Footer>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>
    </Section>
  )
}

const ImperativeModalSection = () => (
  <Section
    eyebrow="04b · modal · imperative"
    title="Fire and forget"
    lede="`modal.open(opts)` and `modal.confirm(opts)` queue dialogs through `<ModalHost />` — no JSX wiring at the call site. `confirm` returns a `Promise<boolean>`."
    delay={400}
  >
    <div className={s.row}>
      <Button
        intent="primary"
        onClick={() =>
          modal.open({
            title: 'Quick brief',
            description: 'A modal with body and a single dismiss button.',
            body: (
              <p className={s.modalText}>
                The host owns mounting; the call site owns content. Useful for
                command palette actions, async confirmations, and any flow where
                rendering a `Modal.Root` declaratively would be noise.
              </p>
            ),
            footer: ({ close }) => (
              <Button intent="primary" onClick={close}>
                Got it
              </Button>
            ),
          })
        }
      >
        modal.open
      </Button>

      <Button
        intent="secondary"
        onClick={async () => {
          const ok = await modal.confirm({
            title: 'Publish post?',
            description:
              'The post will go live on your blog and appear in the public feed.',
            confirmText: 'Publish',
          })
          if (ok)
            toast.success('Published', { description: 'Live on the feed.' })
        }}
      >
        modal.confirm
      </Button>

      <Button
        intent="danger"
        onClick={async () => {
          const ok = await modal.confirm({
            title: 'Delete 3 posts?',
            description:
              'This action cannot be undone. Posts will be removed from all collections.',
            confirmText: 'Delete',
            danger: true,
          })
          if (ok)
            toast.error('Deleted', { description: '3 posts moved to trash.' })
        }}
      >
        modal.confirm · danger
      </Button>

      <Button
        intent="tertiary"
        onClick={() => {
          modal.open({ title: 'A', size: 'sm', body: 'first' })
          modal.open({ title: 'B', size: 'md', body: 'second (stacked)' })
          modal.open({ title: 'C', size: 'lg', body: 'third (top)' })
        }}
      >
        stack three
      </Button>
    </div>
  </Section>
)

const TooltipSection = () => (
  <Section
    eyebrow="06 · tooltip"
    title="Hover · focus · sides"
    lede="Wrapped against `@base-ui/react/tooltip`. Default delay 300 ms is set on a `Tooltip.Provider` mounted at app root."
    delay={500}
  >
    <div className={s.cluster}>
      <span className={s.subEyebrow}>side</span>
      <div className={s.row}>
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side} content={`tooltip on ${side}`} side={side}>
            <Button intent="secondary" size="sm">
              side · {side}
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
    <div className={s.cluster}>
      <span className={s.subEyebrow}>tone · disabled</span>
      <div className={s.row}>
        <Tooltip content="default tone">
          <Button intent="secondary" size="sm">
            default
          </Button>
        </Tooltip>
        <Tooltip content="inverse tone" tone="inverse">
          <Button intent="secondary" size="sm">
            inverse
          </Button>
        </Tooltip>
        <Tooltip content="never visible" disabled>
          <Button intent="tertiary" size="sm">
            disabled
          </Button>
        </Tooltip>
      </div>
    </div>
  </Section>
)

const PopoverSection = () => (
  <Section
    eyebrow="07 · popover"
    title="Floating menus + content"
    lede="`Popover.Root` composes Trigger / Positioner / Popup. Padding and width variants live on the popup recipe."
    delay={540}
  >
    <div className={s.row}>
      <Popover.Root>
        <Popover.Trigger
          render={<Button intent="secondary">Quick menu</Button>}
        />
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup width="md" padding="sm">
              <ul className={s.popoverList}>
                <li className={s.popoverItem}>
                  <PencilIcon size={14} /> Edit
                </li>
                <li className={s.popoverItem}>
                  <BellIcon size={14} /> Notify
                </li>
                <li className={s.popoverItem}>
                  <Trash2Icon size={14} /> Delete
                </li>
              </ul>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger render={<Button intent="primary">Filter</Button>} />
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup width="lg" padding="md">
              <div className={s.cluster}>
                <span className={s.subEyebrow}>filter posts</span>
                <label className={s.fieldLabel}>
                  <Checkbox defaultChecked /> Published
                </label>
                <label className={s.fieldLabel}>
                  <Checkbox /> Draft
                </label>
                <label className={s.fieldLabel}>
                  <Checkbox /> Archived
                </label>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  </Section>
)

const SwitchSection = () => {
  const [auto, setAuto] = useState(true)
  return (
    <Section
      eyebrow="08 · switch"
      title="On · off · sizes"
      lede="`Switch` is a span-rendered toggle wired to a hidden input. Use for binary settings."
      delay={580}
    >
      <div className={s.cluster}>
        <span className={s.subEyebrow}>size</span>
        <div className={s.row}>
          {switchSizes.map((size) => (
            <label key={size} className={s.fieldLabel}>
              <Switch size={size} defaultChecked aria-label={`size ${size}`} />
              size · {size}
            </label>
          ))}
        </div>
      </div>
      <div className={s.cluster}>
        <span className={s.subEyebrow}>state</span>
        <div className={s.row}>
          <label className={s.fieldLabel}>
            <Switch
              checked={auto}
              onCheckedChange={setAuto}
              aria-label="auto"
            />
            controlled · {auto ? 'on' : 'off'}
          </label>
          <label className={s.fieldLabel}>
            <Switch disabled aria-label="off-disabled" />
            disabled · off
          </label>
          <label className={s.fieldLabel}>
            <Switch disabled defaultChecked aria-label="on-disabled" />
            disabled · on
          </label>
        </div>
      </div>
    </Section>
  )
}

const CheckboxSection = () => {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  const allChecked = a && b
  const indeterminate = (a || b) && !allChecked
  return (
    <Section
      eyebrow="09 · checkbox"
      title="Single · indeterminate · sizes"
      lede="`Checkbox` ticks via Enter or Space. Indeterminate state ships from Base UI directly — set `indeterminate` to render the dash."
      delay={620}
    >
      <div className={s.cluster}>
        <span className={s.subEyebrow}>size</span>
        <div className={s.row}>
          {checkboxSizes.map((size) => (
            <label key={size} className={s.fieldLabel}>
              <Checkbox
                size={size}
                defaultChecked
                aria-label={`size ${size}`}
              />
              size · {size}
            </label>
          ))}
        </div>
      </div>
      <div className={s.cluster}>
        <span className={s.subEyebrow}>group · indeterminate</span>
        <div className={s.row}>
          <label className={s.fieldLabel}>
            <Checkbox
              checked={allChecked}
              indeterminate={indeterminate}
              onCheckedChange={(next) => {
                setA(next)
                setB(next)
              }}
              aria-label="parent"
            />
            select all
          </label>
          <label className={s.fieldLabel}>
            <Checkbox checked={a} onCheckedChange={setA} aria-label="a" />
            posts
          </label>
          <label className={s.fieldLabel}>
            <Checkbox checked={b} onCheckedChange={setB} aria-label="b" />
            notes
          </label>
        </div>
      </div>
    </Section>
  )
}

const TabsSection = () => (
  <Section
    eyebrow="10 · tabs"
    title="Underline · pill · indicator"
    lede="`Tabs.Indicator` slides via CSS variables Base UI sets on the wrapper. `variant` is wired through context to keep List and Tabs in sync."
    delay={660}
  >
    <div className={s.cluster}>
      <span className={s.subEyebrow}>underline</span>
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="activity">Activity</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel value="overview" className={s.tabPanelBody}>
          Snapshot of posts, notes, and comments.
        </Tabs.Panel>
        <Tabs.Panel value="activity" className={s.tabPanelBody}>
          Latest events from the gateway socket.
        </Tabs.Panel>
        <Tabs.Panel value="settings" className={s.tabPanelBody}>
          Tokens calibrated to the Linear dark canvas.
        </Tabs.Panel>
      </Tabs.Root>
    </div>

    <div className={s.cluster}>
      <span className={s.subEyebrow}>pill</span>
      <Tabs.Root defaultValue="day" variant="pill">
        <Tabs.List>
          <Tabs.Tab value="day">Day</Tabs.Tab>
          <Tabs.Tab value="week">Week</Tabs.Tab>
          <Tabs.Tab value="month">Month</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
      </Tabs.Root>
    </div>
  </Section>
)

const SelectSection = () => {
  const [font, setFont] = useState<string | null>('sans')
  return (
    <Section
      eyebrow="11 · select"
      title="Trigger · popup · items"
      lede="`Select.Root` is a generic over its value. Pass `items` so `Select.Value` can render a label without rerendering each item manually."
      delay={700}
    >
      <div className={s.cluster}>
        <span className={s.subEyebrow}>size</span>
        <div className={s.rowBaseline}>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className={s.labelStack}>
              <span className={s.inlineLabel}>size · {size}</span>
              <Select.Root
                items={fontItems}
                value={font}
                onValueChange={(v) => setFont(v as string)}
              >
                <Select.Trigger size={size}>
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner>
                    <Select.Popup>
                      {fontItems.map((item) => (
                        <Select.Item key={item.value} value={item.value}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </div>
          ))}
        </div>
      </div>
      <div className={s.cluster}>
        <span className={s.subEyebrow}>state</span>
        <div className={s.rowBaseline}>
          <div className={s.labelStack}>
            <span className={s.inlineLabel}>disabled</span>
            <Select.Root items={fontItems} defaultValue="sans" disabled>
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
            </Select.Root>
          </div>
          <div className={s.labelStack}>
            <span className={s.inlineLabel}>placeholder</span>
            <Select.Root items={fontItems}>
              <Select.Trigger>
                <Select.Value>
                  {(value) =>
                    value
                      ? fontItems.find((it) => it.value === value)?.label
                      : 'Pick a font'
                  }
                </Select.Value>
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner>
                  <Select.Popup>
                    {fontItems.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>
      </div>
    </Section>
  )
}

const SpinnerSection = () => (
  <Section
    eyebrow="12 · spinner"
    title="Inline loading indicator"
    lede="Pure SVG with a CSS rotate keyframe. `aria-label` upgrades it to `role=status`; otherwise stays decorative."
    delay={740}
  >
    <div className={s.row}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <span key={size} className={s.fieldLabel}>
          <Spinner size={size} />
          size · {size}
        </span>
      ))}
      <span className={s.fieldLabel}>
        <Spinner aria-label="loading" />
        with aria-label
      </span>
    </div>
  </Section>
)

const SpaceSection = () => (
  <Section
    eyebrow="13 · space"
    title="Layout-only flex utility"
    lede="One element, one job. Maps `direction × gap × align × justify × wrap` to flex properties driven by spacing tokens."
    delay={780}
  >
    <div className={s.cluster}>
      <span className={s.subEyebrow}>row · gap</span>
      {(['xs', 'sm', 'md', 'lg'] as const).map((gap) => (
        <Space key={gap} gap={gap} align="center">
          <span className={s.inlineLabel}>{gap}</span>
          <Tag>alpha</Tag>
          <Tag tone="primary">bravo</Tag>
          <Tag tone="success">charlie</Tag>
        </Space>
      ))}
    </div>
    <div className={s.cluster}>
      <span className={s.subEyebrow}>column · stretch</span>
      <Space direction="column" gap="sm" align="stretch">
        <Tag>row 1</Tag>
        <Tag>row 2</Tag>
        <Tag>row 3</Tag>
      </Space>
    </div>
  </Section>
)

const TagSection = () => {
  const [removed, setRemoved] = useState<string[]>([])
  const items = ['draft', 'published', 'archived'] as const
  return (
    <Section
      eyebrow="14 · tag"
      title="Status pills"
      lede="`tone` × `size`. Closable tags expose a sub-button with its own focus ring; `onClose` fires on activation."
      delay={820}
    >
      <div className={s.cluster}>
        <span className={s.subEyebrow}>tone</span>
        <div className={s.row}>
          {(
            [
              'neutral',
              'primary',
              'success',
              'danger',
              'warning',
              'info',
            ] as const
          ).map((tone) => (
            <Tag key={tone} tone={tone}>
              {tone}
            </Tag>
          ))}
        </div>
      </div>
      <div className={s.cluster}>
        <span className={s.subEyebrow}>size · close</span>
        <div className={s.row}>
          <Tag size="md" tone="primary">
            md primary
          </Tag>
          {items
            .filter((it) => !removed.includes(it))
            .map((label) => (
              <Tag
                key={label}
                tone="info"
                closable
                onClose={() => setRemoved((prev) => [...prev, label])}
              >
                {label}
              </Tag>
            ))}
          {removed.length > 0 ? (
            <Button intent="tertiary" size="sm" onClick={() => setRemoved([])}>
              reset
            </Button>
          ) : null}
        </div>
      </div>
    </Section>
  )
}

const BadgeSection = () => (
  <Section
    eyebrow="15 · badge"
    title="Numeric · dot · standalone"
    lede="Anchored top-right of a child slot, or rendered standalone when no children are passed."
    delay={860}
  >
    <div className={s.cluster}>
      <span className={s.subEyebrow}>numeric</span>
      <div className={s.row}>
        <Badge count={3}>
          <Button intent="secondary" startIcon={<MailIcon size={14} />}>
            Inbox
          </Button>
        </Badge>
        <Badge count={120} max={99} tone="primary">
          <Button intent="secondary" startIcon={<BellIcon size={14} />}>
            Alerts
          </Button>
        </Badge>
        <Badge count={0} showZero={false}>
          <Button intent="secondary" startIcon={<HeartIcon size={14} />}>
            Likes
          </Button>
        </Badge>
      </div>
    </div>
    <div className={s.cluster}>
      <span className={s.subEyebrow}>dot · standalone</span>
      <div className={s.row}>
        <Badge shape="dot" tone="success">
          <Avatar initials="IN" size="md" />
        </Badge>
        <Badge shape="dot" tone="danger">
          <Avatar initials="ER" size="md" />
        </Badge>
        <Badge shape="number" count={9} tone="warning" />
        <Badge shape="dot" tone="info" />
      </div>
    </div>
  </Section>
)

const AvatarSection = () => (
  <Section
    eyebrow="16 · avatar"
    title="Image · initials · shape"
    lede="Wraps Base UI's avatar with token-driven sizing and a Lucide fallback icon. Initials become the alt text by default."
    delay={900}
  >
    <div className={s.cluster}>
      <span className={s.subEyebrow}>size</span>
      <div className={s.row}>
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Avatar key={size} size={size} initials="IN" />
        ))}
      </div>
    </div>
    <div className={s.cluster}>
      <span className={s.subEyebrow}>shape · fallback</span>
      <div className={s.row}>
        <Avatar shape="rounded" initials="MX" />
        <Avatar
          src="https://i.pravatar.cc/80?u=mx-admin"
          initials="IN"
          size="md"
        />
        <Avatar fallback={<UserIcon size={16} />} />
      </div>
    </div>
  </Section>
)

const ProgressSection = () => {
  const [value, setValue] = useState(40)
  return (
    <Section
      eyebrow="17 · progress"
      title="Determinate · indeterminate · tone"
      lede="Wraps Base UI progress with a labeled track. Pass `value={null}` for indeterminate; pass numeric values to drive the fill."
      delay={940}
    >
      <div className={s.cluster}>
        <span className={s.subEyebrow}>determinate</span>
        <div className={s.stack}>
          <Progress value={value} label="Uploading" />
          <Space gap="xs">
            <Button
              intent="secondary"
              size="sm"
              onClick={() => setValue((v) => Math.max(0, v - 10))}
            >
              -10
            </Button>
            <Button
              intent="secondary"
              size="sm"
              onClick={() => setValue((v) => Math.min(100, v + 10))}
            >
              +10
            </Button>
          </Space>
        </div>
      </div>
      <div className={s.cluster}>
        <span className={s.subEyebrow}>tone</span>
        <div className={s.stack}>
          <Progress value={70} tone="success" label="Synced" />
          <Progress value={45} tone="warning" label="Building" />
          <Progress value={88} tone="danger" label="Failing" />
        </div>
      </div>
      <div className={s.cluster}>
        <span className={s.subEyebrow}>indeterminate</span>
        <div className={s.stack}>
          <Progress value={null} aria-label="loading" />
        </div>
      </div>
    </Section>
  )
}

const RadioSection = () => {
  const [value, setValue] = useState('day')
  return (
    <Section
      eyebrow="18 · radio"
      title="Group · orientation · size"
      lede="`Radio.Group` provides shared state. `Radio.Item` wraps Root + label so the click target extends across the text."
      delay={980}
    >
      <div className={s.cluster}>
        <span className={s.subEyebrow}>vertical</span>
        <Radio.Group value={value} onValueChange={(v) => setValue(v as string)}>
          <Radio.Item value="day">
            Day · {value === 'day' ? 'on' : 'off'}
          </Radio.Item>
          <Radio.Item value="week">Week</Radio.Item>
          <Radio.Item value="month">Month</Radio.Item>
        </Radio.Group>
      </div>
      <div className={s.cluster}>
        <span className={s.subEyebrow}>horizontal · size</span>
        <Radio.Group orientation="horizontal" size="lg" defaultValue="b">
          <Radio.Item value="a">A</Radio.Item>
          <Radio.Item value="b">B</Radio.Item>
          <Radio.Item value="c">C</Radio.Item>
          <Radio.Item value="d" disabled>
            D · disabled
          </Radio.Item>
        </Radio.Group>
      </div>
    </Section>
  )
}

const SkeletonSection = () => (
  <Section
    eyebrow="19 · skeleton"
    title="Pulse + shimmer placeholders"
    lede="`shape` ∈ {text, rect, circle}. `SkeletonGroup` renders a stack of text lines with the last one truncated."
    delay={1020}
  >
    <div className={s.cluster}>
      <span className={s.subEyebrow}>shapes</span>
      <Space gap="md" align="center">
        <Skeleton shape="circle" width={40} height={40} />
        <Skeleton shape="rect" width={120} height={40} />
        <Skeleton shape="text" width={120} />
      </Space>
    </div>
    <div className={s.cluster}>
      <span className={s.subEyebrow}>group · 4 lines</span>
      <SkeletonGroup lines={4} style={{ maxWidth: 320 }} />
    </div>
  </Section>
)

const EmptySection = () => (
  <Section
    eyebrow="20 · empty"
    title="Empty-state composition"
    lede="Defaults to an inbox icon + neutral copy. Slot in your own icon, title, description, and CTA."
    delay={1060}
  >
    <Card padding="md" elevation="raised">
      <Empty
        icon={<InboxIcon size={20} />}
        title="No comments yet"
        description="When readers leave a comment it will show up here for review."
        action={
          <Button intent="primary" size="sm" startIcon={<PlusIcon size={14} />}>
            Compose draft
          </Button>
        }
      />
    </Card>
  </Section>
)

const EllipsisSection = () => (
  <Section
    eyebrow="21 · ellipsis"
    title="Truncate + auto tooltip"
    lede="ResizeObserver detects overflow and conditionally wraps the node in a Tooltip. Pass `noTooltip` to opt out."
    delay={1100}
  >
    <Space direction="column" gap="sm" align="stretch">
      <div className={s.ellipsisFrame}>
        <Ellipsis>{'A short label'}</Ellipsis>
      </div>
      <div className={s.ellipsisFrame}>
        <Ellipsis>
          {'This is a much longer label that will overflow the container'}
        </Ellipsis>
      </div>
    </Space>
  </Section>
)

const ScrollSection = () => (
  <Section
    eyebrow="22 · scroll"
    title="Custom scrollbar"
    lede="Wraps Base UI's scroll-area with token-styled scrollbars that fade out when idle. Specify `orientation` ∈ {vertical, horizontal, both}."
    delay={1140}
  >
    <div className={s.scrollFrame}>
      <Scroll>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={s.scrollItem}>
            row {i + 1} · scrollable content rendered inside the viewport
          </div>
        ))}
      </Scroll>
    </div>
  </Section>
)

const PaginationSection = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  return (
    <Section
      eyebrow="23 · pagination"
      title="Pages + size selector"
      lede="Owns no internal state — caller drives `page` and `pageSize`. Sibling pages collapse to ellipsis when the range exceeds 7."
      delay={1180}
    >
      <Pagination
        page={page}
        total={487}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />
    </Section>
  )
}

const projectSchema = z.object({
  name: z.string().min(1, '名称不能为空').max(80),
  url: z.url('请输入合法的 URL'),
  description: z.string().max(200).optional(),
  hidden: z.boolean(),
})
type ProjectFormValues = z.infer<typeof projectSchema>

const projectDefaults: ProjectFormValues = {
  name: '',
  url: '',
  description: '',
  hidden: false,
}

const FormSystemSection = () => {
  const form = useForm({
    defaultValues: projectDefaults,
    validators: { onChange: projectSchema, onSubmit: projectSchema },
    onSubmit: ({ value }) =>
      toast.success('Saved', {
        description: JSON.stringify(value, null, 2),
      }),
  })
  return (
    <Section
      eyebrow="24 · form"
      title="@tanstack/react-form + zod + primitives"
      lede="`<Form>` wires `form.handleSubmit`. `<FormField>` is a render-prop over `form.Field` that wires label, control, description, and error message."
      delay={1220}
    >
      <Card padding="md" elevation="raised">
        <Form form={form}>
          <FormSection
            title="项目"
            description="新建一个外部项目展示。表单使用我们的 form 组件 + 既有 primitives。"
          >
            <FormField<ProjectFormValues, 'name'>
              name="name"
              label="名称"
              required
              description="将展示在项目卡片标题位置。"
            >
              {({ field, invalid }) => (
                <Input {...field} invalid={invalid} placeholder="项目名称" />
              )}
            </FormField>
            <FormField<ProjectFormValues, 'url'>
              name="url"
              label="URL"
              required
            >
              {({ field, invalid }) => (
                <Input
                  {...field}
                  invalid={invalid}
                  placeholder="https://example.com"
                />
              )}
            </FormField>
            <FormField<ProjectFormValues, 'description'>
              name="description"
              label="说明"
            >
              {({ field, invalid }) => (
                <Textarea
                  {...field}
                  invalid={invalid}
                  rows={3}
                  placeholder="选填"
                />
              )}
            </FormField>
            <FormField<ProjectFormValues, 'hidden'>
              name="hidden"
              label="隐藏"
              inline
            >
              {({ field, fieldApi }) => (
                <Switch
                  checked={Boolean(field.value)}
                  onCheckedChange={(checked) => fieldApi.handleChange(checked)}
                  aria-label="hidden"
                />
              )}
            </FormField>
          </FormSection>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Space justify="end" gap="sm">
                <Button
                  intent="tertiary"
                  type="button"
                  onClick={() => form.reset()}
                >
                  重置
                </Button>
                <Button intent="primary" type="submit" loading={isSubmitting}>
                  保存
                </Button>
              </Space>
            )}
          </form.Subscribe>
        </Form>
      </Card>
    </Section>
  )
}

interface DemoPost {
  id: string
  title: string
  category: '技术' | '日志' | '设计'
  tags: string
  created: string
  status: '已发布' | '草稿'
}

const demoRows: DemoPost[] = [
  {
    id: '1',
    title: '关于 React 19 之 useTransition',
    category: '技术',
    tags: 'react · hooks',
    created: '3 days ago',
    status: '已发布',
  },
  {
    id: '2',
    title: 'vue3 → react 迁移笔记',
    category: '日志',
    tags: 'migration',
    created: '5 days ago',
    status: '已发布',
  },
  {
    id: '3',
    title: 'tanstack form 之实践',
    category: '技术',
    tags: 'form · zod',
    created: '5 days ago',
    status: '已发布',
  },
  {
    id: '4',
    title: 'CodeMirror 6 自定义节点',
    category: '技术',
    tags: 'cm6 · editor',
    created: '1 week ago',
    status: '草稿',
  },
  {
    id: '5',
    title: 'Linear dark canvas tokens',
    category: '设计',
    tags: 'design · tokens',
    created: '2 weeks ago',
    status: '已发布',
  },
  {
    id: '6',
    title: 'TanStack Query keepPreviousData 之妙',
    category: '技术',
    tags: 'query',
    created: '3 weeks ago',
    status: '已发布',
  },
  {
    id: '7',
    title: 'oxlint 规则梳理',
    category: '日志',
    tags: 'lint',
    created: '1 month ago',
    status: '已发布',
  },
]

const demoColumns: ColumnDef<DemoPost>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: '标题',
    enableSorting: true,
    meta: { sortable: true, width: 280 },
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: '分类',
    cell: ({ getValue }) => <Tag size="sm">{getValue<string>()}</Tag>,
    meta: { width: 100 },
  },
  {
    id: 'tags',
    accessorKey: 'tags',
    header: '标签',
    meta: { width: 160 },
  },
  {
    id: 'created',
    accessorKey: 'created',
    header: '创建于',
    enableSorting: true,
    meta: { sortable: true, width: 120 },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: '状态',
    cell: ({ getValue }) => {
      const v = getValue<string>()
      return (
        <span style={{ color: v === '已发布' ? '#27a644' : '#f5a524' }}>
          ● {v}
        </span>
      )
    },
    meta: { width: 100 },
  },
]

const DataTableSection = () => {
  const [state, setState] = useState<TableState>(initialTableState)
  return (
    <Section
      eyebrow="25 · datatable"
      title="DataTable"
      lede="`<DataTable>` is a slim wrapper over `useReactTable` v8. State lives in `tableStateAtomFamily`; the demo uses local `useState` for isolation. Compound parts (`DataTable.Header / Body / Pagination`) are exported for异型 layouts."
      delay={460}
    >
      <DataTable
        data={demoRows}
        totalCount={demoRows.length}
        columns={demoColumns}
        state={state}
        setState={(u) => setState(typeof u === 'function' ? u(state) : u)}
        rowKey={(r) => r.id}
        selectable
        showDensityToggle
      />
    </Section>
  )
}

const ToastSection = () => (
  <Section
    eyebrow="05 · toast"
    title="Sonner, themed"
    lede="`<ToastViewport />` is mounted once at app root. Call `toast.success / error / warning / info` from anywhere."
    delay={440}
  >
    <div className={s.row}>
      <Button
        intent="secondary"
        startIcon={<CheckCircle2Icon size={14} />}
        onClick={() =>
          toast.success('Saved', { description: 'Draft synced to the cloud.' })
        }
      >
        success
      </Button>
      <Button
        intent="secondary"
        startIcon={<XCircleIcon size={14} />}
        onClick={() =>
          toast.error('Failed to save', {
            description: 'Token expired — try signing in again.',
          })
        }
      >
        error
      </Button>
      <Button
        intent="secondary"
        startIcon={<AlertTriangleIcon size={14} />}
        onClick={() =>
          toast.warning('Unsaved changes', {
            description: 'You have edits that have not been published yet.',
          })
        }
      >
        warning
      </Button>
      <Button
        intent="secondary"
        startIcon={<InfoIcon size={14} />}
        onClick={() =>
          toast.info('Heads up', { description: 'A new release shipped.' })
        }
      >
        info
      </Button>
    </div>
  </Section>
)

export const PrimitivesPage = () => (
  <div className={s.page}>
    <div className={s.container}>
      <Hero />
      <ButtonSection />
      <InputSection />
      <CardSection />
      <ModalSection />
      <ImperativeModalSection />
      <TooltipSection />
      <PopoverSection />
      <SwitchSection />
      <CheckboxSection />
      <TabsSection />
      <SelectSection />
      <SpinnerSection />
      <SpaceSection />
      <TagSection />
      <BadgeSection />
      <AvatarSection />
      <ProgressSection />
      <RadioSection />
      <SkeletonSection />
      <EmptySection />
      <EllipsisSection />
      <ScrollSection />
      <PaginationSection />
      <FormSystemSection />
      <DataTableSection />
      <ToastSection />
    </div>
  </div>
)
