import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function RoleRoute({ roles }) {
  const { role } = useAuth()
  return roles.includes(role) ? <Outlet /> : <Navigate to="/dashboard" replace />
}
