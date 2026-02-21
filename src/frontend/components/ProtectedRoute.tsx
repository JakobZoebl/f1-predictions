import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/frontend/auth/AuthContext"
import { PageLoader } from "@/frontend/components/PageLoader"

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <PageLoader />
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
