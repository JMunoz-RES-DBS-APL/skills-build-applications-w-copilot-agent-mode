const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api'
const resourceUrls = {
  activities: codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : `${apiBaseUrl}/activities/`,
  leaderboard: codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : `${apiBaseUrl}/leaderboard/`,
  teams: codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : `${apiBaseUrl}/teams/`,
  users: codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : `${apiBaseUrl}/users/`,
  workouts: codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : `${apiBaseUrl}/workouts/`,
}

export function getApiUrl(resource) {
  const normalizedResource = resource.replace(/^\/+|\/+$/g, '')
  return resourceUrls[normalizedResource] || `${apiBaseUrl}/${normalizedResource}/`
}

function extractRecords(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  for (const key of ['results', 'items', 'docs', 'data']) {
    const value = payload[key]
    if (Array.isArray(value)) {
      return value
    }
    if (value && typeof value === 'object') {
      const records = extractRecords(value)
      if (records.length > 0) {
        return records
      }
    }
  }

  return []
}

export async function fetchCollection(resource, { signal } = {}) {
  const response = await fetch(getApiUrl(resource), {
    headers: { Accept: 'application/json' },
    signal,
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with status ${response.status}`)
  }

  return extractRecords(payload)
}