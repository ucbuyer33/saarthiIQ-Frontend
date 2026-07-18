// saarthiIQ-Frontend\src\router\PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function PrivateRoute() {
  const { isAuth, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>; 
  }

  // 2. Once loading is finished, if isAuth is true, proceed.
  // Otherwise, kick them to login.
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />
}