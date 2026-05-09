import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { bootPersistence, queryClient } from './lib/query-client'
import './styles/reset.css'
import './styles/global.css'

bootPersistence()

const loader = document.getElementById('initial-loader')
loader?.remove()

const showDevtools = new URLSearchParams(location.search).has('__devtools')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
)
