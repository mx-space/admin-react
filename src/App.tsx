import { useEffect } from 'react'
import { BrowserRouter } from 'react-router'

import { migrateLegacyPostsListDisplay } from './atoms/posts'
import { UIEffects } from './components/shared/UIEffects'
import { ModalHost, Tooltip, ToastViewport } from './components/ui'
import { keymapManager } from './lib/keymap'
import { AppRoutes } from './routes'

export const App = () => {
  useEffect(() => keymapManager.attach(), [])
  useEffect(() => {
    migrateLegacyPostsListDisplay()
  }, [])
  return (
    <BrowserRouter>
      <Tooltip.Provider delay={300} closeDelay={100}>
        <UIEffects />
        <AppRoutes />
        <ModalHost />
        <ToastViewport />
      </Tooltip.Provider>
    </BrowserRouter>
  )
}
