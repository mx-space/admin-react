import { Bug, Check, RotateCcw, Server } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import { Button, Input } from '~/components/ui'

import {
  actionsStyle,
  checkboxStyle,
  fieldStyle,
  formStyle,
  headStyle,
  heroStyle,
  labelStyle,
  persistRowStyle,
  rootStyle,
  subtitleStyle,
  titleStyle,
} from './setup-api.css'

const API_KEY = 'VITE_APP_BASE_API'
const GATEWAY_KEY = 'VITE_APP_GATEWAY'

const transformFullUrl = (url: string): string => {
  if (!url) return ''
  if (/^https?:\/\//.test(url)) return url
  const isLocal = ['localhost', '127.0.0.1'].includes(url.split(':')[0] ?? '')
  return `${isLocal ? 'http' : 'https'}://${url}`
}

const readInitial = (key: string, fallback: string) => {
  try {
    return (
      sessionStorage.getItem(key) ?? localStorage.getItem(key) ?? fallback
    )
  } catch {
    return fallback
  }
}

const SetupApiPage = () => {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  const [apiUrl, setApiUrl] = useState(() =>
    readInitial(API_KEY, `${origin}/api/v2`),
  )
  const [gatewayUrl, setGatewayUrl] = useState(() =>
    readInitial(GATEWAY_KEY, origin),
  )
  const [persist, setPersist] = useState(true)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fullApi = transformFullUrl(apiUrl)
    const fullGateway = transformFullUrl(gatewayUrl)
    try {
      const store = persist ? localStorage : sessionStorage
      const otherStore = persist ? sessionStorage : localStorage
      otherStore.removeItem(API_KEY)
      otherStore.removeItem(GATEWAY_KEY)
      if (fullApi) store.setItem(API_KEY, fullApi)
      if (fullGateway) store.setItem(GATEWAY_KEY, fullGateway)
    } catch {
      toast.error('存储不可用，无法保存')
      return
    }
    toast.success('已保存，将重载')
    setTimeout(() => location.replace('/'), 200)
  }

  const onReset = () => {
    try {
      localStorage.removeItem(API_KEY)
      localStorage.removeItem(GATEWAY_KEY)
      sessionStorage.removeItem(API_KEY)
      sessionStorage.removeItem(GATEWAY_KEY)
    } catch {
      // ignore
    }
    toast.success('已重置')
    setTimeout(() => location.replace('/'), 200)
  }

  const onLocalDev = () => {
    setApiUrl('http://localhost:2333')
    setGatewayUrl('http://localhost:2333')
  }

  return (
    <div className={rootStyle}>
      <span className={heroStyle}>
        <Server size={28} aria-hidden />
      </span>

      <div className={headStyle}>
        <h1 className={titleStyle}>设置 API</h1>
        <p className={subtitleStyle}>配置后端服务地址</p>
      </div>

      <form className={formStyle} onSubmit={onSubmit}>
        <div className={fieldStyle}>
          <label className={labelStyle} htmlFor="api-url">
            API 地址
          </label>
          <Input
            id="api-url"
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:2333"
          />
        </div>

        <div className={fieldStyle}>
          <label className={labelStyle} htmlFor="gateway-url">
            Gateway 地址
          </label>
          <Input
            id="gateway-url"
            type="url"
            value={gatewayUrl}
            onChange={(e) => setGatewayUrl(e.target.value)}
            placeholder="http://localhost:2333"
          />
        </div>

        <label className={persistRowStyle}>
          <span>持久化保存（localStorage）</span>
          <input
            className={checkboxStyle}
            type="checkbox"
            checked={persist}
            onChange={(e) => setPersist(e.target.checked)}
          />
        </label>

        <div className={actionsStyle}>
          <Button
            intent="secondary"
            onClick={onLocalDev}
            startIcon={<Bug size={14} />}
            style={{ flex: 1 }}
          >
            本地调试
          </Button>
          <Button
            intent="secondary"
            onClick={onReset}
            startIcon={<RotateCcw size={14} />}
            style={{ flex: 1 }}
          >
            重置
          </Button>
          <Button
            type="submit"
            intent="primary"
            startIcon={<Check size={14} />}
            style={{ flex: 1 }}
          >
            保存
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SetupApiPage
