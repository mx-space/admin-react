import { BrowserRouter } from 'react-router'

import { ModalHost, ToastViewport } from './components/ui'
import { AppRoutes } from './routes'

export const App = () => (
  <BrowserRouter>
    <AppRoutes />
    <ModalHost />
    <ToastViewport />
  </BrowserRouter>
)
