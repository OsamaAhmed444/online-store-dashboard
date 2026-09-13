import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useAuth } from '../context/AuthContext'
import { SessionLoadingScreen } from '../components/common/Spinner'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [showSessionLoader, setShowSessionLoader] = useState(true)

  useEffect(() => {
    if (!loading) {
      const frame = requestAnimationFrame(() => setShowSessionLoader(false))
      return () => cancelAnimationFrame(frame)
    }
    setShowSessionLoader(true)
  }, [loading])

  useEffect(() => {
    if (!loading && isAuthenticated && !isAdmin) {
      toast.error('Admins only. Access denied.')
    }
  }, [loading, isAuthenticated, isAdmin])

  if (loading || showSessionLoader) {
    return <SessionLoadingScreen visible={loading || showSessionLoader} />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}

  }

  return children
}
