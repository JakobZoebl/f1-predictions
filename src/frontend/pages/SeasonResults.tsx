"use client"

import { useEffect, useState} from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import { Top10Drivers } from "@/frontend/results/Top10Drivers"
import { Top5Constructors } from "@/frontend/results/Top5Constructors"
import { BonusResults } from "@/frontend/results/BonusResults"
import type { RaceResult } from "@/frontend/results/utils"
import { PageLoader } from "@/frontend/components/PageLoader"
import { Info } from "lucide-react"
import "@/frontend/styles/RacePredictions.css"

// Max scores for season (must match API)
const SEASON_DRIVER_MAX = 250 + 180 + 150 + 120 + 100 + 80 + 60 + 40 + 20 + 10 + 12 * 10 // 1130
const SEASON_CONSTRUCTOR_MAX = 250 + 180 + 150 + 120 + 100 + 6 * 10 // 860
const SEASON_BONUS_MAX = 25 + 25 + 25 // 75
const SEASON_TOTAL_MAX = SEASON_DRIVER_MAX + SEASON_CONSTRUCTOR_MAX + SEASON_BONUS_MAX

export default function SeasonResults() {
  const { user, session } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile()

  const isAuthenticated = !!user
  const displayUsername = profile?.username || user?.user_metadata?.username || "User"

  const [results, setResults] = useState<RaceResult[]>([])
  const [seasonYear, setSeasonYear] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const headers: HeadersInit = {}
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`
    }

    fetch("/api/results/season", { headers })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.error("Failed to load season results:", data.error)
          setLoading(false)
          return
        }
        setResults(data.results || [])
        setSeasonYear(data.season ?? null)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching season results:", err)
        setLoading(false)
      })
  }, [session?.access_token])

  const drivers = results.filter((r) => r.Category === "RESULT")
  const constructors = results.filter((r) => r.Category === "CONSTRUCTOR")
  const bonus = results.filter((r) => r.Category === "BONUS")
  const leaderboardRows = results.filter((r) => r.Category === "LEADERBOARD")

  const driverScore = drivers.reduce((acc, row) => acc + parseInt(row.Points || "0"), 0)
  const constructorScore = constructors.reduce((acc, row) => acc + parseInt(row.Points || "0"), 0)
  const bonusScore = bonus.reduce((acc, row) => acc + parseInt(row.Points || "0"), 0)

  const currentUserRow = leaderboardRows.find((r) => r.Team === displayUsername)
  const userRank = currentUserRow ? parseInt(currentUserRow.Position) : undefined
  const userScore = currentUserRow
    ? parseInt(currentUserRow.Points)
    : driverScore + constructorScore + bonusScore

  if (loading || profileLoading) return <PageLoader />

  return (
    <>
      <div className="relative z-10 min-h-screen flex flex-col">
        <F1Header
          variant="Home"
          activeNav="SeasonResults"
          isAuthenticated={isAuthenticated}
          username={displayUsername}
        />

        <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
          {/* Season Results Hero */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <span className="upcoming-label whitespace-nowrap">Season Results</span>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {seasonYear != null && (
                <span className="font-bold uppercase tracking-wider text-white/90">
                  {seasonYear} Championship
                </span>
              )}
            </div>
            <div className="race-results-score mt-4">
              <div className="race-results-score-item">
                <span className="race-results-score-value text-f1-neon">{userScore}</span>
                <span className="race-results-score-label">/ {SEASON_TOTAL_MAX} pts</span>
              </div>
              {userRank != null && (
                <div className="race-results-rank-badge border-f1-neon/60 text-f1-neon">
                  #{userRank} this season
                </div>
              )}
            </div>
            <h2 className="race-title-large leading-tight mt-2">
              Season Results
            </h2>
          </div>

          {/* Preliminary Results Disclaimer */}
          {new Date() < new Date(new Date().getFullYear(), 11, 7) && (
            <div className="disclaimer-banner">
              <Info className="disclaimer-banner-icon" />
              <p className="disclaimer-banner-text">
                <strong>Preliminary Results:</strong> 
                The standings shown here are currently based on live championship data. These points 
                do not yet count towards your total user profile points and will only be finalized 
                once the season has officially concluded and the final standings are confirmed.
              </p>
            </div>
          )}

          {/* MAIN GRID: Left = All 22 Drivers, Right = 11 Constructors + 3 Bonus */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Top10Drivers
              results={drivers}
              score={driverScore}
              maxScore={SEASON_DRIVER_MAX}
              title="All 22 Drivers"
            />
            <div className="flex flex-col gap-6 h-full">
              <Top5Constructors
                results={constructors}
                score={constructorScore}
                maxScore={SEASON_CONSTRUCTOR_MAX}
                title="All 11 Constructors"
              />
              <BonusResults
                results={bonus}
                score={bonusScore}
                maxScore={SEASON_BONUS_MAX}
              />
            </div>
          </div>

        </main>

        <F1Footer />
      </div>
    </>
  )
}