import { useAuth } from 'context/AuthContext'
import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser } = useAuth()

  if (!currentUser || !currentUser.access_token) {
    return <Navigate to='/login' replace />
  }
  return <>{children}</>
}
