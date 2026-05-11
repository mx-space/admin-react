import { createGlobalTheme, createThemeContract } from '@vanilla-extract/css'

import { darkColor, lightColor } from './tokens/color'
import { fontFamily } from './tokens/typography'
import { radius } from './tokens/radius'
import { spacing } from './tokens/spacing'
import { zIndex } from './tokens/zIndex'

type Nullify<T> = { [K in keyof T]: null }

const nullify = <T extends Record<string, string>>(obj: T): Nullify<T> => {
  const out = {} as Nullify<T>
  for (const key of Object.keys(obj) as Array<keyof T>) out[key] = null
  return out
}

/**
 * 单一 themeContract，键由 darkColor 之 shape 推导；
 * lightColor 必须键集等同（TS 由 `typeof darkColor` 强约束）。
 * 主题切换通过双 createGlobalTheme：
 *   - `:root, :root.dark` → darkValues (default + 显式 dark)
 *   - `:root.light`      → lightValues (specificity 高于 `:root`，故覆盖)
 */
export const themeContract = createThemeContract({
  color: nullify(darkColor),
  fontFamily: nullify(fontFamily),
  spacing: nullify(spacing),
  radius: nullify(radius),
  zIndex: nullify(zIndex),
})

const darkValues = {
  color: darkColor,
  fontFamily,
  spacing,
  radius,
  zIndex,
}

const lightValues = {
  color: lightColor,
  fontFamily,
  spacing,
  radius,
  zIndex,
}

createGlobalTheme(':root, :root.dark', themeContract, darkValues)
createGlobalTheme(':root.light', themeContract, lightValues)

export const darkTheme = 'dark' as const
export const lightTheme = 'light' as const
