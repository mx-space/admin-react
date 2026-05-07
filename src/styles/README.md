# styles

Design-token system for `mx-admin-next`. Implements [spec 02 · Design Tokens](../../docs/superpowers/specs/2026-05-06-react-migration/02-design-tokens.md).

## Layout

```
styles/
├── theme.css.ts          themeContract + dark theme bound to :root, :root.dark
├── global.css.ts         html/body typography + color defaults
├── reset.css.ts          minimal CSS reset
├── recipes/              future home for shared @vanilla-extract/recipes
└── tokens/
    ├── color.ts          Linear dark-canvas palette + admin semantic colors
    ├── typography.ts     fontFamily contract + typography step values
    ├── spacing.ts        4px-base spacing scale
    ├── radius.ts         radius scale (xs..xxl, pill, full)
    ├── elevation.ts      surface ladder recipes (depend on themeContract)
    ├── motion.ts         duration + easing constants for `motion`
    ├── zIndex.ts         single source for stacking order
    └── index.ts          barrel re-exports
```

## Token namespaces

| Namespace | In theme contract | Notes |
|---|---|---|
| `color` | yes | Theme-switchable. Includes Linear marketing palette + admin semantic colors. |
| `fontFamily` | yes | Three slots: `display`, `text`, `mono`. |
| `spacing` | yes | Static across themes; in contract for ergonomic CSS-var references. |
| `radius` | yes | Static across themes. |
| `zIndex` | yes | String-encoded so they round-trip through CSS variables. |
| `typography` | no | Compile-time constants — same across themes. |
| `elevation` | no | Recipes that compose contract refs; not single tokens. |
| `motion` | no | Plain TS values consumed by the `motion` library. |

## Theme switching

Dark is the default. The contract is wired at both `:root` and `:root.dark`, so adding the `dark` class to `<html>` is a no-op visually — the boot script in `index.html` adds it eagerly to keep the contract symmetric for the upcoming light theme.

When light theme lands (spec 02b):

1. Add `createGlobalTheme(':root.light', themeContract, lightValues)` in `theme.css.ts`.
2. Update `lightTheme` to `'light' as const`.
3. Update `useUIStore.setThemeMode` to swap `<html>` class accordingly.

## Usage

```ts
import { themeContract } from '~/styles/theme.css'
import { motion, typography } from '~/styles/tokens'

// css.ts compile-time
const card = style({
  background: themeContract.color.surface1,
  borderRadius: themeContract.radius.lg,
  padding: themeContract.spacing.md,
})

// inline (motion-driven values)
<motion.div
  transition={{ duration: motion.duration.normal, ease: motion.easing.standard }}
/>
```

Primitives (spec 03) consume `themeContract` through `@vanilla-extract/recipes`. Page code may reach for `themeContract` directly when inline styling is justified, but should prefer primitive variants.
