// 全局 401 通道：request.ts 检 401 时 fire；AuthErrorBridge 注 handler。
// 同窗内并发之 401 只触发一次（debounce），免重复 logout / toast。

type UnauthorizedHandler = () => void

let handler: UnauthorizedHandler | null = null
let firingLock = false
const DEBOUNCE_MS = 1500

export const setUnauthorizedHandler = (
  fn: UnauthorizedHandler | null,
): void => {
  handler = fn
}

export const fireUnauthorized = (): void => {
  if (firingLock) return
  firingLock = true
  try {
    handler?.()
  } finally {
    setTimeout(() => {
      firingLock = false
    }, DEBOUNCE_MS)
  }
}
