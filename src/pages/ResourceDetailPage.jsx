import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MOCK_RESOURCES } from '../data/resources'
import { useAuth } from '../auth/AuthContext'
import { useResourceAccess } from '../hooks/useResourceAccess'

function ResourceDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [allResources] = useState(MOCK_RESOURCES)

  // This hook both filters and guards direct URL access based on role.
  const accessibleResources = useResourceAccess(allResources)

  const [resource, setResource] = useState(null)

  useEffect(() => {
    const found = allResources.find((r) => r.id === id)
    setResource(found || null)
  }, [allResources, id])

  const canSeeDetails =
    resource &&
    user &&
    accessibleResources.some((r) => r.id === resource.id)

  if (!resource) {
    return <p>Resource not found.</p>
  }

  if (!canSeeDetails) {
    // The user will typically already have been redirected by useResourceAccess,
    // but this keeps the UI safe.
    return <p>You are not allowed to view this resource.</p>
  }

  return (
    <section className="page page-detail">
      <div className="card detail-card">
        <h2>{resource.name}</h2>
        <p className="muted-text">{resource.description}</p>
        <dl className="detail-grid">
          <div className="detail-row">
            <dt>Minimum role</dt>
            <dd>{resource.minRoleRequired}</dd>
          </div>
          <div className="detail-row">
            <dt>Status</dt>
            <dd>{resource.meta.status}</dd>
          </div>
          <div className="detail-row">
            <dt>Category</dt>
            <dd>{resource.meta.category}</dd>
          </div>
          <div className="detail-row">
            <dt>Last updated</dt>
            <dd>{new Date(resource.meta.lastUpdatedAt).toLocaleString()}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

export default ResourceDetailPage

