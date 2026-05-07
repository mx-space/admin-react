export type ClassValue = string | false | null | undefined

export const cx = (...args: ClassValue[]): string =>
  args.filter(Boolean).join(' ')
