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
import {
  EmployeeFunctionalRolesRoute,
  EmployeeProfileRoute,
} from '@/components/EmployeeProfileRoute/EmployeeProfileRoute'
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute'
import { EmployeesPage } from '@/pages/EmployeesPage/EmployeesPage'

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
        path: 'employees',
        element: <EmployeesPage />,
      },
      {
        path: 'employees/:employeeId',
        element: <EmployeeProfileRoute />,
      },
      {
        path: 'employees/:employeeId/functional-roles',
        element: <EmployeeFunctionalRolesRoute />,
      },
      {
        path: 'admin/roles',
        element: <FunctionalRolesRoute />,
      },
      {
        path: 'campaigns',
        element: (
          <div className="p-6 text-muted-foreground" data-testid="campaigns-stub">
            Campaigns (coming soon)
          </div>
        ),
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
