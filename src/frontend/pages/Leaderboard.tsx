import { useState, useEffect } from "react"
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
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [historyData, setHistoryData] = useState<UserPointsHistory[]>([])
  
  // In a real app, you'd find the leader from the data
  // For now, we assume the leader is Max Verstappen (mock data index 0) and hardcode his preferences
  // or normally we would have { favoriteTeam: 'redbull', favoriteDriver: 'verstappen' } in the user profile
  const teamKey = "redbull"
  const driverKey = "verstappen"

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
            <F1Header variant="Home" activeNav="Leaderboard" isAuthenticated={true} username="max_verstappen" />
            <div className="container mx-auto px-4 py-8 space-y-8">
                <LeaderboardTable data={leaderboardData} />
                <PointsHistoryChart data={historyData} />
                <SeasonStats />
            </div>
        </div>
    </main>
  )
}
