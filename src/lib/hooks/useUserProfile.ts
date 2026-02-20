import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"

export interface UserProfile {
  username: string
  display_name: string
  email: string
  favorite_team_id: string | null
  favorite_driver_id: string | null
  created_at?: string | null
}

interface UseUserProfileReturn {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Centralized hook to fetch and cache the current user's profile data.
 * 
 * Returns { profile, loading, error, refetch }.
 * Call `refetch()` after updating preferences to keep the cached profile in sync.
 */
export function useUserProfile(): UseUserProfileReturn {
  const { user, session, loading: authLoading } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (authLoading) return

    if (!session?.access_token) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json()

      if (data.success && data.profile) {
        const p = data.profile
        setProfile({
          username: p.username,
          display_name: p.display_name || "",
          email: p.email || user?.email || "",
          favorite_team_id: p.favorite_team_id,
          favorite_driver_id: p.favorite_driver_id,
          created_at: p.created_at,
        })
      } else {
        setError(data.error || "Failed to load profile.")
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err)
      setError("Failed to load profile data.")
    } finally {
      setLoading(false)
    }
  }, [session?.access_token, user?.email])

  // Fetch on mount / session change
  useEffect(() => {
    if (!authLoading) {
      fetchProfile()
    }
  }, [fetchProfile, authLoading])

  return { profile, loading, error, refetch: fetchProfile }
}
