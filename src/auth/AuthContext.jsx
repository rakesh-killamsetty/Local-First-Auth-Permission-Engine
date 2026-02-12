import React, { createContext, useContext, useEffect, useState } from 'react'

const AUTH_USER_KEY = 'local-first-auth-user'
const AUTH_USERS_KEY = 'local-first-auth-users'

const AuthContext = createContext(null)

function loadUsers() {
  try {
    const raw = window.localStorage.getItem(AUTH_USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Failed to read users from storage', err)
    return []
  }
}

function saveUsers(users) {
  try {
    window.localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('Failed to save users to storage', err)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  // Rehydrate current session user from localStorage on first load
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_USER_KEY)
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

  // Listen for cross-tab storage changes (Lifecycle Sync) for the active user
  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== AUTH_USER_KEY) return

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

  function register(username, password, role) {
    const trimmedUsername = username.trim()
    if (!trimmedUsername || !password || !role) {
      const error = new Error('Please fill in all fields.')
      error.code = 'VALIDATION'
      throw error
    }

    const users = loadUsers()
    const existing = users.find((u) => u.username === trimmedUsername)
    if (existing) {
      const error = new Error('That username is already taken.')
      error.code = 'USERNAME_TAKEN'
      throw error
    }

    const newUser = {
      username: trimmedUsername,
      password,
      role, // 'Admin' | 'Editor' | 'Viewer'
    }

    const updatedUsers = [...users, newUser]
    saveUsers(updatedUsers)

    // Automatically sign the user in after registration
    const authData = { username: trimmedUsername, role }
    setUser(authData)
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authData))
  }

  function login(username, password) {
    const trimmedUsername = username.trim()
    const users = loadUsers()
    const existing = users.find((u) => u.username === trimmedUsername)

    if (!existing || existing.password !== password) {
      const error = new Error('Invalid username or password.')
      error.code = 'INVALID_CREDENTIALS'
      throw error
    }

    const authData = {
      username: existing.username,
      role: existing.role,
    }

    setUser(authData)
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authData))
  }

  function logout() {
    setUser(null)
    window.localStorage.removeItem(AUTH_USER_KEY)
  }

  const value = {
    user,
    initializing,
    register,
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

