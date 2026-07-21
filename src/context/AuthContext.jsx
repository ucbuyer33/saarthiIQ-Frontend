// saarthiIQ-Frontend\src\context\AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getToken, saveToken, clearToken, isTokenExpired } from '@/lib/auth'
import { usersAPI } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => getToken())
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    clearToken()
    setToken(null)
    setUser(null)
    setLoading(false)
  }, [])

  const loadUser = useCallback(async () => {
    try {
      const res = await usersAPI.getMe()
      const data = res.data?.data || res.data
      setUser(data)
      return data
    } catch {
      logout()
      return null
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    const tkn = getToken()
    if (tkn && !isTokenExpired(tkn)) {
      setToken(tkn)
      loadUser()
    } else {
      clearToken()
      setLoading(false)
    }
  }, [loadUser])

  const login = async (tokenStr) => {
    saveToken(tokenStr)
    setToken(tokenStr)
    const loadedUser = await loadUser()
    return loadedUser
  }

  const isAuth = !!token && !isTokenExpired(token)

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuth, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
