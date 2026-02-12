import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('Viewer')
  const [error, setError] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const trimmedUsername = username.trim()
    if (!trimmedUsername || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      register(trimmedUsername, password, role)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed.')
    }
  }

  return (
    <section className="page page-login">
      <div className="card form-card">
        <h2>Create an account</h2>
        <p className="muted-text">
          Register a user with a role to experience the permission system.
        </p>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label className="field-label" htmlFor="reg-username">
              Username
            </label>
            <input
              id="reg-username"
              className="field-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alice"
            />
          </div>
          <div className="form-row">
            <label className="field-label" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
            />
          </div>
          <div className="form-row">
            <label className="field-label" htmlFor="reg-confirm-password">
              Confirm password
            </label>
            <input
              id="reg-confirm-password"
              className="field-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type your password"
            />
          </div>
          <div className="form-row">
            <label className="field-label" htmlFor="reg-role">
              Role
            </label>
            <select
              id="reg-role"
              className="field-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Viewer">Viewer</option>
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
        </form>
        {error && <p className="error-text">{error}</p>}
        <p className="muted-text small-text">
          Already have an account? <Link to="/login">Sign in</Link>.
        </p>
      </div>
    </section>
  )
}

export default RegisterPage

