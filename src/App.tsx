import { ChakraProvider } from '@chakra-ui/react'
import { Admin } from 'components/admin/Admin'
import { AdminReservations } from 'components/admin/AdminReservations'
import { AdminSettings } from 'components/admin/AdminSettings'
import { AdminVouchers } from 'components/admin/AdminVouchers'
import { Login } from 'components/auth/Login'
import { Registration } from 'components/auth/Registration'
import { LessonReservationForm } from 'components/reservations/LessonReservationForm'
import { ProtectedRoute } from 'components/shared/ProtectedRoute'
import { VoucherPurchaseForm } from 'components/voucher-purchase-form/VoucherPuchaseForm'
import { Intro } from 'components/voucher-purchase/Intro'
import { Success } from 'components/voucher-purchase/Success'
import { ApiAccessProvider } from 'context/APIAccessContext'
import { AuthProvider } from 'context/AuthContext'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import theme from 'styles/theme'
import './index.css'

import { PaymentOrigin } from 'types/types'

import { initGA, trackPageView } from './analytics'

import { AdminCustomers } from 'components/admin/AdminCustomers'
import { AdminLessons } from 'components/admin/AdminLessons'

function App() {
  const queryClient = new QueryClient()

  // Custom Router
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Intro />,
    },
    {
      path: '/success',
      element: <Success origin={PaymentOrigin.ORDER} />,
    },
    {
      path: '/success_reservation',
      element: <Success origin={PaymentOrigin.RESERVATION} />,
    },
    {
      path: '/nakup-voucheru',
      element: <VoucherPurchaseForm />,
    },
    {
      path: '/rezervace',
      element: <LessonReservationForm />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/registrace',
      element: <Registration />,
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      ),
      children: [
        { path: 'vouchery', element: <AdminVouchers /> },
        { path: 'rezervace', element: <AdminReservations /> },
        { path: 'nastaveni', element: <AdminSettings /> },
        { path: 'zakaznici', element: <AdminCustomers /> },
        { path: 'lekce', element: <AdminLessons /> },
      ],
    },
  ])

  // Track Page Views
  useEffect(() => {
    initGA()
  }, [])

  useEffect(() => {
    const location = window.location.pathname + window.location.search
    trackPageView(location)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ApiAccessProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ApiAccessProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
