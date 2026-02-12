import React from 'react'
import { Link } from 'react-router-dom'
import { roleRank } from '../data/resources'

function ResourceItem({ resource, userRole, onArchive, onRestore, onDelete }) {
  const canView = roleRank(userRole) >= roleRank(resource.minRoleRequired)
  const isArchived = resource.meta.status === 'archived'

  return (
    <li className="resource-item">
      <div className="resource-item-main">
        <div className="resource-item-header">
          <strong className="resource-name">{resource.name}</strong>
          {!canView && <span className="locked-badge">Locked</span>}
        </div>
        <div className="resource-meta">
          <span className="meta-label">
            Minimum role: <span className="meta-value">{resource.minRoleRequired}</span>
          </span>
          <span
            className={
              'status-pill ' +
              (resource.meta.status === 'archived'
                ? 'status-pill-archived'
                : 'status-pill-active')
            }
          >
            {resource.meta.status}
          </span>
        </div>
      </div>
      <div className="resource-actions">
        {canView && (
          <Link className="link-button" to={`/resources/${resource.id}`}>
            Open
          </Link>
        )}
        {!isArchived && (userRole === 'Admin' || userRole === 'Editor') && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onArchive(resource.id)}
          >
            Archive
          </button>
        )}
        {isArchived && (userRole === 'Admin' || userRole === 'Editor') && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onRestore(resource.id)}
          >
            Restore
          </button>
        )}
        {userRole === 'Admin' && (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(resource.id)}
          >
            Delete
          </button>
        )}
      </div>
    </li>
  )
}

export default ResourceItem

