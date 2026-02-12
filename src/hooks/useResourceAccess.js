import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { roleRank } from '../data/resources'
import { useAuth } from '../auth/AuthContext'

// Custom hook that:
// 1. Filters resources based on the current user's role (Persistence Filter).
// 2. If a user manually types a URL for a resource they are not allowed to see,
//    redirects them back to the dashboard.

export function useResourceAccess(allResources) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const params = useParams()

  const filteredResources = useMemo(() => {
    if (!user) return []
    return allResources.filter((resource) => {
      return roleRank(user.role) >= roleRank(resource.minRoleRequired)
    })
  }, [allResources, user])

  // URL guard: if current resource requires a higher role than the user has,
  // navigate away.
  useEffect(() => {
    if (!params.id) return
    const resource = allResources.find((r) => r.id === params.id)
    if (!resource) return

    if (!user || roleRank(user.role) < roleRank(resource.minRoleRequired)) {
      navigate('/', { replace: true })
    }
  }, [allResources, navigate, params.id, user])

  return filteredResources
}

