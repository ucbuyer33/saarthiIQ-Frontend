import axios from 'axios'
import { getToken, clearToken } from './auth'
import { API_BASE_URL } from './constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle 401 globally — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ==================
// AUTH ENDPOINTS
// ==================
export const authAPI = {
  login:    (data)   => api.post('/auth/login', new URLSearchParams(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }),
  register: (data)   => api.post('/auth/register', data),
}

// ==================
// USER ENDPOINTS
// ==================
export const usersAPI = {
  getMe:   ()     => api.get('/users/me'),
  update:  (data) => api.put('/users/me', data),
  getAll:  ()     => api.get('/users'),
  getById: (id)   => api.get(`/users/${id}`),
  delete:  (id)   => api.delete(`/users/${id}`),
}

// ==================
// CANDIDATE ENDPOINTS
// ==================
export const candidatesAPI = {
  getAll:    (params) => api.get('/candidates', { params }),
  getById:   (id)     => api.get(`/candidates/${id}`),
  create:    (data)   => api.post('/candidates', data),
  update:    (id, data) => api.put(`/candidates/${id}`, data),
  delete:    (id)     => api.delete(`/candidates/${id}`),
  search:    (q)      => api.get('/search', { params: { q } }),
}

// ==================
// RESUME ENDPOINTS
// ==================
export const resumeAPI = {
  upload:     (candidateId, file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/resume/upload/${candidateId}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  getAll:     (candidateId) => api.get(`/resume/${candidateId}`),
  parse:      (resumeId)    => api.post(`/parser/parse/${resumeId}`),
  score:      (resumeId)    => api.post(`/resume-score/score/${resumeId}`),
  jobMatch:   (data)        => api.post('/job-match/match', data),
}

// ==================
// AI ENDPOINTS
// ==================
export const aiAPI = {
  skillGap:   (candidateId) => api.post(`/skill-gap/analyze/${candidateId}`),
  aiReport:   (candidateId) => api.post(`/ai-report/generate/${candidateId}`),
}

// ==================
// INTERVIEW ENDPOINTS
// ==================
export const interviewsAPI = {
  getAll:    (params) => api.get('/interviews', { params }),
  getById:   (id)     => api.get(`/interviews/${id}`),
  create:    (data)   => api.post('/interviews', data),
  update:    (id, data) => api.put(`/interviews/${id}`, data),
  delete:    (id)     => api.delete(`/interviews/${id}`),
}

// ==================
// CAMPAIGN ENDPOINTS
// ==================
export const campaignsAPI = {
  getAll:  (params) => api.get('/campaigns', { params }),
  getById: (id)     => api.get(`/campaigns/${id}`),
  create:  (data)   => api.post('/campaigns', data),
  update:  (id, data) => api.put(`/campaigns/${id}`, data),
  delete:  (id)     => api.delete(`/campaigns/${id}`),
}

// ==================
// TASK ENDPOINTS
// ==================
export const tasksAPI = {
  getAll:  (params) => api.get('/tasks', { params }),
  create:  (data)   => api.post('/tasks', data),
  update:  (id, data) => api.put(`/tasks/${id}`, data),
  delete:  (id)     => api.delete(`/tasks/${id}`),
}

// ==================
// DASHBOARD & ANALYTICS
// ==================
export const dashboardAPI = {
  getSummary:  () => api.get('/dashboard/summary'),
  getAnalytics:() => api.get('/analytics/overview'),
}

// ==================
// NOTES ENDPOINTS
// ==================
export const notesAPI = {
  getAll:  (candidateId) => api.get(`/notes/${candidateId}`),
  create:  (data)        => api.post('/notes', data),
  delete:  (id)          => api.delete(`/notes/${id}`),
}

// ==================
// AUDIT ENDPOINTS
// ==================
export const auditAPI = {
  getAll:  (params) => api.get('/audit', { params }),
}
