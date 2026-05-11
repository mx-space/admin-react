# DESIGN

Visual design language for **mx-admin-next**. Human-readable source of truth.
Implementation token mappings live in `src/styles/tokens/*.ts` and the spec
[`docs/superpowers/specs/2026-05-06-react-migration/02-design-tokens.md`](./docs/superpowers/specs/2026-05-06-react-migration/02-design-tokens.md).
When the implementation diverges from this document — calibration drift, admin-only
extensions, breakpoint adjustments — the divergence is recorded in the spec, not
edited back into here. **DESIGN.md stays canonical.**

---

## 0 · Philosophy

A working surface, not a marketing surface. The admin spends hours here; the design
must reward stamina, not first impressions.

- **Linear dark-canvas as visual reference.** Compact, ink-on-canvas, surface ladder for
  depth, no decorative shadows, lavender accent reserved for the user's own action.
- **Information density over generosity.** Lists are scannable, not roomy. Meta
  hierarchy is carried by **weight + color**, not size.
- **Subtraction first.** A gradient, a shadow, a third font size — each must justify
  itself against the cost of one more thing for the eye to track.
- **Keyboard-first.** Every list view, every modal, every form is reachable without
  touching a pointer. Visible affordances follow real shortcuts; they do not invent
  decorative chord hints.
- **Behavior is the brand.** Smooth transitions and obvious focus rings carry more
  identity than ornament.

---

## 1 · Foundation · Dark canvas palette

The single theme is dark. (A light theme is reserved in the contract but
intentionally deferred — see spec 02 §"Open questions".)

### Surface ladder

Five steps, evenly spaced in lightness, going from the deepest canvas up to the
floating chip. Depth is **always** carried by surface, never by shadow.

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#08090b` | Page background. Nothing sits below it. |
| `surface1` | `#101113` | Default card / panel / row hover. |
| `surface2` | `#171a1d` | Elevated row, faint hover. |
| `surface3` | `#1f2226` | Popover / dropdown / strong hover. |
| `surface4` | `#272b30` | Floating chip, hovered popover row. |

### Hairlines

| Token | Hex | Use |
|---|---|---|
| `hairlineTertiary` | `#181b1f` | In-card sub-section divider — barely visible. |
| `hairline` | `#23262b` | Standard divider. |
| `hairlineStrong` | `#2f3239` | Section header underline; emphasised separator. |

### Ink (text on dark canvas)

Four levels carry hierarchy without changing weight or size.

| Token | Hex | Use |
|---|---|---|
| `ink` | `#f7f8f8` | Primary text — titles, the row's anchor. |
| `inkMuted` | `#d0d6e0` | Secondary anchor — chip body, category cell. |
| `inkSubtle` | `#8a8f98` | Meta — status, ids, counts, time. |
| `inkTertiary` | `#62666d` | Recede — relative time, disabled icon, placeholder. |

> Linear's measured equivalents (LCH): primary `lch(100 0 272)`, label
> `lch(90 1 272)`, tertiary `lch(61 1 272)`. Our values map cleanly to those bands.

### Brand accent · lavender

| Token | Hex | Use |
|---|---|---|
| `primary` | `#5e6ad2` | The user's action — primary button, selection border, pin icon. |
| `primaryHover` | `#828fff` | Hover state of primary action. |
| `primaryFocus` | `#5e69d1` | Active/pressed state of primary action. |

The accent is **scarce**. A page should never have two primary buttons; a list row
should never tint solid lavender unless selected. Selection uses
`rgba(94,106,210,0.10)` background + 2 px lavender left-border.

### Semantic colors

| Token | Hex | Use |
|---|---|---|
| `semanticSuccess` | `#27a644` | Published status, success toast. |
| `semanticDanger` | `#e5484d` | Destructive action, error toast, alarm. |
| `semanticWarning` | `#f5a524` | Warning toast, near-limit. |
| `semanticInfo` | `#3e63dd` | Informational toast, neutral notice. |

These are admin-only — Linear marketing has no alarm states. Use sparingly, never
decoratively. A neutral tag uses ink, not info-blue.

### Status dots — published / draft

`semanticSuccess` (7 px, published) versus `inkTertiary` (7 px, draft). Diameter
fixed at 7; never tint a row's whole background to encode status.

---

## 2 · Typography

### Family

```
'Inter Variable', 'Inter', 'SF Pro Display' / 'SF Pro Text', system-ui, …
```

`Inter Variable` first so the **450** weight axis renders true. Static fonts
fall back to the nearest 100-step (450 → 400). JetBrains Mono is used only inside
`<code>` / `<pre>` / `<kbd>` / inline shortcut hints.

### Atomic axes

Pick **one size + one weight** when authoring a new component. Do not introduce
literal pixel values; use the token.

```ts
fontSize   = { xs: 11, sm: 12, md: 13, base: 14, lg: 16 }
fontWeight = { regular: 450, medium: 500, semibold: 600 }
iconSize   = { sm: 12, md: 14, lg: 16 }
```

### Composed presets

```ts
typography.listTitle  = { 13, 500, normal, 0 }   // row's only highlighted text
typography.listMeta   = { 13, 450, normal, 0 }   // status / id / time / counts
typography.listLabel  = { 12, 450, normal, 0 }   // chip / pill body
typography.body       = { 16, 400, 1.50, -0.05 }  // long-form prose
typography.bodySm     = { 14, 400, 1.50, 0 }      // form input, button label
typography.caption    = { 12, 400, 1.40, 0 }      // form helper, badge text
typography.eyebrow    = { 13, 500, 1.30, 0.4 }    // section labels
typography.cardTitle  = { 22, 500, 1.25, -0.4 }   // card heading
typography.headline   = { 28, 600, 1.20, -0.6 }   // page heading
typography.displayMd  = { 40, 600, 1.15, -1.0 }   // marketing-style empty state
typography.displayLg  = { 56, 600, 1.10, -1.8 }
typography.displayXl  = { 80, 600, 1.05, -3.0 }
```

`display*` presets exist for marketing-style empty states / setup wizard hero /
auth screen — never for in-app surfaces.

### Hierarchy rule (CRITICAL)

Inside a single information unit (a row, a card, a form section), hierarchy is
carried by **weight + color**, NOT size:

- Title: `medium` weight, `ink` color
- Secondary anchor: same size + `regular` weight + `inkMuted`
- Meta: same size + `regular` weight + `inkSubtle`
- Recede: same size + `regular` weight + `inkTertiary`

If you reach for a third font size to express hierarchy, **change the color
instead**.

### List density (Linear inbox aligned)

Every read-list view (posts / notes / pages / says / recently / comments) follows
one density:

- Row `min-height: 57px`
- Padding `10px 16px`
- Title line ↔ meta line gap `4px`
- Title = `typography.listTitle`
- Meta items = `typography.listMeta` (color differentiates them)
- Chip body = `typography.listLabel`
- Inline meta icons = `iconSize.sm` (12)
- Row-start semantic icon = `iconSize.lg` (16)
- Status / right-of-row glyph = `iconSize.md` (14)

A list view does **not** invent its own row size. If a view needs more space for
a thumbnail or richer meta, it must propose a new named density into spec 02 v3,
not freelance a different number.

---

## 3 · Spacing

Base unit **4 px**. Use the named scale; do not write raw `gap: 6`.

```ts
spacing = {
  xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48, section: 96
}
```

- Inside a row: `gap: 12` (xs) horizontal between pin / body / status.
- Between cards: `md` (16).
- Between page sections: `xl` (32) on desktop, `lg` (24) on mobile.
- Page outer margin: handled by `chrome.contentPaddingDesktop` (24) /
  `chrome.contentPaddingMobile` (16).

---

## 4 · Radius

```ts
radius = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, xxl: 24, pill: 9999 }
```

- Inputs, buttons, small chips → `sm` (6).
- Cards, popovers, modals → `md` (8) or `lg` (12).
- Avatars and tags → `pill`.
- Outer page frame is square — corners belong to interactive surfaces, not the
  document edge.

---

## 5 · Elevation

Depth is the **surface ladder**, not box-shadow. Five named recipes; no other
shadows allowed in component CSS.

| Recipe | Visual |
|---|---|
| `flat` | `canvas` background, no border, no shadow. |
| `raised` | `surface1` + `1px hairline`. The default card. |
| `raisedStrong` | `surface2` + `1px hairlineStrong`. Hovered card / featured panel. |
| `popover` | `surface3` + `1px hairline`. Dropdowns and popovers. |
| (focus ring) | 2 px `primaryFocus` outline at 2 px offset. |

The single concession is the **floating bulk action bar**, which uses a real
shadow (`0 12px 32px rgba(0,0,0,0.5)`) because it floats over arbitrary content
and surface lift alone cannot detach it. No other component receives a shadow.

---

## 6 · Motion

| Use | Duration | Easing |
|---|---|---|
| Hover / press / focus | 120 ms | ease |
| Popover / drawer open | 180 ms | ease-out |
| Modal open / close | 200 ms | ease-out / ease-in |
| Floating-bar slide | 220 ms | ease-out |
| Skeleton shimmer | 1400 ms | linear, looped |

All motion respects `prefers-reduced-motion`. The implementation lives in
`motion` (the `motion` library) for declarative variants and CSS transitions for
trivial state changes.

> **No spring physics on chrome.** Spring transitions are visual noise on
> repeated interactions. Reserve for one-shot moments (toast slide-in).

---

## 7 · Iconography

Lucide React, three sizes. **No emoji** in functional UI — emoji ignore
`font-size` and break the typographic grid; a row-meta `📖 1.2k` renders larger
than the title next to it. Use `<BookOpen size={iconSize.sm}/> 1.2k`.

| Use | Token | Pixel |
|---|---|---|
| Inline with body text, inside a chip | `iconSize.sm` | 12 |
| Right-of-row status / action glyph | `iconSize.md` | 14 |
| Row-start primary semantic icon | `iconSize.lg` | 16 |
| Card heading icon | `iconSize.lg` (or 20 in spec-defined exceptions) | 16 |

Stroke width default `1.75` (Lucide default 2 is slightly heavy on dark surfaces).

---

## 8 · Layout patterns

### `FullPage`

Page header (44 px) + body. Header carries `Title` + `Actions` slots. Body owns
its own scroll via `<Scroll>`.

```
┌── header (44 px, hairline-bottom) ──────────────────┐
│  Title                                  [Actions]   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  body (Scroll-wrapped, padding md or lg)             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### `TwoColPage`

List pane (≥ 360 px, default 420) + detail pane (flex 1, ≥ 420). Mobile
collapses to drawer behaviour by the layout primitive itself, **except** for the
posts-list redesign which opts out and renders `<MobileCardList>`.

```
┌── header ────────────────────────────────────────────┐
├── list ───────────────┬── detail ────────────────────┤
│                       │                              │
│  rows (Scroll)        │  preview / quickedit (Scroll)│
│                       │                              │
│  pagination           │  footer                      │
└───────────────────────┴──────────────────────────────┘
```

### `SetupLayout`

Auth / setup full-bleed canvas with optional right-side illustration. No sidebar.

### Chrome dimensions

```ts
chrome = {
  headerHeight: 44,
  sidebarWidthExpanded: 232,
  sidebarWidthCollapsed: 56,
  sidebarMobileWidth: 280,
  twoColListDefaultWidth: 360,
  contentPaddingDesktop: 24,
  contentPaddingMobile: 16,
  setupCardMaxWidth: 480,
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,
}
```

---

## 9 · Component principles

- **Compose primitives, do not customise them.** A `<Button intent="primary">`
  is the right answer; a wrapper `MyPrimaryButton` is a smell.
- **One canonical interaction per affordance.** A pin icon clicks to toggle pin
  — it does not also cycle through pin orders on shift-click.
- **Selection state is page-scoped.** Bulk operations live in a floating action
  bar; cross-page selection is out of scope until proven needed.
- **Optimistic where reversible, confirmed where destructive.** Pin toggles
  optimistically, deletes confirm. Bulk operations never optimistic-update —
  they show inline spinners and aggregate toasts.
- **States enumerated.** Every list view documents `loading-initial /
  loading-subsequent / error / empty(none) / empty(filtered) / empty(searched)`
  and renders all of them. Skeletons match the row geometry of the loaded state
  so layout doesn't jump.

---

## 10 · Anti-patterns

| Don't | Do |
|---|---|
| `text-[13px]` literal sizes | `typography.listMeta` token |
| Three font sizes inside one row | One size + color tiers |
| Emoji as functional UI glyph (`📖 1.2k`) | Lucide icon + count |
| Shadow to express depth | Surface ladder + hairline |
| Solid lavender row to mean "selected" | Translucent lavender + 2 px left border |
| Spring physics on hover / focus | Linear / ease at 120-200 ms |
| Per-view bespoke row height | Compact-list density (57 px) |
| Inline `style={{ fontSize: 13 }}` | Token via css.ts |
| Tooltip-only icon button without `aria-label` | Always pair `aria-label` with icon-only buttons |
| `?` help panel in chord-driven views | Discoverable chord hints inline (e.g. `[⌘↵]`) |

---

## 11 · Cross-references

- Implementation tokens — `src/styles/tokens/{color,typography,spacing,radius,elevation,motion,chrome,zIndex}.ts`
- Theme contract — `src/styles/theme.css.ts`
- Spec maintaining calibration history — `docs/superpowers/specs/2026-05-06-react-migration/02-design-tokens.md`
- UI primitives spec — `docs/superpowers/specs/2026-05-06-react-migration/03-ui-primitives.md`
- Layouts spec — `docs/superpowers/specs/2026-05-06-react-migration/07-layouts-patterns.md`
- Compact-list reference application — `docs/superpowers/specs/2026-05-10-posts-list-design.md`
- Live primitive gallery — `/_dev/primitives` route
- Live token swatches — `/_dev/design` route

---

## 12 · Calibration history

Visual changes are tracked in spec 02's calibration log, not here. Summary:

- **v0** (2026-05-09) — initial dark palette, 13-step typography preset list,
  spacing/radius/elevation/motion tokens.
- **v1** (2026-05-10) — surface-ladder / canvas / hairlines re-tuned for even
  5-lightness steps; sidebar active background moved to a static value (per
  spec §7); brand colour unchanged.
- **v2** (2026-05-11) — typography pass per Linear inbox row anatomy:
  atomic `fontSize / fontWeight / iconSize` axes added; `listTitle / listMeta /
  listLabel` presets added; compact-list density rule (57 px, two sizes / two
  weights, weight-and-color hierarchy) baked into spec 02; `Inter Variable`
  prepended to font stack for true 450 weight rendering.
