"use client"

import { useEffect, useState } from "react"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import F1Background from "@/frontend/components/team-driver-background"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import { RACES, TEAMS, DRIVERS } from "@/lib/f1-presets"
import "@/frontend/styles/RacePredictions.css"
import ReactCountryFlag from "react-country-flag"

interface RaceResult {
  Category: string
  Position: string
  Actual: string
  Predicted: string
  Points: string
  Team: string
  Details: string
}

export default function RaceResults() {
  const [results, setResults] = useState<RaceResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/data/race_results.csv")
      .then((res) => res.text())
      .then((text) => {
        const rows = text.split("\n").slice(1) // Skip header
        const parsed = rows.map((row) => {
           // Handle CSV parsing simply (assuming no commas in values)
           const [Category, Position, Actual, Predicted, Points, Team, Details] = row.split(",")
           return { Category, Position, Actual, Predicted, Points, Team: Team?.trim(), Details: Details?.trim() }
        }).filter(r => r.Category)
        setResults(parsed)
        setLoading(false)
      })
  }, [])

  // Derived data
  const top10 = results.filter((r) => r.Category === "RESULT")
  const bonus = results.filter((r) => r.Category === "BONUS")
  const leaderboard = results.filter((r) => r.Category === "LEADERBOARD")

  // Determine winning team/driver for background
  // Assuming P1 is the winner.
  const winnerRow = top10.find(r => r.Position === "1")
  const winnerDriverName = winnerRow?.Actual || "Max Verstappen"
  const winnerTeamName = winnerRow?.Team || "Red Bull Racing"

  // Find presets
  // Note: presets keys are lowercase
  const winnerDriverKey = Object.keys(DRIVERS).find(k => DRIVERS[k].name === winnerDriverName) || "verstappen"
  const winnerTeamKey = Object.keys(TEAMS).find(k => TEAMS[k].name === winnerTeamName) || "redbull"
  
  const winnerDriver = DRIVERS[winnerDriverKey]
  const winnerTeam = TEAMS[winnerTeamKey]

  // Find the race - Assuming Bahrain for the mock (id: bahrain)
  const race = RACES.find(r => r.id === "bahrain")

  if (loading) return <div className="text-white">Loading results...</div>

  return (
    <>
      <F1Background 
        teamColors={winnerTeam?.colors} 
        driverColors={winnerDriver?.colors}
      />
      <div className="relative z-10 min-h-screen flex flex-col">
         {/* Pass proper colors to header even if background is doing its thing? 
             Actually F1Header might need specific colors or transparent. 
             F1Background is fixed, so we just sit on top.
         */}
        <F1Header variant="Home" activeNav="Results" isAuthenticated={true} username="max_verstappen" />

        <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
             {/* Race Info - FeatureRace needs to be customized or we just pass the race */}
             <div className="rounded-lg overflow-hidden relative">
                 {/* We might want to overlay the "RESULTS" title like in the design */}
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/80 px-6 py-2 rounded text-white font-bold uppercase tracking-wider border border-white/20">
                     {race?.name} - RESULTS
                 </div>
                 {/* Score badge */}
                 <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 text-white text-sm bg-black/60 px-4 py-1 rounded backdrop-blur-sm">
                     Your Score: <span className="text-green-400 font-bold">87</span>/150 points 🎉 • Rank: <span className="text-yellow-400 font-bold">#3</span>
                 </div>
                 <FeatureRace race={race} className="!bg-transparent" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TOP 10 FINISH */}
                <section className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Top 10 Finish</h2>
                        <span className="text-white/70 text-sm">Your Score: 62/100</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-white/50 uppercase">
                                <tr>
                                    <th className="px-2 py-2">Pos</th>
                                    <th className="px-2 py-2">Actual Result</th>
                                    <th className="px-2 py-2">Your Prediction</th>
                                    <th className="px-2 py-2 text-right">Points</th>
                                </tr>
                            </thead>
                            <tbody className="text-white divide-y divide-white/5">
                                {top10.map((row) => (
                                    <tr key={row.Position} className="hover:bg-white/5 transition-colors">
                                        <td className="px-2 py-2 font-mono text-white/60">P{row.Position}</td>
                                        <td className="px-2 py-2 flex items-center gap-2">
                                            {/* Flag placeholder - hard to map from name without generic lookup, using 'NL' for max as default example */}
                                            {row.Actual.includes("Verstappen") && <ReactCountryFlag countryCode="NL" svg style={{width: '1.2em'}} />}
                                            {row.Actual.includes("Perez") && <ReactCountryFlag countryCode="MX" svg style={{width: '1.2em'}} />}
                                            {row.Actual.includes("Leclerc") && <ReactCountryFlag countryCode="MC" svg style={{width: '1.2em'}} />}
                                             {/* Fallback for others */}
                                            {!row.Actual.includes("Verstappen") && !row.Actual.includes("Perez") && !row.Actual.includes("Leclerc") && <span className="w-4 h-3 bg-gray-500 inline-block rounded-sm"></span>}
                                            {row.Actual}
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="flex items-center gap-2">
                                                 {/* Check/Cross based on points > 0 */}
                                                 {parseInt(row.Points) > 0 ? (
                                                     <ReactCountryFlag countryCode={row.Actual.includes("Verstappen") ? "NL" : "FR"} svg style={{width: '1.2em'}} /> 
                                                 ) : (
                                                     <ReactCountryFlag countryCode="GB" svg style={{width: '1.2em'}} />
                                                 )}
                                                <span className={parseInt(row.Points) > 0 ? "text-white" : "text-white/60"}>
                                                    {row.Predicted}
                                                </span>
                                                {parseInt(row.Points) > 0 && <span className="text-green-500 text-xs">✔</span>}
                                            </div>
                                        </td>
                                        <td className={`px-2 py-2 text-right font-bold ${parseInt(row.Points) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {parseInt(row.Points) > 0 ? `+${row.Points}` : 'X'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* BONUS PREDICTIONS */}
                <section className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Bonus Predictions</h2>
                        <span className="text-white/70 text-sm">Your Score: 25/50</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-white/50 uppercase">
                                <tr>
                                    <th className="px-2 py-2">Category</th>
                                    <th className="px-2 py-2">Actual</th>
                                    <th className="px-2 py-2">Predicted</th>
                                    <th className="px-2 py-2 text-right">Points</th>
                                </tr>
                            </thead>
                            <tbody className="text-white divide-y divide-white/5">
                                {bonus.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="px-2 py-2 flex items-center gap-2">
                                           {/* Icons */}
                                           {row.Position.includes("Pole") && <span>🏆</span>}
                                           {row.Position.includes("Fastest") && <span>⚡</span>}
                                           {row.Position.includes("Retirement") && <span>❌</span>}
                                           {row.Position.includes("Safety") && <span>🚗</span>}
                                           {row.Position.includes("Red") && <span>🚨</span>}
                                           {row.Position}
                                        </td>
                                        <td className="px-2 py-2">{row.Actual}</td>
                                        <td className="px-2 py-2 flex items-center gap-1">
                                            {row.Predicted}
                                            {parseInt(row.Points) > 0 ? (
                                                <span className="text-green-500">✔</span>
                                            ) : (
                                                <span className="text-red-500">✖</span>
                                            )}
                                        </td>
                                        <td className={`px-2 py-2 text-right font-bold ${parseInt(row.Points) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {parseInt(row.Points) > 0 ? `+${row.Points}` : '0'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
             </div>

             {/* RACE LEADERBOARD */}
            <section className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">Race Leaderboard (This Race Only)</h2>
                </div>
                 <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-white/50 uppercase">
                                <tr>
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">User</th>
                                    <th className="px-4 py-2 text-center">Points</th>
                                    <th className="px-4 py-2">Breakdown</th>
                                </tr>
                            </thead>
                            <tbody className="text-white divide-y divide-white/5">
                                {leaderboard.map((row) => (
                                    <tr key={row.Position} className={`hover:bg-white/5 transition-colors ${row.Team === '@username' ? 'bg-white/10' : ''}`}>
                                        <td className="px-4 py-3 text-white/70">{row.Position}</td>
                                        <td className="px-4 py-3 flex items-center gap-2 font-medium">
                                            {/* Random flags for users */}
                                            <ReactCountryFlag 
                                                countryCode={["BH", "NL", "MC", "BH", "IT"][parseInt(row.Position) - 1] || "US"} 
                                                svg 
                                                style={{width: '1.2em'}} 
                                            />
                                            {row.Team || "Unknown"}
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-lg">{row.Points}</td>
                                        <td className="px-4 py-3 text-xs md:text-sm text-white/70">
                                            {/* Mock breakdown */}
                                            <span className="text-green-400">23 points</span> Win (1-1 RVST) - Win +25 points
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </section>
        </main>

        <F1Footer primaryColor={winnerTeam.colors.primary} />
      </div>
    </>
  )
}
