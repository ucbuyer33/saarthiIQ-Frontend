// saarthiIQ-Frontend\src\router\RoleRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function RoleRoute({ roles }) {
  const { role, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return roles.includes(role) ? <Outlet /> : <Navigate to="/dashboard" replace />
}
