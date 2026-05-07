import { useState } from 'react'
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  InfoIcon,
  KeyRoundIcon,
  SearchIcon,
  XIcon,
  XCircleIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import {
  Button,
  Card,
  Input,
  InputAffix,
  InputField,
  InputRoot,
  Modal,
  modal,
  toast,
} from '~/components/ui'

import * as s from './page.css'

const buttonIntents = ['primary', 'secondary', 'tertiary', 'inverse', 'danger'] as const
const buttonSizes = ['sm', 'md', 'lg'] as const
const inputSizes = ['sm', 'md', 'lg'] as const
const cardElevations = ['flat', 'raised', 'raisedStrong', 'popover'] as const
const cardPaddings = ['none', 'sm', 'md', 'lg'] as const
const modalSizes = ['sm', 'md', 'lg', 'xl', 'full'] as const

const Hero = () => (
  <header className={s.hero}>
    <span className={s.heroEyebrow}>mx_admin · spec 03 · ui primitives</span>
    <h1 className={s.heroTitle}>Five primitives, one voice.</h1>
    <p className={s.heroLede}>
      Button, Input, Card, Modal, Toast — the P0 surface that lights up `/login` and `/dashboard`.
      Every variant ships against the design tokens; nothing leaks an inline literal.
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
            <Input suffix={<span className={s.codeline}>ms</span>} defaultValue="220" />
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
          <Button intent="tertiary" size="sm" endIcon={<ArrowRightIcon size={12} />}>
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
                command palette actions, async confirmations, and any flow
                where rendering a `Modal.Root` declaratively would be noise.
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
      <ToastSection />
    </div>
  </div>
)
