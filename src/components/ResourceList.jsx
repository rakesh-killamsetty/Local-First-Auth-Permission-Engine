import React from 'react'
import ResourceItem from './ResourceItem'

function ResourceList({
  title,
  resources,
  userRole,
  onArchive,
  onRestore,
  onDelete,
}) {
  return (
    <section className="card resource-list">
      <div className="resource-list-header">
        <h3>{title}</h3>
      </div>
      {resources.length === 0 ? (
        <p className="muted-text">No resources to display.</p>
      ) : (
        <ul className="resource-list-items">
          {resources.map((resource) => (
            <ResourceItem
              key={resource.id}
              resource={resource}
              userRole={userRole}
              onArchive={onArchive}
              onRestore={onRestore}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default ResourceList

