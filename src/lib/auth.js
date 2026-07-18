import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'saarthiiq_token'
const USER_KEY  = 'saarthiiq_user'

export function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export function decodeToken(token) {
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  return decoded.exp * 1000 < Date.now()
}

export function getRoleFromToken(token) {
  const decoded = decodeToken(token)
  return decoded?.role || decoded?.sub_role || 'user'
}

export function isAuthenticated() {
  const token = getToken()
  if (!token) return false
  return !isTokenExpired(token)
}
