import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('Viewer')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    if (!username.trim()) {
      return
    }
    login(username.trim(), role)
    navigate('/', { replace: true })
  }

  return (
    <section className="page page-login">
      <div className="card form-card">
        <h2>Sign in to your workspace</h2>
        <p className="muted-text">
          Choose a role to see how permissions change what you can do.
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
            <label className="field-label" htmlFor="role">
              Role
            </label>
            <select
              id="role"
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
              Log in
            </button>
          </div>
        </form>
        <p className="muted-text">
          This is a local-only authentication demo. Your role is stored in
          localStorage and restored on refresh and across tabs.
        </p>
      </div>
    </section>
  )
}

export default LoginPage

