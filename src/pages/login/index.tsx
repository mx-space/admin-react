import { useQuery, useQueryClient } from '@tanstack/react-query'
import { KeyRound } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { userApi } from '~/api/user'
import { Button, Input } from '~/components/ui'
import { queryKeys } from '~/hooks/queries/keys'
import { authClient } from '~/lib/auth-client'
import { BusinessError } from '~/lib/request'
import type { UserModel } from '~/models'
import { useAuthStore } from '~/stores'

import {
  altButtonStyle,
  altRowStyle,
  avatarImg,
  avatarStyle,
  errorStyle,
  formStyle,
  nameStyle,
  rootStyle,
  skeletonStyle,
} from './login.css'

interface LocationState {
  from?: { pathname?: string }
}

const initials = (s: string | undefined) =>
  (s ?? 'A').trim().slice(0, 1).toUpperCase()

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const status = useAuthStore((s) => s.status)
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      const from = (location.state as LocationState | null)?.from?.pathname
      navigate(from ?? '/dashboard', { replace: true })
    }
  }, [status, location.state, navigate])

  const { data: owner } = useQuery<UserModel | null>({
    queryKey: queryKeys.user.owner(),
    queryFn: async () => {
      try {
        return await userApi.getOwner()
      } catch (err) {
        if (
          err instanceof BusinessError &&
          err.message.includes('初始化')
        ) {
          navigate('/setup', { replace: true })
        }
        throw err
      }
    },
    staleTime: 60_000,
    retry: false,
  })

  const { data: allow } = useQuery({
    queryKey: queryKeys.user.allowLogin(),
    queryFn: () => userApi.getAllowLogin(),
    staleTime: 60_000,
  })

  const showPassword = !allow || allow.password !== false
  const showPasskey = allow?.passkey === true

  useEffect(() => {
    if (showPassword) inputRef.current?.focus()
  }, [showPassword, owner])

  const postSuccess = async () => {
    // 先置 loading，免 ProtectedRoute 见旧 'unauthenticated' 而回弹 /login
    useAuthStore.getState().setStatus('loading')
    await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })
    const from = (location.state as LocationState | null)?.from?.pathname
    navigate(from ?? '/dashboard', { replace: true })
    toast.success('欢迎回来')
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return

    const username = owner?.username
    if (!username) {
      setErrorMsg('主人用户名无法获取')
      return
    }
    if (!password) {
      setErrorMsg('请输入密码')
      return
    }

    setSubmitting(true)
    setErrorMsg('')
    try {
      const res = await authClient.signIn.username({ username, password })
      if (res.error) {
        setErrorMsg(res.error.message ?? '登录失败')
        return
      }
      await postSuccess()
    } catch (err) {
      const msg = err instanceof Error ? err.message : '登录失败'
      setErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const onPasskey = async () => {
    if (submitting) return
    setSubmitting(true)
    setErrorMsg('')
    try {
      const res = await authClient.signIn.passkey()
      if (res?.error) {
        toast.error(res.error.message ?? 'Passkey 验证失败')
        return
      }
      await postSuccess()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Passkey 验证失败'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // 唯 passkey 可用且密码禁用时，自动触发一次
  const autoTriggeredRef = useRef(false)
  useEffect(() => {
    if (autoTriggeredRef.current) return
    if (allow && allow.password === false && allow.passkey === true) {
      autoTriggeredRef.current = true
      void onPasskey()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allow])

  return (
    <div className={rootStyle}>
      <div className={avatarStyle}>
        {owner?.avatar ? (
          <img className={avatarImg} src={owner.avatar} alt="" />
        ) : (
          <span>{initials(owner?.name ?? owner?.username)}</span>
        )}
      </div>

      {owner ? (
        <h1 className={nameStyle}>{owner.name ?? owner.username}</h1>
      ) : (
        <div className={skeletonStyle} aria-hidden />
      )}

      {showPassword && (
        <form className={formStyle} onSubmit={onSubmit}>
          <Input
            ref={inputRef}
            type="password"
            autoComplete="current-password"
            placeholder="输入密码"
            value={password}
            disabled={submitting}
            onChange={(e) => setPassword(e.target.value)}
            invalid={Boolean(errorMsg)}
          />
          <Button type="submit" intent="primary" loading={submitting}>
            登录
          </Button>
          <div className={errorStyle} role="alert">
            {errorMsg}
          </div>
        </form>
      )}

      {showPasskey && (
        <div className={altRowStyle}>
          <button
            type="button"
            className={altButtonStyle}
            disabled={submitting}
            onClick={onPasskey}
            aria-label="使用 Passkey 登录"
          >
            <KeyRound size={18} aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}

export default LoginPage
