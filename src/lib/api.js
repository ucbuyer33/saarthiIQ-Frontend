// src/lib/api.js
import axios from 'axios'
import { getToken, clearToken } from './auth'
import { API_BASE_URL } from './constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const is401 = error.response?.status === 401
    const isLoginRequest =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register')

    if (is401 && !isLoginRequest) {
      clearToken()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api

export const authAPI = {
  login: (data) => api.post('/auth/login', new URLSearchParams(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }),
  register: (data) => api.post('/auth/register', data),
}

export const usersAPI = {
  getMe: () => api.get('/auth/me'),
  update: (data) => api.patch('/auth/me', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  logoutEverywhere: () => api.post('/auth/logout-everywhere'),
}

export const sessionsAPI = {
  getAll: () => api.get('/auth/sessions'),
  revoke: (sessionId) => api.delete(`/auth/sessions/${sessionId}`),
  revokeAll: () => api.post('/auth/logout-everywhere'),
}

export const candidatesAPI = {
  getAll: (params) => api.get('/candidates', { params }),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (data) => api.post('/candidates', data),
  update: (id, data) => api.put(`/candidates/${id}`, data),
  delete: (id) => api.delete(`/candidates/${id}`),
  search: (q) => api.get('/search', { params: { q } }),
}

export const resumeAPI = {
  upload: (candidateId, file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/resume/upload/${candidateId}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  bulkUpload: (files) => {
    const form = new FormData()
    files.forEach((file) => form.append('files', file))
    return api.post('/resume/bulk-upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getByCandidate: (candidateId) => api.get(`/resume/${candidateId}`),
  download: (resumeId) => api.get(`/resume/download/${resumeId}`),
  parse: (resumeId) => api.post(`/parser/parse/${resumeId}`),
  score: (resumeId) => api.post(`/resume-score/${resumeId}`),
  jobMatch: (data) => api.post('/job-match/match', data),
}

export const aiAPI = {
  // Use candidate-based endpoints so SkillGap page can work from Candidate ID.
  skillGap: (candidateId) => api.post(`/skill-gap/by-candidate/${candidateId}`),
  aiReport: (candidateId) => api.post(`/ai-report/by-candidate/${candidateId}`),
}

export const interviewsAPI = {
  getAll: () => api.get('/interviews'),
  getByCandidate: (candidateId) => api.get(`/interviews/${candidateId}`),
  create: (candidateId, data) => api.post(`/interviews/${candidateId}`, data),
  update: (id, data) => api.put(`/interviews/${id}`, data),
  delete: (id) => api.delete(`/interviews/${id}`),
}

export const campaignsAPI = {
  getAll: (params) => api.get('/campaigns', { params }),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
}

export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
}

export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/'),
  getAnalytics: () => api.get('/analytics/dashboard'),
}

export const notesAPI = {
  getAll: (candidateId) => api.get(`/notes/${candidateId}`),
  create: (candidateId, data) => api.post(`/notes/${candidateId}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
}

export const auditAPI = {
  getAll: (params) => api.get('/audit', { params }),
}
