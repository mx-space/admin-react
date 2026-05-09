import { useNavigate } from 'react-router'

import { Button } from '~/components/ui'
import type { UserModel } from '~/models'
import { useAuthStore } from '~/stores'

const LoginPage = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  const onDevSignIn = () => {
    const fake = {
      id: 'dev',
      username: 'dev',
      name: 'Dev User',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    } as unknown as UserModel
    setUser(fake)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '-0.3px',
          }}
        >
          登录
        </h1>
        <p
          style={{
            marginTop: 6,
            marginBottom: 0,
            fontSize: '13px',
            color: 'var(--ink-subtle, #8a8f98)',
          }}
        >
          真表单（username / password / passkey）落于 spec 06 P1.5。
        </p>
      </div>
      {import.meta.env.DEV && (
        <Button intent="primary" onClick={onDevSignIn}>
          Sign in (dev)
        </Button>
      )}
    </div>
  )
}

export default LoginPage
