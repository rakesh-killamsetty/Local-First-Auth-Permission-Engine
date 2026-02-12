import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!username.trim()) {
      setError('Please enter your username.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    try {
      login(username.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed.')
    }
  }

  return (
    <section className="page page-login">
      <div className="card form-card">
        <h2>Sign in to your workspace</h2>
        <p className="muted-text">
          Sign in with your registered account to see role-based permissions.
        </p>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="field-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alice"
            />
          </div>
          <div className="form-row">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Log in
            </button>
          </div>
        </form>
        {error && <p className="error-text">{error}</p>}
        <p className="muted-text small-text">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one now</Link>.
        </p>
      </div>
    </section>
  )
}

export default LoginPage

