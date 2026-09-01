/**
 * Main router configuration
 */

import { Navigate } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout/AppLayout'
import { HomePage } from '@/pages/HomePage/HomePage'
import { ErrorPage } from '@/pages/ErrorPage/ErrorPage'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import { AllEmployeesPage } from '@/pages/AllEmployeesPage/AllEmployeesPage'
import { CampaignsStubPage } from '@/pages/CampaignsStubPage/CampaignsStubPage'
import { FunctionalRolesRoute } from '@/components/FunctionalRolesRoute/FunctionalRolesRoute'
import {
  EmployeeFunctionalRolesRoute,
  EmployeeProfileRoute,
} from '@/components/EmployeeProfileRoute/EmployeeProfileRoute'
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
        path: 'employees',
        element: <AllEmployeesPage />,
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
        element: <CampaignsStubPage />,
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
