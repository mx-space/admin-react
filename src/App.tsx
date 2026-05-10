import { BrowserRouter } from 'react-router'

import { UIEffects } from './components/shared/UIEffects'
import { ModalHost, Tooltip, ToastViewport } from './components/ui'
import { AppRoutes } from './routes'

export const App = () => (
  <BrowserRouter>
    <Tooltip.Provider delay={300} closeDelay={100}>
      <UIEffects />
      <AppRoutes />
      <ModalHost />
      <ToastViewport />
    </Tooltip.Provider>
  </BrowserRouter>
)
