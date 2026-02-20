import { useState, useEffect } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { F1Header } from "@/frontend/components/f1-header"
import { LeaderboardTable, type LeaderboardEntry } from "@/frontend/leaderboard/LeaderboardTable"
import { PointsHistoryChart, type UserPointsHistory } from "@/frontend/leaderboard/PointsHistoryChart"
import { SeasonStats } from "@/frontend/leaderboard/SeasonStats"
import { supabase } from "@/lib/supabaseClient"
import { PageLoader } from "@/frontend/components/PageLoader"
import { useBackground } from "@/frontend/components/BackgroundContext"

export default function Leaderboard() {
  const { user } = useAuth()
  const { profile, loading } = useUserProfile()
  const { setBackgroundConfig } = useBackground()

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [historyData, setHistoryData] = useState<UserPointsHistory[]>([])
  
  const isAuthenticated = !!user
  const displayUsername = profile?.username || user?.user_metadata?.username || "User"

  useEffect(() => {
    const loadData = async () => {
        try {
            // Fetch Leaderboard
            const { data: lbData, error: lbError } = await supabase
                .from('leaderboard')
                .select(`
                    rank,
                    user_id,
                    total_points,
                    users (username, display_name)
                `)
                .order('rank', { ascending: true })

            if (lbError) throw lbError

      if (lbData) {
        const formattedLbData: LeaderboardEntry[] = lbData.map(entry => {
          const user = (Array.isArray(entry.users) ? entry.users[0] : entry.users) as Record<string, string> | null;
          return {
            rank: entry.rank || 0,
            userId: entry.user_id,
            username: user?.username || 'Unknown',
            displayName: user?.display_name || user?.username || 'Unknown',
            points: entry.total_points || 0,
            movement: 0, // Placeholder
          }
        })
        setLeaderboardData(formattedLbData)

        // Find leader and apply their background
        const leader = lbData.find(e => e.rank === 1)
        if (leader) {
          const userObj = (Array.isArray(leader.users) ? leader.users[0] : leader.users) as Record<string, any>
          if (userObj?.favorite_team_id || userObj?.favorite_driver_id) {
            setBackgroundConfig({
              type: "team-driver",
              teamId: userObj.favorite_team_id,
              driverId: userObj.favorite_driver_id
            })
          }
        }
      }

      // Fetch Points History
      const { data: ptData, error: ptError } = await supabase
        .from('points_log')
        .select(`
          user_id,
          total_points,
          session_type,
          users (username),
          races (round, name)
        `)
        .order('created_at', { ascending: true })

      if (ptError) throw ptError

      if (ptData) {
        const userHistoryMap = new Map<string, UserPointsHistory>()
        const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"]
        let colorIndex = 0
        const runningTotals = new Map<string, number>()

        ptData.forEach(log => {
          const userId = log.user_id
          const userArr = (Array.isArray(log.users) ? log.users[0] : log.users) as Record<string, string> | null;
          const username = userArr?.username || "Unknown"
          const raceArr = (Array.isArray(log.races) ? log.races[0] : log.races) as Record<string, string | number> | null;
          const round = Number(raceArr?.round) || 0;
          const raceName = String(raceArr?.name || `Round ${round}`);
          const points = log.total_points || 0

          if (!userHistoryMap.has(userId)) {
            userHistoryMap.set(userId, {
              userId,
              username,
              color: colors[colorIndex % colors.length],
              history: []
            })
            colorIndex++
            runningTotals.set(userId, 0)
          }

          const currentTotal = runningTotals.get(userId)! + points
          runningTotals.set(userId, currentTotal)

          // We only push to graph if it's not a generic season bonus to avoid messy overlapping for the same round,
          // or we group by round. For simplicity we'll just push sequential events.
          userHistoryMap.get(userId)!.history.push({
            round,
            raceName: log.session_type === 'sprint' ? `${raceName} Sprint` : raceName,
            points,
            cumulativePoints: currentTotal
          })
        })

        const historyArray = Array.from(userHistoryMap.values())
        historyArray.forEach(u => u.history.sort((a, b) => a.round - b.round))
        setHistoryData(historyArray)
      }

    } catch (error) {
      console.error("Error loading leaderboard data:", error)
    }
  }
  loadData()
}, [setBackgroundConfig])

  if (loading) return <PageLoader />

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
        
        <div className="relative z-10 flex min-h-screen flex-col">
            <F1Header variant="Home" activeNav="Leaderboard" isAuthenticated={isAuthenticated} username={displayUsername} />
            <div className="container mx-auto px-4 py-8 space-y-8">
                <LeaderboardTable data={leaderboardData} />
                <PointsHistoryChart data={historyData} />
                <SeasonStats />
            </div>
        </div>
    </main>
  )
}
