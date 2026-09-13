const API_BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData
  const headers = isFormData
    ? { ...(options.headers || {}) }
    : { 'Content-Type': 'application/json', ...(options.headers || {}) }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || body.message || `Request failed (${response.status})`)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const api = {
  getIssues: () => request('/api/issues'),
  getStats: () => request('/api/dashboard/stats'),
  createIssue: (payload) => request('/api/issues', { method: 'POST', body: JSON.stringify(payload) }),
  markAffected: (ticketCode) => request(`/api/issues/${ticketCode}/affected`, { method: 'POST' }),
  updateStatus: (ticketCode, status) => request(`/api/issues/${ticketCode}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  assignIssue: (ticketCode, assignedTo) => request(`/api/issues/${ticketCode}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedTo }),
  }),
  addAdminNote: (ticketCode, adminNotes) => request(`/api/issues/${ticketCode}/admin-note`, {
    method: 'PATCH',
    body: JSON.stringify({ adminNotes }),
  }),
  endorseIssue: (ticketCode, facultyName, endorsementNote) => request(`/api/issues/${ticketCode}/endorse`, {
    method: 'PATCH',
    body: JSON.stringify({ facultyName, endorsementNote }),
  }),
  deleteIssue: (ticketCode) => request(`/api/issues/${ticketCode}`, {
    method: 'DELETE',
  }),
  getAnnouncements: () => request('/api/announcements'),
  createAnnouncement: (payload) => request('/api/announcements', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  deleteAnnouncement: (id) => request(`/api/announcements/${id}`, {
    method: 'DELETE',
  }),
  uploadPhoto: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request('/api/upload', {
      method: 'POST',
      body: formData,
    })
  },
  login: (credentials) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  chat: (message) => request('/api/chat', { method: 'POST', body: JSON.stringify({ message }) }),
}

