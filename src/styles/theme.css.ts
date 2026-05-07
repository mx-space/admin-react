import { createGlobalTheme, createThemeContract } from '@vanilla-extract/css'

import { color } from './tokens/color'
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

export const themeContract = createThemeContract({
  color: nullify(color),
  fontFamily: nullify(fontFamily),
  spacing: nullify(spacing),
  radius: nullify(radius),
  zIndex: nullify(zIndex),
})

const darkValues = {
  color,
  fontFamily,
  spacing,
  radius,
  zIndex,
}

createGlobalTheme(':root, :root.dark', themeContract, darkValues)

export const darkTheme = 'dark' as const
export const lightTheme = darkTheme
