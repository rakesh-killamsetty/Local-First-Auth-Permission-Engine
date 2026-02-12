import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!initializing && !user) {
      // If user is not logged in, kick them back to /login
      navigate('/login', { replace: true })
    }
  }, [initializing, user, navigate])

  if (initializing) {
    return <p>Restoring your session...</p>
  }

  if (!user) {
    // Navigation will occur via useEffect
    return null
  }

  return children
}

export default ProtectedRoute

