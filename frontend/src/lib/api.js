const API_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Something went wrong')
  }

  if (response.status === 204) return null
  return response.json()
}

export const api = {
  getProjects: () => request('/projects'),
  getProject: (slug) => request(`/projects/${slug}`),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  getAdminProjects: () => request('/admin/projects'),
  createProject: (project) => request('/admin/projects', { method: 'POST', body: JSON.stringify(project) }),
  updateProject: (id, project) => request(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(project) }),
  deleteProject: (id) => request(`/admin/projects/${id}`, { method: 'DELETE' }),
  sendMessage: (message) => request('/contact', { method: 'POST', body: JSON.stringify(message) }),
  getMessages: () => request('/admin/messages'),
}

