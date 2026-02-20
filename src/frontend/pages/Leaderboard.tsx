import { useState, useEffect } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { F1Header } from "@/frontend/components/f1-header"
import F1Background from "@/frontend/components/team-driver-background"
import { LeaderboardTable, type LeaderboardEntry } from "@/frontend/leaderboard/LeaderboardTable"
import { PointsHistoryChart, type UserPointsHistory } from "@/frontend/leaderboard/PointsHistoryChart"
import { SeasonStats } from "@/frontend/leaderboard/SeasonStats"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import { DRIVER_IMAGES } from "@/lib/driver-images"
import { TEAM_EMBLEMS } from "@/lib/team-emblems"

import { MOCK_LEADERBOARD_DATA, MOCK_POINTS_HISTORY } from "@/lib/mock-leaderboard-data"

export default function Leaderboard() {
  const { user } = useAuth()
  const { profile } = useUserProfile()

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [historyData, setHistoryData] = useState<UserPointsHistory[]>([])
  
  const isAuthenticated = !!user
  const displayUsername = profile?.username || user?.user_metadata?.username || "User"

  // Use user's favourite team/driver for background, with defaults
  const teamKey = (profile?.favorite_team_id && TEAMS[profile.favorite_team_id]) ? profile.favorite_team_id : "redbull"
  const driverKey = (profile?.favorite_driver_id && DRIVERS[profile.favorite_driver_id]) ? profile.favorite_driver_id : "verstappen"

  const team = TEAMS[teamKey]
  const driver = DRIVERS[driverKey]

  useEffect(() => {
    // Simulate API fetch
    const loadData = async () => {
        // In reality: await fetch('/api/leaderboard')
        setLeaderboardData(MOCK_LEADERBOARD_DATA)
        setHistoryData(MOCK_POINTS_HISTORY)
    }
    loadData()
  }, [])

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
        <F1Background
            teamColors={team.colors}
            driverColors={driver.colors}
            driverLogoUrl={DRIVER_IMAGES[driverKey]}
            teamLogoUrl={TEAM_EMBLEMS[teamKey]}
        />
        
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
