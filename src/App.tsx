import { BrowserRouter } from 'react-router'

import { UIEffects } from './components/shared/UIEffects'
import { ModalHost, ToastViewport } from './components/ui'
import { AppRoutes } from './routes'

export const App = () => (
  <BrowserRouter>
    <UIEffects />
    <AppRoutes />
    <ModalHost />
    <ToastViewport />
  </BrowserRouter>
)
