// saarthiIQ-Frontend\src\context\AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getToken, saveToken, clearToken, decodeToken, isTokenExpired } from '@/lib/auth'
import { usersAPI } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => getToken())
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    clearToken()
    setToken(null)
    setUser(null)
    setRole(null)
    setLoading(false)
  }, [])

  const loadUser = useCallback(async (tkn) => {
    try {
      const res = await usersAPI.getMe()
      const data = res.data?.data || res.data
      setUser(data)
      const decoded = decodeToken(tkn)
      setRole(data?.role || decoded?.role || 'user')
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    const tkn = getToken()
    if (tkn && !isTokenExpired(tkn)) {
      setToken(tkn)
      loadUser(tkn)
    } else {
      clearToken()
      setLoading(false)
    }
  }, [loadUser])

  const login = async (tokenStr) => {
    saveToken(tokenStr)
    setToken(tokenStr)
    await loadUser(tokenStr)
  }

  const hasRole = (...roles) => roles.includes(role)
  const isAuth = !!token && !isTokenExpired(token)

  return (
    <AuthContext.Provider value={{ user, token, role, loading, isAuth, login, logout, hasRole, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}