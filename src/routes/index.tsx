import { Navigate, Route, Routes } from 'react-router'

import { DesignTokensPage } from '~/pages/_dev/design'
import { PrimitivesPage } from '~/pages/_dev/primitives'

export const AppRoutes = () => (
  <Routes>
    <Route path="/_dev/design" element={<DesignTokensPage />} />
    <Route path="/_dev/primitives" element={<PrimitivesPage />} />
    <Route path="*" element={<Navigate to="/_dev/design" replace />} />
  </Routes>
)
