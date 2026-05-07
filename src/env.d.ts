/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API?: string
  readonly VITE_APP_WEB_URL?: string
  readonly VITE_APP_GATEWAY?: string
  readonly VITE_APP_LOGIN_BG?: string
  readonly VITE_APP_PUBLIC_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    injectData?: Record<string, unknown>
    version?: string
  }
}

export {}
