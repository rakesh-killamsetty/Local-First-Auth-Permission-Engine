// Mock JSON-like resource data
// Each resource has a minimum role required to view full details.

export const ROLE_ORDER = ['Viewer', 'Editor', 'Admin']

export function roleRank(role) {
  const index = ROLE_ORDER.indexOf(role)
  return index === -1 ? -1 : index
}

export const MOCK_RESOURCES = [
  {
    id: '1',
    name: 'Production Server Config',
    description: 'Critical settings for the production environment.',
    minRoleRequired: 'Admin',
    meta: {
      status: 'active', // active | archived
      category: 'Infrastructure',
      lastUpdatedAt: '2026-02-10T12:00:00.000Z',
    },
  },
  {
    id: '2',
    name: 'Content Pipeline',
    description: 'Steps required to publish new content.',
    minRoleRequired: 'Editor',
    meta: {
      status: 'active',
      category: 'Workflow',
      lastUpdatedAt: '2026-02-11T08:30:00.000Z',
    },
  },
  {
    id: '3',
    name: 'Public Documentation',
    description: 'Resources visible to all authenticated users.',
    minRoleRequired: 'Viewer',
    meta: {
      status: 'active',
      category: 'Docs',
      lastUpdatedAt: '2026-02-09T17:45:00.000Z',
    },
  },
  {
    id: '4',
    name: 'Legacy Archive',
    description: 'Archived resources kept for legal reasons.',
    minRoleRequired: 'Admin',
    meta: {
      status: 'archived',
      category: 'Archive',
      lastUpdatedAt: '2025-12-31T23:59:59.000Z',
    },
  },
]

// Simulated API fetch with delay for Day 2 "loading" practice
export function fetchResourcesWithDelay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_RESOURCES)
    }, 700)
  })
}

