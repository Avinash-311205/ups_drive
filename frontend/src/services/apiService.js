const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('eda_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`)
  }

  return data
}