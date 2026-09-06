import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useAuth } from '../context/AuthContext'
import Spinner from '../components/common/Spinner'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (!loading && isAuthenticated && !isAdmin) {
      toast.error('Admins only. Access denied.')
    }
  }, [loading, isAuthenticated, isAdmin])

  if (loading) {
    return <Spinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}
