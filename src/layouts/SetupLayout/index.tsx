import { Outlet } from 'react-router'

import { env } from '~/constants/env'

import { bgStyle, cardStyle, overlayStyle, rootStyle } from './SetupLayout.css'

export const SetupLayout = () => {
  const bgImage = env.loginBg
  return (
    <div className={rootStyle}>
      {bgImage ? (
        <div
          aria-hidden
          className={bgStyle}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      ) : null}
      <div aria-hidden className={overlayStyle} />
      <div className={cardStyle}>
        <Outlet />
      </div>
    </div>
  )
}
