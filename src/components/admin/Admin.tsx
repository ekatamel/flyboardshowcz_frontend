import { AdminLayout } from 'components/shared/AdminLayout'
import { AuthProvider } from 'context/AuthContext'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export const Admin = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/admin/rezervace')
  }, [navigate])

  return (
    <AuthProvider>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AuthProvider>
  )
}
