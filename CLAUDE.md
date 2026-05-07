# CLAUDE.md

This file orients Claude Code working in this repo.

## Project

**mx-admin-next** — MX Admin v8. React 19 rewrite of `admin-vue3` (Vue 3 / Naive UI / UnoCSS). Greenfield repo; the source repo is frozen during migration and replaced at cutover. Backend (`mx-core`) is consumed unchanged.

## Migration plan (READ BEFORE WORKING)

The migration is fully specified. Always read the relevant spec before touching code.

- Index / roadmap → [docs/superpowers/specs/2026-05-06-react-migration/00-roadmap.md](./docs/superpowers/specs/2026-05-06-react-migration/00-roadmap.md)
- Repo skeleton (P0 — done) → `01-repo-skeleton.md`
- Design tokens → `02-design-tokens.md`
- UI primitives → `03-ui-primitives.md`
- State layer (Zustand + Jotai) → `04-state-layer.md`
- Data layer (request + TanStack Query + socket.io) → `05-data-layer.md`
- Routing + auth → `06-routing-auth.md`
- Layouts + patterns → `07-layouts-patterns.md`
- Form system → `08-form-system.md`
- Editors (haklex / monaco / cm6 / xterm) → `09-editors.md`
- Charts + misc → `10-charts-misc.md`
- Views migration (21 views, batched) → `11-views-migration.md`
- Table effort → `12-table-effort.md`

The roadmap defines milestones P0–P5 plus a parallel Table track.

## Source repo

Vue 3 source lives at `../admin-vue3` (sibling). When porting a view, **read the original first** — `../admin-vue3/src/pages/<view>` — to confirm 1:1 functional parity.

Cross-references:
- Old design / typography / layout docs are linked under `docs/typography.md`, `docs/master-detail-layout.md`.
- Other related agent-chat specs are under `docs/superpowers/specs/`.

## Tech stack (canonical — see roadmap for full table)

- React 19 + Vite 8 + `@vitejs/plugin-react-swc`
- Routing: `react-router` v7, classic component routing (data router rejected)
- Server state: `@tanstack/react-query` 5.x, `query-persist-client-core` (`['ai']` prefix → localStorage)
- Session state: Zustand (auth, theme, layout backbone, ui)
- Page-local state: Jotai (drawer toggles, drafts, selections, AI queue, header-action slot)
- UI primitives: `@base-ui-components/react` (headless)
- Styling: vanilla-extract css.ts — **no Tailwind, no UnoCSS**
- Design system: Linear dark-canvas (lavender accent, four-step surface ladder; calibrate during P1)
- Forms: `react-hook-form` + `zod`
- Animation: `motion`
- Icons: `lucide-react`
- Toast: `sonner`
- Command palette: `kbar`
- Editors: `@monaco-editor/react`, hand-rolled CodeMirror 6, `@haklex/*` direct mount (no Vue bridge), `xterm`
- Charts: `@antv/g2` via `useG2Chart`
- Realtime: `socket.io-client` via `useSocketIO` (replaces `window.bus` event bus)
- Auth: `better-auth` + `@better-auth/passkey`
- API client: `ofetch` + `@mx-space/api-client` types
- Lint: `oxlint`

## State allocation rule

| Bucket | Goes to |
|---|---|
| Server data | TanStack Query |
| Session-level singletons (auth, theme, layout, app config) | Zustand |
| Page-local ephemeral | Jotai |
| Truly component-private | `useState` |

Cross-component fan-out without server fetch → Jotai by default. Promote to Zustand only when state outlives the route.

## Dev commands

```bash
pnpm install
pnpm dev              # vite, port 9528
pnpm typecheck        # tsc --noEmit
pnpm lint             # oxlint src
pnpm lint:fix
pnpm build            # vite build
```

**Validation**: after writing code, run `pnpm typecheck` (and `pnpm lint` on changed files only). Do not run `pnpm build` for validation. Never sweep lint across the whole project — only on files you touched.

## Path alias

```ts
import { x } from '~/lib/...'   // ~ → ./src
```

## Directory layout (per spec 01)

```
src/
├── main.tsx · App.tsx · env.d.ts
├── styles/             css.ts tokens, reset, global, recipes
├── routes/             route tree, ProtectedRoute, names
├── layouts/            AppShell, SetupLayout, MasterDetailLayout
├── pages/              one dir per view
├── components/
│   ├── ui/             Base UI wrappers
│   ├── form/           ConfigForm DSL
│   ├── editor/         rich · monaco · codemirror · xterm
│   ├── chart/ · table/ · kbar/ · markdown/ · upload/
│   ├── ai/ · draft/ · setting/ · shared/
├── stores/             Zustand
├── atoms/              Jotai
├── api/                36 service modules (port from src/api/)
├── hooks/queries/      TanStack Query hooks
├── lib/                request · query-client · socket · auth · transform
├── models/ · constants/ · utils/
```

## Code style

- Follow existing patterns. New files mirror neighbours.
- Max 500 lines per file; React components under 300.
- No useless comments. Don't comment obvious code.
- Components use function form + named exports unless single-default convention demands it.
- Imports order: node built-in → external → `~/...` → relative.
- Run lint/typecheck **only on changed files**.

## Migration ground rules

- 1:1 functional parity is the bar. Behavioural drift requires explicit sign-off.
- Linear dark-canvas redesign is the visual brief. Tokens calibrate during P1; do not freeze them before.
- Pin `@haklex/*` exact versions across the migration window; re-pin on each upstream release.
- Audit every `window.bus` consumer in the source before removing the bus.
- css.ts is **compile-time** — dynamic per-instance styling uses inline `style` props, not generated css.ts variants.

## Git

- Never commit automatically unless explicitly requested.
- Never add AI co-authorship trailers.

## Security

- Never read `.env` files.

## Status

P0 complete (2026-05-07): repo scaffolding, vite/tsconfig/oxlint, css.ts pipeline, query client, theme bootstrap. Next: spec 02 (design tokens) and spec 03 (5 primitives — Button/Input/Card/Modal/Toast).
