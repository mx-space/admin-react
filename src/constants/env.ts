// runtime env resolution: sessionStorage → localStorage → window.injectData → import.meta.env
const read = (key: string): string | undefined => {
  try {
    const ss = sessionStorage.getItem(key)
    if (ss) return ss
    const ls = localStorage.getItem(key)
    if (ls) return ls
  } catch {}
  const inj = (window.injectData as Record<string, string> | undefined)?.[key]
  if (inj) return inj
  return (import.meta.env as Record<string, string | undefined>)[key]
}

export const env = {
  baseApi: read('VITE_APP_BASE_API') ?? '',
  webUrl: read('VITE_APP_WEB_URL') ?? '',
  gateway: read('VITE_APP_GATEWAY') ?? '',
  loginBg: read('VITE_APP_LOGIN_BG') ?? '',
  publicUrl: read('VITE_APP_PUBLIC_URL') ?? '',
}
