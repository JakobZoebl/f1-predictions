import { useState, useEffect } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { supabase } from "@/lib/supabaseClient"

export interface SeasonStatsData {
  rank: number
  total_points: number
  avg_points: number
  points_behind_leader: number
  best_finish: string
  worst_finish: string
  accuracyBars: Record<string, number>
}
/*accuracyBars: { //Point breakdown showing which categories contribute to how much of the total points
Drivers
Teams
Bonus
*/

export function useSeasonStats() {
  const { user } = useAuth()
  const [seasonStats, setSeasonStats] = useState<SeasonStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSeasonStats = async () => {
      if (!user) {
         setLoading(false)
         return
      }
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const res = await fetch("/api/profile/season-stats", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const data = await res.json()
        if (data.success) {
          setSeasonStats(data.stats)
        }
      } catch (err) {
        console.error("Error fetching season stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSeasonStats()
  }, [user])

  return { seasonStats, loading }
}
