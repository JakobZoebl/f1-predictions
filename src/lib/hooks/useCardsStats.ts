import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export interface CardsStats {
  constructor: {
    standingsPos: number | string
    standingsPoints: number
    seasonStats: { wins: number; podiums: number; poles: number }
    recentResults: string[]
  }
  driver: {
    standingsPos: number | string
    standingsPoints: number
    seasonStats: { wins: number; podiums: number; poles: number }
    recentResults: string[]
  }
}

export function useCardsStats(teamId: string, driverId: string) {
  const [stats, setStats] = useState<CardsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      if (!teamId || !driverId) return
      
      setLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setError("Not authenticated")
          setLoading(false)
          return
        }

        const res = await fetch(`/api/profile/cards-stats?team_id=${teamId}&driver_id=${driverId}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        })
        
        const json = await res.json()
        if (json.success && json.data) {
          setStats(json.data)
        } else {
          setError(json.error || "Failed to fetch stats")
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError(String(err))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [teamId, driverId])

  return { stats, loading, error }
}
