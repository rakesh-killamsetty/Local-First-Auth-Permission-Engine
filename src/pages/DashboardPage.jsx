import React, { useEffect, useState } from 'react'
import { fetchResourcesWithDelay } from '../data/resources'
import { useAuth } from '../auth/AuthContext'
import ResourceList from '../components/ResourceList'

function DashboardPage() {
  const { user, logout } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulated API fetch with delay (Day 2 requirement)
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchResourcesWithDelay().then((data) => {
      if (!cancelled) {
        setResources(data)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  function updateResourceStatus(id, newStatus) {
    // Complex state update: nested object inside array, immutable.
    setResources((prev) =>
      prev.map((resource) => {
        if (resource.id !== id) return resource
        return {
          ...resource,
          meta: {
            ...resource.meta,
            status: newStatus,
            lastUpdatedAt: new Date().toISOString(),
          },
        }
      })
    )
  }

  function handleArchive(id) {
    updateResourceStatus(id, 'archived')
  }

  function handleRestore(id) {
    updateResourceStatus(id, 'active')
  }

  function handleDelete(id) {
    // Only admins should be able to see the delete button, but we defend here too.
    if (!user || user.role !== 'Admin') return
    setResources((prev) => prev.filter((resource) => resource.id !== id))
  }

  const activeResources = resources.filter(
    (resource) => resource.meta.status === 'active'
  )
  const archivedResources = resources.filter(
    (resource) => resource.meta.status === 'archived'
  )

  return (
    <section className="page page-dashboard">
      <header className="dashboard-header">
        <div className="user-chip">
          <span className="user-initial">
            {user.username.charAt(0).toUpperCase()}
          </span>
          <div className="user-meta">
            <span className="user-name">{user.username}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
        <button type="button" className="btn btn-secondary" onClick={logout}>
          Log out
        </button>
      </header>

      <div className="page-heading">
        <h2>Resource Dashboard</h2>
        <p>View, archive, and manage resources according to your role.</p>
      </div>

      {loading ? (
        <p className="muted-text">Loading resources...</p>
      ) : (
        <div className="dashboard-content">
          <ResourceList
            title="Active Resources"
            resources={activeResources}
            userRole={user.role}
            onArchive={handleArchive}
            onRestore={handleRestore}
            onDelete={handleDelete}
          />
          <ResourceList
            title="Archived Resources"
            resources={archivedResources}
            userRole={user.role}
            onArchive={handleArchive}
            onRestore={handleRestore}
            onDelete={handleDelete}
          />
        </div>
      )}
    </section>
  )
}

export default DashboardPage

