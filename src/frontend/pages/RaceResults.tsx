"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import { hexToHsl } from "@/lib/utils"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import { RACES } from "@/lib/f1-presets"
import { LeaderboardTable, type LeaderboardEntry } from "@/frontend/leaderboard/LeaderboardTable"
import { Top10Drivers } from "@/frontend/results/Top10Drivers"
import { Top5Constructors } from "@/frontend/results/Top5Constructors"
import { BonusResults } from "@/frontend/results/BonusResults"
import type { RaceResult } from "@/frontend/results/utils"
import { PageLoader } from "@/frontend/components/PageLoader"
import { useBackground } from "@/frontend/components/BackgroundContext"
import "@/frontend/styles/RacePredictions.css"

export default function RaceResults() {
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile()

  const isAuthenticated = !!user
  const displayUsername = profile?.username || user?.user_metadata?.username || "User"

  const [results, setResults] = useState<RaceResult[]>([])
  const [loading, setLoading] = useState(true)

  const { setBackgroundConfig } = useBackground()

  useEffect(() => {
    fetch("/data/race_results.csv")
      .then((res) => res.text())
      .then((text) => {
        const rows = text.split(/\r?\n/).slice(1) // Skip header, handle CRLF
        const parsed = rows.map((row) => {
           // Handle CSV parsing simply (assuming no commas in values)
           const [Category, Position, Actual, Predicted, Points, Team, Details] = row.split(",")
           return { Category, Position, Actual, Predicted, Points, Team: Team?.trim(), Details: Details?.trim() }
        }).filter(r => r.Category)
        setResults(parsed)
        
        // Find winner to set background
        const winner = parsed.find(r => r.Category === "RESULT" && r.Position === "1")
        if (winner && winner.Actual) {
          // Normalize names for presets
          const driverKey = winner.Actual.toLowerCase().replace(/\s+/g, "")
          const teamKey = winner.Team?.toLowerCase().replace(/\s+/g, "") || ""
          
          setBackgroundConfig({
            type: "team-driver",
            driverId: driverKey,
            teamId: teamKey
          })
        }
        
        setLoading(false)
      })
  }, [setBackgroundConfig])

  // Derived data
  const top10 = results.filter((r) => r.Category === "RESULT")
  const constructors = results.filter((r) => r.Category === "CONSTRUCTOR")
  const bonus = results.filter((r) => r.Category === "BONUS")
  const leaderboardRows = results.filter((r) => r.Category === "LEADERBOARD")

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
        movement: 0, // no trend data in per-race results
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results])

  // Find the race - Assuming Bahrain for the mock (id: bahrain)
  const race = RACES.find(r => r.id === "bahrain")
  const primaryColor = race?.colors?.primary

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
        <F1Header variant="Home" activeNav="Results" isAuthenticated={isAuthenticated} username={displayUsername} primaryColor={primaryColor} />

        <main 
            className="container mx-auto px-4 py-8 space-y-8 flex-1"
            style={accentStyle}
        >
             {/* Race Info */}
             <FeatureRace
                 race={race}
                 className="!bg-transparent"
                 resultsMode
                 userScore={87}
                 userMaxScore={150}
                 userRank={3}
             />

             {/* MAIN GRID: Left = Top 10 Drivers, Right = Split (Constructors + Bonus) */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT COL: TOP 10 DRIVERS */}
                <Top10Drivers results={top10} score={62} maxScore={100} />

                {/* RIGHT COL: CONSTRUCTORS + BONUS */}
                <div className="flex flex-col gap-6 h-full">
                    <Top5Constructors results={constructors} score={40} maxScore={100} />
                    <BonusResults results={bonus} score={25} maxScore={50} />
                </div>
             </div>

             {/* RACE LEADERBOARD */}
             <LeaderboardTable
                 data={leaderboardEntries}
                 title="Race Leaderboard"
                 currentUserId="username"
             />
        </main>

        <F1Footer primaryColor={primaryColor} />
      </div>
    </>
  )
}
