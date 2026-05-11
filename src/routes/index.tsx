import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import { RouteFallback } from '~/components/shared/RouteFallback'
import { AppShell } from '~/layouts/AppShell'
import { SetupLayout } from '~/layouts/SetupLayout'
import { DesignTokensPage } from '~/pages/_dev/design'
import { PrimitivesPage } from '~/pages/_dev/primitives'

import { ProtectedRoute } from './ProtectedRoute'
import { SetupGuard } from './SetupGuard'

const LoginPage = lazy(() => import('~/pages/login'))
const SetupPage = lazy(() => import('~/pages/setup'))
const SetupApiPage = lazy(() => import('~/pages/setup-api'))
const DashboardPage = lazy(() => import('~/pages/dashboard'))
const PostsViewPage = lazy(() => import('~/pages/posts/view'))
const PostsEditPage = lazy(() => import('~/pages/posts/edit'))

const NotFoundPage = () => (
  <main style={{ padding: 32 }}>
    <h1>404</h1>
    <p>Not found.</p>
  </main>
)

export const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      {/* dev surfaces — public, kept until P1 finalises */}
      <Route path="/_dev/design" element={<DesignTokensPage />} />
      <Route path="/_dev/primitives" element={<PrimitivesPage />} />

      {/* public auth surfaces */}
      <Route element={<SetupLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<SetupGuard />}>
          <Route path="/setup" element={<SetupPage />} />
        </Route>
        <Route path="/setup-api" element={<SetupApiPage />} />
      </Route>

      {/* authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/posts/view" element={<PostsViewPage />} />
          <Route path="/posts/edit" element={<PostsEditPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
)
