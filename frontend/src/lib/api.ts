import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  profile: () => api.get('/auth/profile'),
}

export const candidatesApi = {
  getAll: () => api.get('/candidates'),
  getById: (id: string) => api.get(`/candidates/${id}`),
  update: (id: string, data: any) => api.patch(`/candidates/${id}`, data),
  delete: (id: string) => api.delete(`/candidates/${id}`),
}

export const invitationsApi = {
  getAll: () => api.get('/invitations'),
  getById: (id: string) => api.get(`/invitations/${id}`),
  create: (data: any) => api.post('/invitations', data),
}

export default api