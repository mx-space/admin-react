import { Spinner } from '~/components/ui/Button/Spinner'

import { fallbackStyle } from './RouteFallback.css'

export const RouteFallback = () => (
  <div className={fallbackStyle} role="status" aria-live="polite">
    <Spinner size="md" />
  </div>
)
