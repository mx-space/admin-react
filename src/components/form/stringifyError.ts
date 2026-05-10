/**
 * Tanstack Form's `errors` array carries whatever the validator returned.
 * For Standard Schema (zod) validators this is `{ message: string, path: ... }`.
 * For raw functions returning strings, the entry is the string itself.
 * Normalize to a single human-readable message.
 */
export function stringifyError(error: unknown): string {
  if (error == null) return ''
  if (typeof error === 'string') return error
  if (typeof error === 'number' || typeof error === 'boolean') return String(error)
  if (typeof error === 'object') {
    const obj = error as Record<string, unknown>
    if (typeof obj.message === 'string') return obj.message
  }
  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}
