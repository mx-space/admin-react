---
name: mx-admin-ui-primitives
description: Use when building any UI in mx-admin-next — composing pages, drawers, modals, forms, scroll containers, or any view-level interaction. Establishes the canonical primitive set, the css.ts + token rules, the mandatory `<Scroll>` rule for user-scrollable regions, and the `@tanstack/react-form + zod + Form/FormField` form pattern. Read before writing JSX in `src/pages`, `src/layouts`, or `src/components` outside the primitives layer.
---

# Building UI in mx-admin-next

The primitive set lives at `src/components/ui/`. Every view, layout, and feature component composes these — never `@base-ui/react/*` directly, never raw `<input>` / `<button>` / `<select>` for interactive surfaces, never `overflow:auto` for scrollable regions.

For the design contract, variant inventory, and acceptance gates, see [`docs/superpowers/specs/2026-05-06-react-migration/03-ui-primitives.md`](../../../docs/superpowers/specs/2026-05-06-react-migration/03-ui-primitives.md). For the form system, see [`08-form-system.md`](../../../docs/superpowers/specs/2026-05-06-react-migration/08-form-system.md). **This skill is the consumer manual.**

---

## Hard rules (do these or the PR fails)

1. **Import primitives from the barrel.** `import { Button, Input, Modal, Scroll, Tooltip } from '~/components/ui'`. Never `from '@base-ui/react/<part>'` in feature code — that's the wrapper layer's job.
2. **Scrollable container ⇒ `<Scroll>`.** If the user can scroll a region (modal body, dropdown popup, list pane, sidebar nav, page content, custom virtualized list), it MUST go through `<Scroll>`. **Banned**: `overflow:auto`, `overflow:scroll`, `overflowY:auto`, `overflowX:auto` in component / layout `*.css.ts`. Exception: the natural `<html>` / `<body>` page scroll.
3. **Styling via css.ts only.** Define variants with `recipe(...)` from `@vanilla-extract/recipes`; pull color / spacing / radius / typography from `themeContract` in `~/styles/theme.css`. No Tailwind, no UnoCSS, no inline-string color literals. Inline `style` is OK *only* for genuinely dynamic values (positioning, dynamic z-index).
4. **Forms always: `@tanstack/react-form` + `zod` + `<Form>` + `<FormField>`.** Even one-field forms. zod schemas plug into `validators.onChange` / `onSubmit` directly via Standard Schema — no resolver package. `<Input>` / `<Textarea>` / `<Select>` / `<Switch>` / `<Checkbox>` / `<Radio>` are the only field controls allowed inside a `<FormField>` render-prop.
5. **Class merge via `cx`.** `import { cx } from '~/utils/cx'`. No `clsx` dep.
6. **No new emoji** in JSX or strings unless the user asks for it. Use Lucide icons (`lucide-react`) for symbology.

---

## Primitive map

```
~/components/ui                   <- always import from here
├── Avatar         <Avatar />, <Avatar.Root>/<Image>/<Fallback>     size: xs/sm/md/lg/xl, shape: circle/rounded
├── Badge          <Badge count={3}>{children}</Badge> | dot         tone: primary/danger/success/warning/info/neutral
├── Button         <Button intent="primary" size="md" loading>       intent: primary/secondary/tertiary/inverse/danger
├── Card           <Card.Header>/<Body>/<Footer>                     elevation: flat/raised/raisedStrong/popover
├── Checkbox       <Checkbox indeterminate />                        size: sm/md/lg
├── Drawer         <Drawer.Root>/<Trigger>/<Portal>/<Backdrop>/<Content placement="right" size="md">
├── Ellipsis       <Ellipsis tooltip="…">…</Ellipsis>                auto-tooltips on overflow via ResizeObserver
├── Empty          <Empty title="…" description="…" action={…}>      icon defaults to <InboxIcon>
├── Input          <Input prefix={<Icon/>} suffix={<Icon/>}/>        also: <InputRoot>/<InputField>/<InputAffix>
├── Modal          Namespace API — see Modal.Body uses Scroll        size: sm/md/lg/xl/full
│   modal.open / modal.confirm                                       imperative API via <ModalHost />
├── Pagination     <Pagination page total pageSize onPageChange />    composes Select for size picker
├── Popover        <Popover.Root>/<Trigger>/<Portal>/<Positioner>/<Popup padding="sm" width="md">
├── Progress       <Progress value={42} tone="primary" label="…" />   value=null → indeterminate
├── Radio          <Radio.Group><Radio.Item value="…">…</Radio.Item></Radio.Group>   orientation: vertical/horizontal
├── Scroll         <Scroll orientation="vertical">{children}</Scroll>  ALL user scroll regions go through this
├── Select         <Select.Root items={…}><Trigger><Value/><Icon/></Trigger>...   render-fn child of <Value> for placeholder
├── Skeleton       <Skeleton shape="text"/>, <SkeletonGroup lines={4}/>
├── Space          <Space direction gap align justify wrap>           layout-only flex utility
├── Spinner        <Spinner size="sm" aria-label="loading" />         aria-label upgrades to role=status
├── Switch         <Switch checked onCheckedChange />                 size: sm/md/lg
├── Tabs           <Tabs.Root variant="underline"><List><Tab value/><Indicator/></List><Panel value/>   variant: underline/pill
├── Tag            <Tag tone="primary" closable onClose />            tones × size: sm/md
├── Textarea       <Textarea rows={3} invalid />                      Input-compatible variants
├── Toast          toast.success / error / warning / info             ToastViewport mounted at App.tsx root
└── Tooltip        <Tooltip content="…" side="top">{trigger}</Tooltip>   Provider mounted in App.tsx (delay 300/100)
```

Forms layer:

```
~/components/form                 <- import from here for form composition
├── Form            <Form form={tanstackForm}>                          onSubmit lives in useForm config, NOT on <Form>
├── FormField       <FormField<Values, 'name'> name="name" label="…" required>
├── FormFieldArray  <FormFieldArray name="…" render={(api) => …}>     mode="array" sugar (push/remove/swap/move/insert)
├── FormLabel       used internally by FormField; export'd for custom layouts
├── FormMessage     used internally; export'd for ad-hoc placement
└── FormSection     <FormSection title="…" description="…">           grouping with hairline divider
```

Working examples for every primitive: `src/pages/_dev/primitives/index.tsx` (route `/_dev/primitives`).

---

## Recipe 1 — Build a page

```tsx
import { FullPage, FullLayout } from '~/layouts'
import { Button, Card } from '~/components/ui'

export default function PostsPage() {
  return (
    <FullLayout>
      <FullLayout.Header>
        <FullLayout.Title>Posts</FullLayout.Title>
        <FullLayout.Actions>
          <Button intent="primary">New post</Button>
        </FullLayout.Actions>
      </FullLayout.Header>
      <FullLayout.Body>
        <Card padding="md" elevation="raised">…</Card>
      </FullLayout.Body>
    </FullLayout>
  )
}
```

`FullLayout.Body` already routes its content through `<Scroll>`. **Do not** put another `<Scroll>` inside it; do not add `overflow:auto` to children. Use `<TwoColLayout>` instead when the view needs a master / detail split.

---

## Recipe 2 — Form (the only form pattern)

```tsx
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

import { Form, FormField, FormSection } from '~/components/form'
import { Button, Input, Switch, Textarea } from '~/components/ui'

const schema = z.object({
  name: z.string().min(1, '名称不能为空').max(80),
  url: z.url('请输入合法的 URL'),
  description: z.string().max(200).optional(),
  hidden: z.boolean(),
})
type Values = z.infer<typeof schema>

export function ProjectForm({ onSave }: { onSave: (v: Values) => Promise<void> }) {
  const form = useForm({
    defaultValues: { name: '', url: '', description: '', hidden: false } as Values,
    validators: { onChange: schema, onSubmit: schema },
    onSubmit: async ({ value }) => {
      try {
        await onSave(value)
        form.reset(value)
      } catch (err) {
        form.setErrorMap({ onServer: (err as Error).message })
      }
    },
  })

  return (
    <Form form={form}>
      <FormSection title="项目">
        <FormField<Values, 'name'> name="name" label="名称" required>
          {({ field, invalid }) => <Input {...field} invalid={invalid} />}
        </FormField>
        <FormField<Values, 'description'> name="description" label="说明">
          {({ field, invalid }) => <Textarea {...field} invalid={invalid} rows={3} />}
        </FormField>
        <FormField<Values, 'hidden'> name="hidden" label="隐藏" inline>
          {({ field, fieldApi }) => (
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => fieldApi.handleChange(checked)}
            />
          )}
        </FormField>
      </FormSection>

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" intent="primary" loading={isSubmitting}>
            保存
          </Button>
        )}
      </form.Subscribe>
    </Form>
  )
}
```

Rules:

- **`onSubmit` lives in `useForm` config, NOT on `<Form>`.** `<Form form={form}>` only owns: form-element + handleSubmit wiring + root-error banner. The actual submit callback goes in `useForm({ onSubmit: ({ value }) => … })`.
- **Plug zod into validators.** Pass the schema to `validators.onChange` (live error feedback) and/or `validators.onSubmit` (gate submission). Zod 4's Standard Schema is consumed natively — no resolver package needed.
- **Always pass the type generic on `<FormField>`**: `<FormField<Values, 'name'>>`. It keeps `field.value` strongly typed; without it `field.value` collapses to `unknown`.
- **Spread `{...field}` for text inputs**: `<Input {...field} invalid={invalid} />`, `<Textarea {...field} invalid={invalid} />`. The `field` bag carries `name`, `value`, `onChange` (event-aware), `onBlur`, plus auto-injected `id` / `aria-invalid` / `aria-describedby`.
- **Boolean controls don't take the spread.** Use `checked={Boolean(field.value)}` + `onCheckedChange={(c) => fieldApi.handleChange(c)}` for `<Switch>` / `<Checkbox>`. For `<Radio.Group>` use `value={field.value}` + `onValueChange={(v) => fieldApi.handleChange(v)}`.
- **Mark required fields** with `required` on `FormField` *and* in zod (`z.string().min(1)`). The prop renders the asterisk; zod blocks submit.
- **Inline layout** for boolean controls: `<FormField inline>` puts label and switch on one row.
- **Submit state for buttons**: never read `form.state.isSubmitting` directly — wrap in `<form.Subscribe selector={(s) => s.isSubmitting}>{(isSubmitting) => …}</form.Subscribe>` so the button re-renders.
- **Server errors**: in the submit handler, on failure call `form.setErrorMap({ onServer: 'msg' })` for form-wide (the `<Form>` banner reads this) or `form.setFieldMeta(name, m => ({ ...m, errors: [{ message }] }))` for per-field.
- **Reset after save**: `form.reset(value)` clears `isDirty` without losing the saved values. Use this so "Save" disables until the user edits again.
- **`onChange` of selects**: `<Select.Root onValueChange={(v) => fieldApi.handleChange(v)} value={field.value}>`.

Don't pass `defaultValue=""` on `<Input>` / `<Textarea>` *and* `defaultValues` on `useForm`. Pick `useForm({ defaultValues })` for the form pattern.

---

## Recipe 3 — Scrollable region (the only scroll pattern)

When a region is user-scrollable, follow this pattern *exactly*:

```tsx
import { Scroll } from '~/components/ui'
import * as s from './styles.css'   // styles.css.ts in the same dir

// styles.css.ts
export const paneStyle = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',           // <— required so <Scroll> can fill via 100% height
})
export const paneInnerStyle = style({
  width: '100%',
  padding: themeContract.spacing.lg,
})

// Component
<div className={s.paneStyle}>
  <Scroll>
    <div className={s.paneInnerStyle}>{children}</div>
  </Scroll>
</div>
```

Why this shape:

- `<Scroll>` requires a sized parent (`flex: 1; min-height: 0` in a column flex, or fixed height).
- The parent uses `display: flex` so `<Scroll>` (which is `width:100%; height:100%`) can stretch.
- A single inner `<div>` holds the actual content + padding; padding goes inside the scroll viewport so it scrolls with the content (matches the UX of every previous `overflow: auto` container).
- For two axes use `<Scroll orientation="both">`; defaults to `vertical`. Horizontal-only is `<Scroll orientation="horizontal">`.

Existing primitives (`Modal.Body`, `Select.Popup`, `CommandPalette` results, `FullLayout.Body`, `TwoColLayout` panes, `AppShell` sidebar) already wrap their content in `<Scroll>`. Don't double-wrap. Don't add `overflow:auto` to anything inside.

If `pnpm exec oxlint` or `tsc` flags an `overflow:auto` you wrote, the answer is **always** to refactor to the pattern above — never to suppress the rule.

---

## Recipe 4 — Modal / Drawer

```tsx
import { Modal, Button } from '~/components/ui'

<Modal.Root open={open} onOpenChange={setOpen}>
  <Modal.Portal>
    <Modal.Backdrop />
    <Modal.Content size="md">
      <Modal.Header>
        <div>
          <Modal.Title>Confirm</Modal.Title>
          <Modal.Description>Move three posts to archive.</Modal.Description>
        </div>
        <Modal.Close render={<Button intent="tertiary" size="sm" aria-label="Close">×</Button>} />
      </Modal.Header>
      <Modal.Body>
        {/* No <Scroll> needed — Body provides one */}
        <p>…long body…</p>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close render={<Button intent="tertiary">Cancel</Button>} />
        <Button intent="primary" onClick={…}>Confirm</Button>
      </Modal.Footer>
    </Modal.Content>
  </Modal.Portal>
</Modal.Root>
```

For one-shot prompts, use the imperative API:

```tsx
import { modal, toast } from '~/components/ui'

const ok = await modal.confirm({
  title: 'Delete 3 posts?',
  description: 'This action cannot be undone.',
  confirmText: 'Delete',
  danger: true,
})
if (ok) toast.error('Deleted')
```

`<ModalHost />` is mounted at `App.tsx`, so `modal.open` / `modal.confirm` work from anywhere — no JSX needed at the call site.

`<Drawer>` mirrors `<Modal>` but `<Drawer.Content placement="right" size="md">`. Place `<Scroll>` inside the Content if the body is long; Content itself is a flex column.

---

## Recipe 5 — Tooltip / Popover

```tsx
<Tooltip content="hello" side="top">
  <Button intent="secondary" size="sm">hover me</Button>
</Tooltip>

<Popover.Root>
  <Popover.Trigger render={<Button>Filter</Button>} />
  <Popover.Portal>
    <Popover.Positioner>
      <Popover.Popup width="md" padding="sm">…</Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>
```

The `<Tooltip.Provider delay={300} closeDelay={100}>` is mounted in `App.tsx`, so individual tooltips inherit the delay. Don't add per-instance delays.

---

## Recipe 6 — Toast

```tsx
import { toast } from '~/components/ui'

toast.success('Saved', { description: 'Draft synced.' })
toast.error('Failed to save', { description: 'Token expired.' })
toast.warning('Unsaved changes', { description: '…' })
toast.info('Heads up', { description: '…' })
```

`<ToastViewport />` is mounted at the App root. Sonner provides aria-live; don't reimplement. Don't render text in a banner div instead — use toast.

---

## Recipe 7 — Command palette actions

```tsx
import { useKbarRegister } from '~/hooks/useKbarRegister'

useKbarRegister([
  { id: 'new-post', name: '新建文章', keywords: ['post', 'new'], perform: () => navigate('/posts/new') },
])
```

Default actions are sourced from sidebar `navItems`. Any view that wants to expose extra actions calls `useKbarRegister` with an array; cleanup happens automatically on unmount.

---

## Tokens & css.ts

```ts
import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'
import { themeContract } from '~/styles/theme.css'

export const recipe_ = recipe({
  base: {
    background: themeContract.color.surface1,
    color: themeContract.color.ink,
    borderRadius: themeContract.radius.md,
    padding: themeContract.spacing.md,
    fontFamily: themeContract.fontFamily.text,
  },
  variants: {
    intent: {
      primary: { background: themeContract.color.primary },
      …
    },
  },
})
```

Token surfaces (always pull, never hardcode):

- `themeContract.color.{canvas, surface1..4, hairline, hairlineStrong, hairlineTertiary, ink, inkMuted, inkSubtle, inkTertiary, primary, primaryHover, primaryFocus, onPrimary, semanticSuccess/Danger/Warning/Info, semanticOverlay, inverseCanvas/Surface1/Surface2/Ink}`
- `themeContract.spacing.{xxs, xs, sm, md, lg, xl, xxl, section}`
- `themeContract.radius.{xs, sm, md, lg, xl, xxl, pill, full}`
- `themeContract.zIndex.{base, dropdown, sticky, drawer, modal, popover, toast, tooltip, kbar}`
- `themeContract.fontFamily.{display, text, mono}` + `import { typography } from '~/styles/tokens/typography'`

Recharts is the only place you hardcode color literals — recharts wants raw strings. Pull from `themeContract` exports at the chart layer. See `src/pages/dashboard/index.tsx` for the pattern.

---

## Common pitfalls

| Pitfall | Fix |
|---|---|
| `overflow: auto` somewhere | Convert to the `<Scroll>` pattern in Recipe 3. |
| `<Input value={x} onChange={e => set(e.target.value)} />` for a form field | Use `<FormField>` + `useForm` (from `@tanstack/react-form`) + zod. |
| `import { useForm } from 'react-hook-form'` | Banned. Import from `@tanstack/react-form`. The whole stack moved on 2026-05-10. |
| `resolver: zodResolver(schema)` | Banned. Pass the zod schema directly via `validators.onChange` / `onSubmit`. |
| Importing from `@base-ui/react/<part>` in a page or layout | Add the wrapping primitive to `~/components/ui` first. The `<Scroll>` rule and tokens only flow if you use the wrapper. |
| Hardcoded color string like `'#5e6ad2'` | Reach for `themeContract.color.primary`. (Exception: recharts.) |
| Tailwind / UnoCSS class on a JSX node | Banned. Use a colocated `*.css.ts` recipe. |
| `<button>` in JSX | Use `<Button>`. The plain `<button>` is reserved for `<FormField>`-internal cases the wrapper doesn't cover (rare). |
| `<select>` / `<input type="checkbox">` / `<input type="radio">` | Use `<Select>` / `<Checkbox>` / `<Radio>`. |
| Wrapping `<FormField>` children in another component that hides the render prop | Keep the render prop directly inside `<FormField>` so `field` reaches the leaf control. |
| Boolean field `<FormField>{({field}) => <Switch {...field} />}` | Boolean controls don't take spread. Use `checked={Boolean(field.value)}` + `onCheckedChange={(c) => fieldApi.handleChange(c)}`. |
| Reading `form.state.isSubmitting` for a button without `<form.Subscribe>` | Bare reads don't subscribe. Wrap the button in `<form.Subscribe selector={(s) => s.isSubmitting}>`. |
| Setting `delay` on individual `<Tooltip>` | Already wired via `<Tooltip.Provider>` in `App.tsx`. |
| Adding a `clsx` dep | Use `cx` from `~/utils/cx`. |
| `<input>` inside a Modal without `<Modal.Body>` | Modal.Body provides the scroll; without it long forms overflow the dialog. |

---

## Validation before you commit

```bash
pnpm typecheck                                 # tsc --noEmit
pnpm exec oxlint <files-you-touched>           # never sweep the whole src
pnpm test                                      # vitest, ~80 cases as of 2026-05-10
```

Mockup page route `/_dev/primitives` (`src/pages/_dev/primitives/index.tsx`) is the live reference for every primitive variant; if the visual broke, that page is where you'll see it.

---

## Quick file map

```
src/components/ui/                              ← primitives barrel
src/components/form/                            ← Form / FormField / FormFieldArray
src/components/kbar/                            ← Command palette wiring + provider
src/layouts/{AppShell,FullLayout,TwoColLayout,SetupLayout}/  ← shells, all already routed through <Scroll>
src/pages/_dev/primitives/index.tsx             ← live reference for every variant
src/styles/theme.css.ts + src/styles/tokens/    ← themeContract source of truth

docs/superpowers/specs/2026-05-06-react-migration/
├── 03-ui-primitives.md     ← variant inventory + a11y matrix + Scroll rule
├── 07-layouts-patterns.md  ← layout primitives (FullLayout / TwoColLayout)
├── 08-form-system.md       ← Form / FormField / zod pattern
└── STATUS.md               ← what's shipped and what's deferred
```

When a new view lands: pick layout from `~/layouts`, compose primitives from `~/components/ui`, wire forms via `~/components/form`. If you need something not listed above, prefer extending an existing primitive over inventing a new one — and if you must add a primitive, follow `docs/.../03-ui-primitives.md` "Wrapper API contract" exactly.
