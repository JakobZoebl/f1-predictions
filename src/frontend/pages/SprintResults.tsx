"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import { hexToHsl } from "@/lib/utils"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import { DRIVERS } from "@/lib/f1-presets"
import { LeaderboardTable, type LeaderboardEntry } from "@/frontend/leaderboard/LeaderboardTable"
import { Top10Drivers } from "@/frontend/results/Top10Drivers"
import { Top5Constructors } from "@/frontend/results/Top5Constructors"
import { BonusResults } from "@/frontend/results/BonusResults"
import type { RaceResult } from "@/frontend/results/utils"
import { PageLoader } from "@/frontend/components/PageLoader"
import { useBackground } from "@/frontend/components/BackgroundContext"
import { useLastSprint } from "@/lib/hooks/useLastSprint"
import "@/frontend/styles/RacePredictions.css"

export default function SprintResults() {
  const { user, session } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile()

  const isAuthenticated = !!user
  const displayUsername = profile?.username || user?.user_metadata?.username || "User"

  const [results, setResults] = useState<RaceResult[]>([])
  const [loading, setLoading] = useState(true)

  const lastSprint = useLastSprint()

  const { setBackgroundConfig, resetToDefault } = useBackground()

  // Reset background configuration on unmount
  useEffect(() => {
    return () => {
      resetToDefault()
    }
  }, [resetToDefault])

  useEffect(() => {
    const headers: HeadersInit = {}
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`
    }

    fetch("/api/results/last-sprint", { headers })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.error("Failed to load sprint results:", data.error)
          setLoading(false)
          return
        }

        const parsed = data.results || []
        setResults(parsed)
        
        // Find winner to set background
        const winner = parsed.find((r: RaceResult) => r.Category === "RESULT" && r.Position === "1")
        if (winner && winner.Actual) {
          const winnerDriver = DRIVERS[winner.Actual]
          if (winnerDriver) {
            setBackgroundConfig({
              type: "team-driver",
              driverId: winner.Actual,
              teamId: winnerDriver.team
            })
          }
        }
        
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching sprint results:", err)
        setLoading(false)
      })
  }, [setBackgroundConfig, session?.access_token])

  // Derived data
  const top8 = results.filter((r) => r.Category === "RESULT")
  const constructors = results.filter((r) => r.Category === "CONSTRUCTOR")
  const bonus = results.filter((r) => r.Category === "BONUS")
  const leaderboardRows = results.filter((r) => r.Category === "LEADERBOARD")

  const top8Score = top8.reduce((acc, row) => acc + parseInt(row.Points || "0"), 0)
  const constructorScore = constructors.reduce((acc, row) => acc + parseInt(row.Points || "0"), 0)
  const bonusScore = bonus.reduce((acc, row) => acc + parseInt(row.Points || "0"), 0)

  const currentUserRow = leaderboardRows.find(r => r.Team === displayUsername)
  const userRank = currentUserRow ? parseInt(currentUserRow.Position) : undefined
  const userScore = currentUserRow ? parseInt(currentUserRow.Points) : (top8Score + constructorScore + bonusScore)

  // Map CSV rows to LeaderboardEntry for the shared LeaderboardTable component
  const leaderboardEntries = useMemo<LeaderboardEntry[]>(() => {
    return leaderboardRows.map((row) => {
      const username = (row.Team || "unknown").replace(/^@/, "")
      return {
        rank: parseInt(row.Position) || 0,
        userId: username,
        username,
        displayName: row.Team || "Unknown",
        points: parseInt(row.Points) || 0,
        movement: 0, // no trend data in per-sprint results
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results])

  // Find the sprint
  const sprint = lastSprint ?? undefined
  const primaryColor = sprint?.colors?.primary

  // Calculate dynamic style for prediction elements
  const accentStyle = primaryColor 
    ? (() => {
        const hsl = hexToHsl(primaryColor);
        if (hsl) {
          // Define the H S L values for the CSS variable
          return { '--prediction-accent': `${hsl.h} ${hsl.s}% ${hsl.l}%` } as React.CSSProperties;
        }
        return {};
      })()
    : {};

  if (loading || profileLoading) return <PageLoader />

  return (
    <>
      <div className="relative z-10 min-h-screen flex flex-col">
         {/* Pass proper colors to header even if background is doing its thing? 
             Actually F1Header might need specific colors or transparent. 
             F1Background is fixed, so we just sit on top.
         */}
        <F1Header variant="Home" activeNav="SprintResults" primaryColor={primaryColor} isAuthenticated={isAuthenticated} username={displayUsername} />

        <main 
            className="container mx-auto px-4 py-8 space-y-8 flex-1"
            style={accentStyle}
        >
             {/* Sprint Info */}
             <FeatureRace
                 race={sprint}
                 className="!bg-transparent"
                 resultsMode
                 userScore={userScore}
                 userMaxScore={106}
                 userRank={userRank}
             />

             {/* MAIN GRID: Left = Top 8 Drivers, Right = Split (Constructors + Bonus) */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT COL: TOP 8 DRIVERS */}
                <Top10Drivers results={top8} score={top8Score} maxScore={36} title="Top 8 Sprint Drivers" />

                {/* RIGHT COL: CONSTRUCTORS + BONUS */}
                <div className="flex flex-col gap-6 h-full">
                    <Top5Constructors results={constructors} score={constructorScore} maxScore={30} />
                    <BonusResults results={bonus} score={bonusScore} maxScore={40} />
                </div>
             </div>

             {/* SPRINT LEADERBOARD */}
             <LeaderboardTable
                 data={leaderboardEntries}
                 title="Sprint Leaderboard"
                 currentUserId="username"
             />
        </main>

        <F1Footer primaryColor={primaryColor} />
      </div>
    </>
  )
}
