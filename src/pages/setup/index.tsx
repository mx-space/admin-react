import { useQuery } from '@tanstack/react-query'
import {
  Check,
  ChevronLeft,
  PartyPopper,
  Rocket,
  Settings as SettingsIcon,
  User as UserIcon,
} from 'lucide-react'
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import {
  systemApi,
  type CreateOwnerData,
  type InitConfigKey,
} from '~/api/system'
import { Button, Input } from '~/components/ui'
import { Spinner } from '~/components/ui/Spinner'
import { authClient } from '~/lib/auth-client'

import {
  actionsStyle,
  ctaRowStyle,
  errorTextStyle,
  fieldStyle,
  formStyle,
  gridTwoStyle,
  headStyle,
  helperTextStyle,
  heroIconStyle,
  labelStyle,
  requiredMarkStyle,
  rootStyle,
  stepConnectorStyle,
  stepDotStyle,
  stepperStyle,
  subtitleStyle,
  titleStyle,
} from './setup.css'

interface DefaultConfigsModel {
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  url?: {
    webUrl?: string
    serverUrl?: string
    adminUrl?: string
    wsUrl?: string
  }
  [key: string]: unknown
}

interface StepProps {
  onNext: () => void
  onPrev?: () => void
}

const STEPS = [
  { icon: Rocket, title: '开始', subtitle: '欢迎进行初始化配置' },
  { icon: SettingsIcon, title: '站点', subtitle: '请配置站点基本信息' },
  { icon: UserIcon, title: '账户', subtitle: '请创建管理员账户' },
  { icon: PartyPopper, title: '完成', subtitle: '初始化即将完成' },
] as const

const SetupPage = () => {
  const [step, setStep] = useState(0)

  const { data: defaults, isPending } = useQuery({
    queryKey: ['system', 'init', 'configs', 'default'] as const,
    queryFn: () =>
      systemApi.getInitDefaultConfigs() as Promise<DefaultConfigsModel>,
    staleTime: Infinity,
    retry: false,
  })

  const Step = STEPS[step]

  const stepContent = useMemo(() => {
    if (isPending) return null
    const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1))
    const prev = () => setStep((s) => Math.max(0, s - 1))
    if (step === 0) return <Step0 onNext={next} />
    if (step === 1)
      return <Step1 onNext={next} onPrev={prev} defaults={defaults} />
    if (step === 2) return <Step2 onNext={next} onPrev={prev} />
    return <Step3 onPrev={prev} />
  }, [step, isPending, defaults])

  return (
    <div className={rootStyle}>
      <div className={stepperStyle}>
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const state =
            i === step ? 'active' : i < step ? 'completed' : 'pending'
          return (
            <div
              key={s.title}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <button
                type="button"
                aria-label={`${s.title}${state === 'completed' ? '（已完成）' : state === 'active' ? '（当前）' : ''}`}
                aria-current={state === 'active' ? 'step' : undefined}
                disabled={state === 'pending'}
                onClick={() => state === 'completed' && setStep(i)}
                className={stepDotStyle({ state })}
              >
                {state === 'completed' ? (
                  <Check size={16} aria-hidden />
                ) : (
                  <Icon size={16} aria-hidden />
                )}
              </button>
              {i < STEPS.length - 1 && <span className={stepConnectorStyle} />}
            </div>
          )
        })}
      </div>

      <div className={headStyle}>
        <h1 className={titleStyle}>{Step.title}</h1>
        <p className={subtitleStyle}>{Step.subtitle}</p>
      </div>

      {isPending ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <Spinner size="md" />
        </div>
      ) : (
        stepContent
      )}
    </div>
  )
}

const Step0 = ({ onNext }: StepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [restoring, setRestoring] = useState(false)

  const onPick = () => fileInputRef.current?.click()

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setRestoring(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await systemApi.restoreFromBackup(formData, 1 << 30)
      toast.success('恢复成功，页面将会重载')
      setTimeout(() => location.reload(), 1000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '恢复失败')
    } finally {
      setRestoring(false)
    }
  }

  return (
    <div className={formStyle}>
      <span className={heroIconStyle}>
        <Rocket size={28} aria-hidden />
      </span>
      <p className={helperTextStyle}>开始全新配置，或从备份文件恢复。</p>
      <div className={ctaRowStyle}>
        <Button
          intent="secondary"
          loading={restoring}
          onClick={onPick}
          style={{ flex: 1 }}
        >
          还原备份
        </Button>
        <Button intent="primary" onClick={onNext} style={{ flex: 1 }}>
          开始配置
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        hidden
        onChange={onFile}
      />
    </div>
  )
}

const Step1 = ({
  onNext,
  onPrev,
  defaults,
}: StepProps & { defaults?: DefaultConfigsModel }) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const [title, setTitle] = useState(defaults?.seo?.title ?? '')
  const [description, setDescription] = useState(
    defaults?.seo?.description ?? '',
  )
  const [keywords, setKeywords] = useState(
    (defaults?.seo?.keywords ?? []).join(', '),
  )
  const [adminUrl, setAdminUrl] = useState(`${origin}/qaqdmin`)
  const [serverUrl, setServerUrl] = useState(`${origin}/api/v2`)
  const [webUrl, setWebUrl] = useState(origin)
  const [wsUrl, setWsUrl] = useState(origin)

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const canSubmit = Boolean(title.trim()) && Boolean(description.trim())

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setErrorMsg('')
    try {
      const seoKeywords = keywords
        .split(/[\s,，]+/)
        .map((s) => s.trim())
        .filter(Boolean)
      await Promise.all<unknown>([
        systemApi.patchInitConfig('seo' satisfies InitConfigKey, {
          title,
          description,
          keywords: seoKeywords,
        }),
        systemApi.patchInitConfig('url' satisfies InitConfigKey, {
          adminUrl,
          serverUrl,
          webUrl,
          wsUrl,
        }),
      ])
      onNext()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={formStyle} onSubmit={onSubmit}>
      <div className={fieldStyle}>
        <label className={labelStyle} htmlFor="site-title">
          站点标题 <span className={requiredMarkStyle}>*</span>
        </label>
        <Input
          id="site-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入站点标题"
          autoComplete="organization"
        />
      </div>

      <div className={fieldStyle}>
        <label className={labelStyle} htmlFor="site-desc">
          站点描述 <span className={requiredMarkStyle}>*</span>
        </label>
        <Input
          id="site-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入站点描述"
        />
      </div>

      <div className={fieldStyle}>
        <label className={labelStyle} htmlFor="keywords">
          关键字
        </label>
        <Input
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="以逗号分隔，如：blog, mx-space"
        />
      </div>

      <div className={gridTwoStyle}>
        <div className={fieldStyle}>
          <label className={labelStyle} htmlFor="web-url">
            前端地址
          </label>
          <Input
            id="web-url"
            type="url"
            value={webUrl}
            onChange={(e) => setWebUrl(e.target.value)}
          />
        </div>
        <div className={fieldStyle}>
          <label className={labelStyle} htmlFor="api-url">
            API 地址
          </label>
          <Input
            id="api-url"
            type="url"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
          />
        </div>
        <div className={fieldStyle}>
          <label className={labelStyle} htmlFor="admin-url">
            后台地址
          </label>
          <Input
            id="admin-url"
            type="url"
            value={adminUrl}
            onChange={(e) => setAdminUrl(e.target.value)}
          />
        </div>
        <div className={fieldStyle}>
          <label className={labelStyle} htmlFor="ws-url">
            Gateway 地址
          </label>
          <Input
            id="ws-url"
            type="url"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
          />
        </div>
      </div>

      <div className={errorTextStyle}>{errorMsg}</div>

      <div className={actionsStyle}>
        <Button
          intent="secondary"
          onClick={onPrev}
          startIcon={<ChevronLeft size={14} />}
        >
          返回
        </Button>
        <Button
          type="submit"
          intent="primary"
          loading={submitting}
          disabled={!canSubmit}
        >
          下一步
        </Button>
      </div>
    </form>
  )
}

const Step2 = ({ onNext, onPrev }: StepProps) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRepassword] = useState('')
  const [url, setUrl] = useState('')
  const [avatar, setAvatar] = useState('')
  const [introduce, setIntroduce] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const canSubmit =
    Boolean(username.trim()) &&
    Boolean(mail.trim()) &&
    Boolean(password) &&
    Boolean(repassword)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    if (password !== repassword) {
      setErrorMsg('两次密码不一致')
      return
    }
    setSubmitting(true)
    setErrorMsg('')
    try {
      const payload: CreateOwnerData = {
        username: username.trim(),
        password,
        mail: mail.trim(),
        name: name.trim() || undefined,
        url: url.trim() || undefined,
        avatar: avatar.trim() || undefined,
        introduce: introduce.trim() || undefined,
      }
      await systemApi.createOwner(payload)
      onNext()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '创建失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={formStyle} onSubmit={onSubmit}>
      <div className={fieldStyle}>
        <label className={labelStyle} htmlFor="username">
          用户名（登录凭证）<span className={requiredMarkStyle}>*</span>
        </label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="输入用户名"
          autoComplete="username"
        />
      </div>

      <div className={fieldStyle}>
        <label className={labelStyle} htmlFor="nickname">
          昵称
        </label>
        <Input
          id="nickname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入昵称"
          autoComplete="name"
        />
      </div>

      <div className={fieldStyle}>
        <label className={labelStyle} htmlFor="email">
          邮箱 <span className={requiredMarkStyle}>*</span>
        </label>
        <Input
          id="email"
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder="输入邮箱"
          autoComplete="email"
        />
      </div>

      <div className={gridTwoStyle}>
        <div className={fieldStyle}>
          <label className={labelStyle} htmlFor="password">
            密码 <span className={requiredMarkStyle}>*</span>
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className={fieldStyle}>
          <label className={labelStyle} htmlFor="repassword">
            确认密码 <span className={requiredMarkStyle}>*</span>
          </label>
          <Input
            id="repassword"
            type="password"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className={fieldStyle}>
          <label className={labelStyle} htmlFor="personal-url">
            个人首页
          </label>
          <Input
            id="personal-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
          />
        </div>
        <div className={fieldStyle}>
          <label className={labelStyle} htmlFor="avatar">
            头像 URL
          </label>
          <Input
            id="avatar"
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://"
          />
        </div>
      </div>

      <div className={fieldStyle}>
        <label className={labelStyle} htmlFor="introduce">
          个人介绍
        </label>
        <Input
          id="introduce"
          value={introduce}
          onChange={(e) => setIntroduce(e.target.value)}
          placeholder="一句话介绍自己"
        />
      </div>

      <div className={errorTextStyle}>{errorMsg}</div>

      <div className={actionsStyle}>
        <Button
          intent="secondary"
          onClick={onPrev}
          startIcon={<ChevronLeft size={14} />}
        >
          返回
        </Button>
        <Button
          type="submit"
          intent="primary"
          loading={submitting}
          disabled={!canSubmit}
        >
          下一步
        </Button>
      </div>
    </form>
  )
}

const Step3 = ({ onPrev }: { onPrev?: () => void }) => {
  const navigate = useNavigate()
  const [signing, setSigning] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // 站既建，可填刚创之凭证直登；留空则跳登录页
  const onComplete = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (signing) return
    setSigning(true)
    setErrorMsg('')
    try {
      try {
        localStorage.setItem('to-setting', 'true')
      } catch {
        // ignore
      }
      if (username && password) {
        const res = await authClient.signIn.username({ username, password })
        if (res.error) {
          setErrorMsg(res.error.message ?? '登录失败，请到登录页重试')
          return
        }
        toast.success('初始化完成')
        // 重载以重读 init 状态、刷 query
        location.replace('/dashboard')
        return
      }
      toast.success('初始化完成')
      navigate('/login', { replace: true })
      // 重载使 SetupGuard 重判 isInit
      setTimeout(() => location.reload(), 100)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '登录失败')
    } finally {
      setSigning(false)
    }
  }

  return (
    <form className={formStyle} onSubmit={onComplete}>
      <span className={heroIconStyle}>
        <PartyPopper size={28} aria-hidden />
      </span>
      <p className={helperTextStyle}>
        所有配置已完成。可填入刚创之凭证直登，或留空跳至登录页。
      </p>

      <div className={fieldStyle}>
        <label className={labelStyle} htmlFor="done-username">
          用户名
        </label>
        <Input
          id="done-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>
      <div className={fieldStyle}>
        <label className={labelStyle} htmlFor="done-password">
          密码
        </label>
        <Input
          id="done-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      <div className={errorTextStyle}>{errorMsg}</div>

      <div className={actionsStyle}>
        <Button
          intent="secondary"
          onClick={onPrev}
          startIcon={<ChevronLeft size={14} />}
        >
          返回
        </Button>
        <Button type="submit" intent="primary" loading={signing}>
          完成并进入
        </Button>
      </div>
    </form>
  )
}

export default SetupPage
