/**
 * Main router configuration
 */

import { Navigate } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout/AppLayout'
import { HomePage } from '@/pages/HomePage/HomePage'
import { ErrorPage } from '@/pages/ErrorPage/ErrorPage'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import { FunctionalRolesRoute } from '@/components/FunctionalRolesRoute/FunctionalRolesRoute'
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/app-error',
    element: (
      <ProtectedRoute>
        <ErrorPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'admin/roles',
        element: <FunctionalRolesRoute />,
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export const Router = () => {
  return <RouterProvider router={router} />
}
