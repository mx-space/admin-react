export const zIndex = {
  base: '0',
  dropdown: '100',
  sticky: '200',
  drawer: '300',
  modal: '400',
  popover: '500',
  toast: '600',
  tooltip: '700',
  kbar: '800',
} as const

export type ZIndexToken = keyof typeof zIndex
