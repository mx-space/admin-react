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

- **Linear-aligned visual reference.** Compact, ink-on-canvas, surface ladder for
  depth, no decorative shadows, lavender accent reserved for the user's own action.
- **Dual-theme by mathematical mirror.** Light and dark are not two designs but
  one design **rotated about L=50**. Every semantic token's `L(light) + L(dark)`
  is engineered to fall in `[95, 105]` — relative weight stays constant, only
  polarity flips. Tokens are written in `lch()` so the math is visible at the
  source.
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

## 1 · Foundation · Dual-theme palette

Two themes — **dark** (default) and **light** — built on one contract. Tokens are
authored in `lch()` so the underlying geometry is legible at the source. The hue
shifts **10°** between modes (Light `282°` / Dark `272°`) and every paired token's
L values sum to ~100 — the polarity is reversed, the perceptual weight is not.

### 1.0 · Theme mechanics

```
Light surface  L_L  +  Dark surface  L_D  ≈ 100         (mirror constraint)
Light hue 282°  ─  Dark hue 272°   = 10° cooler in dark  (anti-warmth bias)
Status colors:  light fg + light tinted-bg pair / dark fg + dark tinted-bg pair
                (independent of mirror rule — semantics dominate aesthetics)
```

CSS plumbing is two `createGlobalTheme` blocks against one contract:

```ts
createGlobalTheme(':root, :root.dark', themeContract, darkValues)   // default
createGlobalTheme(':root.light',       themeContract, lightValues)  // override
```

`:root.light` (specificity `0,2,0`) beats the bare `:root` (`0,1,0`); the store
toggles `documentElement.classList` between `dark` and `light`. There is no
unclassed state at runtime.

### 1.1 · Surface ladder

Five steps from deepest canvas to floating chip. Depth is **always** carried by
surface, never by shadow. Light and dark mirror each other across L=50.

| Token | Light (hue 282) | Dark (hue 272) | Use |
|---|---|---|---|
| `canvas` | `lch(95.94% 0.5 282)` | `lch(4.52% 0.3 272)` | Page base. Nothing sits below it. |
| `surface1` | `lch(98.94% 0.5 282)` | `lch(6.77% 0.75 272)` | Default card / panel. |
| `surface2` | `lch(93.44% 0.5 282)` | `lch(9.02% 2.1 272)` | Hover / selected row. |
| `surface3` | `lch(91.94% 0.5 282)` | `lch(11.27% 3 272)` | Popover / dropdown / chip. |
| `surface4` | `lch(85.44% 0 282)` | `lch(15.32% 1.38 272)` | Floating chip / strong hover. |

### 1.2 · Sidebar chrome

The sidebar **shares the chrome plane** with the AppShell outer wrapper —
both use `canvas`, so the visible boundary between sidebar and the gap
surrounding the main card disappears. The chrome reads as one continuous
surface; only the `surface1` main card stands out as the focal plane.
`bgSidebar` is preserved as a separate token name to express *intent* (chrome
plane in the sidebar role) even though its value equals `canvas`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bgSidebar` | `lch(95.94% 0.5 282)` | `lch(4.52% 0.3 272)` | Sidebar container — **equals `canvas`** to fuse with outer chrome. |
| `bgSidebarRow` | `lch(91.94% 0.5 282)` | `lch(9.02% 2.1 272)` | Row hover **and** selected — one step away from chrome. Light: deeper. Dark: brighter. |
| `bgSidebarChip` | `lch(89.49% 0 282)` | `lch(11.27% 3 272)` | Counter pill / avatar fallback. |
| `sidebarTreeLine` | `lch(85.44% 0 282)` | `lch(15.32% 1.38 272)` | 1 px hairline for nested subtree. |

The sidebar has **no right border** — the canvas gap around the main inset
card *is* the boundary. The main card's own hairline border closes the
visual frame on the focal side.

### 1.3 · Hairlines

Three hairline levels, each at least 2 L away from `surface1` in both themes —
otherwise they vanish into the card background. The original Linear-measured
values (`L=6.77 dark` for tertiary) collided with our `surface1 L=6.77`, so the
ladder is re-spaced.

| Token | Light | Dark | Use |
|---|---|---|---|
| `hairlineTertiary` | `lch(94% 0.5 282)` | `lch(9.5% 1 272)` | Barely-visible in-card sub-section divider. |
| `hairline` | `lch(89% 0.5 282)` | `lch(12% 1.38 272)` | Standard divider (list/detail, header underline). |
| `hairlineStrong` | `lch(82% 0.5 282)` | `lch(18% 1.38 272)` | Section header underline; emphasised separator. |

### 1.4 · Ink (text)

Four levels of contrast — hierarchy by color, not weight. The L gaps (≈20 each
in both themes) keep the perceptual distance between adjacent levels constant.

| Token | Light (hue 282) | Dark (hue 272) | Use |
|---|---|---|---|
| `ink` | `lch(9.89% 0 282)` | `lch(100% 0 272)` | Primary text — titles, row anchor. |
| `inkMuted` | `lch(19.79% 1.25 282)` | `lch(90.35% 1.15 272)` | Secondary anchor — chip body, category. |
| `inkSubtle` | `lch(39.58% 1.25 282)` | `lch(60.30% 1.15 272)` | Meta — status, ids, time. |
| `inkTertiary` | `lch(65.30% 1.25 282)` | `lch(36.30% 1.15 272)` | Recede — disabled, placeholder. |

> Every pair sums to L ≈ 100 (9.89+100, 19.79+90.35, 39.58+60.30, 65.30+36.30).
> If a future token doesn't, it's outside the system.

### 1.5 · Brand accent · lavender

The brand color is **theme-invariant** — the lavender stays the same hex in both
modes (the rotation lands on a hue that already reads well on either surface).
Only the hover/focus shades pivot to keep the contrast against the surface.

| Token | Light | Dark | Use |
|---|---|---|---|
| `primary` | `#5e6ad2` | `#5e6ad2` | The user's action — primary button, selection border. |
| `primaryHover` | `#4e5ac0` | `#828fff` | Hover state — light darkens, dark brightens. |
| `primaryFocus` | `#3f4bb0` | `#5e69d1` | Active / pressed state. |
| `onPrimary` | `#ffffff` | `#ffffff` | Text on a primary fill. |

The accent is **scarce**. A page should never have two primary buttons; a list
row should never tint solid lavender unless selected. Selection uses
`rgba(94,106,210,0.10)` background + a 2 px lavender left-border.

### 1.6 · Status colors (independent namespace)

Status semantics — danger / warning / success / info — **opt out of the mirror
rule**. They carry meaning, not weight; flipping their hex by L would break the
visual semantics (a "red" that became pink/teal in the other mode is no longer
red). Instead, each role has an `fg` and a tinted `bg` pair per theme.

| Role | Light fg | Light bg | Dark fg | Dark bg |
|---|---|---|---|---|
| `semanticSuccess` | `#26a544` | `#d5ffd6` | `#40b956` | `#0e1d11` |
| `semanticDanger` | `#eb5757` | `#ffe7de` | `#ff8583` | `#2c1113` |
| `semanticWarning` | `#ff7235` | `#ffeac6` | `#ff8647` | `#1f190d` |
| `semanticInfo` | `#007def` | `#dbffff` | `#67d9ff` | `#091d20` |
| `semanticOverlay` | `rgba(0,0,0,0.45)` | — | `rgba(0,0,0,0.65)` | — |

Status colors are admin-only. Use sparingly, never decoratively. A neutral tag
uses ink, not info-blue.

### 1.7 · Inverse (escape hatch)

For surfaces that must stay one polarity regardless of theme — login hero, brand
logo container, force-dark tooltip — consume the `inverse*` tokens. They always
point at the **opposite** palette's surface/ink values.

| Token | Light | Dark |
|---|---|---|
| `inverseCanvas` | `lch(4.52% 0.3 272)` | `lch(98.94% 0.5 282)` |
| `inverseSurface1` | `lch(6.77% 0.75 272)` | `lch(93.44% 0.5 282)` |
| `inverseSurface2` | `lch(9.02% 2.1 272)` | `lch(91.94% 0.5 282)` |
| `inverseInk` | `lch(100% 0 272)` | `lch(9.89% 0 282)` |

### 1.8 · Status dots — published / draft

`semanticSuccess` (7 px, published) versus `inkTertiary` (7 px, draft). Diameter
fixed at 7; never tint a row's whole background to encode status.

### 1.9 · Notification & list color encoding (Linear inbox)

How color carries meaning in dense list views (inbox, activity feed, issue list).
The governing principle: **semantic color rides on small glyphs, never on row
backgrounds.** The list canvas stays neutral; the eye scans tiny color cues.

| Cue | What encodes it | What does NOT encode it |
|---|---|---|
| **Read / unread** | Ink strength: unread = `ink`, read = `inkSubtle` (whole row dims). | No unread dot, no left-border, no `surface2` tint, no italic. |
| **Selection** | `surface2` background + title bumped to `ink`. | No lavender bar, no left-border, no status color. |
| **Hover (not selected)** | `surface2` background (same as selected — selection is bold text on top). | No primary tint, no shadow. |
| **Priority / urgency** | 14 px square glyph at row-end, fill = semantic color (orange `semanticWarning` for high, red `semanticDanger` for urgent). | Row background never tinted. An urgent row reads as a normal row with an orange chip. |
| **Issue state** | 12 px circle glyph (in-progress = cyan, done = `semanticSuccess`, cancelled = `inkTertiary`). | No row-end coloured stripe. |
| **Notification type** | 10-12 px badge overlaid on avatar bottom-right (`@` = info cyan, reply = `inkSubtle`, urgent = `semanticDanger`). | No coloured row-start gutter. |
| **Embed source** (e.g. GitHub card) | 2-3 px coloured left-border on the embed card; card body stays `surface1`. | No tinted bg fill. The colour names the source; the surface stays neutral. |
| **Timeline events** | `inkSubtle` body text + 12 px semantic-coloured icon. | No dividers between events, no per-event card, no row banding. |

**Composition rule.** A list row can carry up to **two** colour cues: one at the
left (notification type on avatar) and one at the right (priority or state). The
title and metadata sit in the middle in plain ink. No third coloured element
inside one row — that crosses into decoration.

**Why this matters.** Tinting whole rows ("urgent = pink row") destroys
scannability — the dense canvas becomes a heatmap and the eye loses anchors.
Linear's discipline of "color on tiny glyphs only" lets a thousand-item inbox
stay readable. Carry the same discipline into our notification, draft list,
posts list, and any future activity stream.

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

## 7.5 · Sidebar pattern (Linear-aligned)

The sidebar is the densest navigation surface in the app — a vertical column
holding 20+ rows. Information hierarchy is carried by **three independent axes
working in concert**, never by size:

| Axis | How it expresses level |
|---|---|
| **Lightness ladder** | `ink` (L=100, selected) → `inkMuted` (L=90, hover) → `inkSubtle` (L=60, default / group title) → `inkTertiary` (L=36, stub / collapsed) |
| **Indent** | Each L-step adds **16 px** of left padding. Nested team children draw a 1 px `sidebarTreeLine` from parent into the subtree. |
| **Weight** | All nav text is `500 medium` — group titles included. **Weight does not vary inside the sidebar.** |

### Geometry

```ts
chrome.sidebarWidthExpanded   = 244   // 12 inset + 220 content + 12 inset
chrome.sidebarHeaderHeight    = 52    // workspace header — equals 2 rows + 1 section gap
chrome.sidebarRowHeight       = 28    // every L1–L4 row & group header
chrome.sidebarRowInsetX       = 12    // outer breathing room
chrome.sidebarSectionGap      = 24    // organic separator between groups (no divider line)
chrome.sidebarIndent          = 16    // L3 → L4 nest step
```

### Typography presets

```ts
typography.navItem   = { 13, 500, normal, 0 }   // every nav row (L1–L4)
typography.navGroup  = { 12, 500, normal, 0 }   // group header AND counter pill body
```

Two sizes total. Anything **≥ 16 px** is forbidden inside the sidebar — it
would compete with the main content area for the eye.

### Row anatomy

```
┌─ 28 px ───────────────────────────────────────────────────┐
│  [icon 16, currentColor]  Label              [Counter 18] │
│   ↑ stroke 1.5                                  ↑ pill    │
└────────────────────────────────────────────────────────────┘
  ↑ 10 px left              flex 1                ↑ 9 px right
```

- States: **default** `inkSubtle` on transparent; **hover** `inkMuted` on
  `bgSidebarRow`; **active** `ink` on `bgSidebarRow` (same fill — selection is
  spelt by color, not deeper bg); **stub/disabled** `inkTertiary`.
- Border radius `md (8 px)`. The 12 px container inset means the selected fill
  reads as a 220 px chip **floating** on the sidebar — never a bleed-to-edge bar.
- Counter pill: `12/500`, `bgSidebarChip`, `radius.pill`, `≥ 18 px` square,
  `99+` truncation, hidden when count is 0/undefined. Pill keeps its background
  in the active row — only its **text** brightens to `ink`.

### Separators — none

Group separation is **24 px of breathing space + a `inkSubtle` 12 px title**,
nothing else. No divider line, no surface step, no boxed section background.
The compression-then-release rhythm — tight 28 px rows under generous 24 px
gaps — *is* the visual layering.

### Iconography

All sidebar icons are Lucide at **16 × 16, stroke 1.5, `currentColor`**.
Icons brighten with their row (inheritance, not explicit color). The single
allowed exception is a brand-emoji slot in a Favorite row — anywhere else
colored glyphs are anti-pattern.

---

## 7.6 · Main-as-inset-card (Linear shell)

The main content area floats as an **inset card** over the chrome canvas — it
does **not** bleed to viewport edges. This gives the app shell three visible
layers on every screen:

```
┌─────────────────────────────────────────────────────────────┐
│                       canvas (chrome)                       │ ← outer wrapper
│                                                             │
│  ┌────────────┐  ┌─────────────────────────────────────┐    │
│  │            │  │ surface1 (focal card)              ╲│    │
│  │  sidebar   │  │   ┌──────────┬───────────────┐     │    │
│  │  (deepest  │  │   │ list     │ detail        │     │    │
│  │   chrome)  │  │   │ pane     │ pane          │     │    │
│  │            │  │   └──────────┴───────────────┘     │    │
│  └────────────┘  └─────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- **`AppShell` root** uses `canvas` — visible as the gap surrounding the card.
- **Sidebar** uses `bgSidebar` — flush against viewport left/top/bottom, no
  right border (the canvas gap *is* the divider).
- **Main card** (`AppShell.mainStyle`) uses `surface1` with `radius.md`,
  `8 px` top/right/bottom margin, `6 px` left margin (gap from sidebar), and a
  `hairline` border. The card clips its children (`overflow: hidden`).
- **All page-level layouts** (`FullLayout`, `TwoColLayout`) use `surface1` for
  their root / header / body — they live *inside* the card and must not
  re-paint with `canvas`, or the inset effect is lost.
- **Inner panes** within `TwoColLayout` share `surface1` — list, detail, body
  all sit on the same focal plane. Differentiation is carried by `hairline`
  dividers (not `hairlineTertiary`, which is too faint at the card's L band).
  Painting the master pane a different tone would invert the dual-theme
  polarity expectations users build in the rest of the app — keep it uniform.

This pattern replaces the older "edge-to-edge canvas" shell. Pages that need
to span the entire viewport (auth setup, error pages) use `SetupLayout`, which
opts out of the card pattern.

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
  sidebarWidthExpanded: 244,        // Linear: 12 + 220 + 12
  sidebarWidthCollapsed: 56,
  sidebarMobileWidth: 280,
  sidebarHeaderHeight: 52,          // workspace chip row
  sidebarRowHeight: 28,             // nav rows + group headers
  sidebarRowInsetX: 12,             // outer inset; selection chip = 220 px
  sidebarSectionGap: 24,            // group spacing — no divider line
  sidebarIndent: 16,                // L3 → L4 nest step
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
| Tinting a whole row by status (`urgent` = pink row) | Row stays neutral; status rides on a 12-14 px glyph at row-end (see §1.9) |
| Unread blue dot or lavender-bar to signal "unread" | Differentiate by ink strength only — read rows fade to `inkSubtle` |
| Three coloured chips inside one list row | Max two colour cues per row: one left (type on avatar), one right (state/priority) |
| Background-tinted embed cards (`bg = info-blue-soft`) | Card body stays `surface1`; identity is a 2-3 px coloured left-border |

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
- **v3** (2026-05-11) — sidebar redesign aligned to Linear's measured rhythm:
  width 232 → 244 (= 12 inset + 220 content + 12 inset); new chrome tokens
  `sidebarHeaderHeight (52) / sidebarRowHeight (28) / sidebarSectionGap (24) /
  sidebarRowInsetX (12) / sidebarIndent (16)`; new color tokens `bgSidebar /
  bgSidebarRow / bgSidebarChip / sidebarTreeLine` mapped to Linear's L=1.82 /
  9.02 / 11.27 / 15.32 LCH bands; typography presets `navItem (13/500)` and
  `navGroup (12/500)` added — sidebar now carries hierarchy on **three**
  axes (lightness × indent × statically-500 weight) and zero divider lines.
- **v4** (2026-05-11) — dual-theme (Light + Dark) goes live; the deferred light
  theme exits the "Open questions" list. Color tokens rewritten in `lch()` with
  hue 282° / 272° per polarity; every surface / hairline / ink pair engineered
  to satisfy `L_light + L_dark ∈ [95, 105]`. Status tokens split into `fg / bg`
  pairs per theme and opted out of the mirror rule (semantics dominate). Brand
  lavender stays theme-invariant; only its hover/focus pivots. Theme switching
  via `:root.dark` / `:root.light` classes with `createGlobalTheme` overlay —
  `useUIStore.refreshIsDark` now toggles **both** classes (was dark-only).
- **v5** (2026-05-11) — main-as-inset-card shell adopted (Linear style); the
  shell now layers `canvas` (chrome gap) → `bgSidebar` (recessed) → `surface1`
  (main card with `radius.md` + 8 px inset + `hairline` border). Sidebar's
  right border removed; `FullLayout` / `TwoColLayout` repainted from `canvas`
  to `surface1` to honour the inset card. `TwoColLayout` inner divider lifted
  from `hairlineTertiary` to `hairline` (panes share bg, so the divider is the
  only cue). **Hairline ladder re-spaced** because the original Linear-measured
  `hairlineTertiary L=6.77` collided with `surface1 L=6.77` in dark — new
  ladder keeps ≥ 2.5 L between any hairline and the surfaces it sits on.
- **v6** (2026-05-11) — notification / list colour-encoding rules formalised
  (DESIGN §1.9) after auditing Linear's inbox: status colour rides only on
  ≤ 14 px glyphs, read/unread by ink strength only, max two colour cues per
  row (left = notification type on avatar, right = priority / state), embed
  cards keep `surface1` body + 2-3 px coloured left-border, timeline events
  stream without dividers. Four matching anti-patterns added to §10.
