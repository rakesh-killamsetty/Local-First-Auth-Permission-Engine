import React, { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'local-first-auth-user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  // Rehydrate from localStorage on first load
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.role) {
          setUser(parsed)
        }
      }
    } catch (err) {
      console.error('Failed to read auth from storage', err)
    } finally {
      setInitializing(false)
    }
  }, [])

  // Listen for cross-tab storage changes (Lifecycle Sync)
  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== STORAGE_KEY) return

      if (!event.newValue) {
        // User cleared storage or logged out in another tab
        setUser(null)
        return
      }

      try {
        const parsed = JSON.parse(event.newValue)
        setUser(parsed)
      } catch (err) {
        console.error('Failed to parse auth from storage event', err)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  function login(username, role) {
    const authData = {
      username,
      role, // 'Admin' | 'Editor' | 'Viewer'
    }

    setUser(authData)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authData))
  }

  function logout() {
    setUser(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    user,
    initializing,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

