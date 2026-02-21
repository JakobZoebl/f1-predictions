import { TEAMS } from "@/lib/f1-presets"
import { findTeam, type RaceResult } from "./utils"

interface Top5ConstructorsProps {
  results: RaceResult[]
  score?: number
  maxScore?: number
}

export function Top5Constructors({ results, score = 0, maxScore = 70 }: Top5ConstructorsProps) {
  return (
    <section className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 flex-1 flex flex-col">
        <div className="prediction-section-title">
            <h2>Top 5 Constructors</h2>
            <span className="max-pts">Your Score: {score}/{maxScore}</span>
        </div>

        <div className="flex flex-col gap-1 flex-1">
            {/* Header row */}
            <div className="grid grid-cols-[2rem_1fr_1fr_3rem] gap-2 px-2 pb-2 border-b border-white/10 text-xs text-white/50 uppercase">
                <span>Pos</span>
                <span>Actual</span>
                <span>Predicted</span>
                <span className="text-right">Pts</span>
            </div>

            {results.map((row) => {
                const pts = parseInt(row.Points)
                const actualKey = TEAMS[row.Actual] ? row.Actual : findTeam(row.Actual)
                const predictedKey = TEAMS[row.Predicted] ? row.Predicted : findTeam(row.Predicted)
                const actualTeam = actualKey ? TEAMS[actualKey] : null
                const predictedTeam = predictedKey ? TEAMS[predictedKey] : null

                return (
                    <div
                        key={row.Position}
                        className="grid grid-cols-[2rem_1fr_1fr_3rem] gap-2 items-center px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <span className="font-mono text-xs text-white/50 font-bold">P{row.Position}</span>
                        
                        <div className="dnd-slot-driver">
                            <div className="team-accent" style={{ backgroundColor: actualTeam?.colors.primary ?? '#555' }} />
                            <div className="driver-info">
                                <span className="driver-name">{actualTeam?.name || row.Actual || '—'}</span>
                            </div>
                        </div>

                        <div className={`dnd-slot-driver ${pts === 0 ? 'opacity-50' : ''}`}>
                            <div className="team-accent" style={{ backgroundColor: predictedTeam?.colors.primary ?? '#555' }} />
                            <div className="driver-info">
                                <span className="driver-name">{predictedTeam?.name || row.Predicted || '—'}</span>
                            </div>
                            {pts > 0 && <span className="text-green-500 text-xs ml-1">✔</span>}
                        </div>

                        <span className={`text-right text-xs font-bold ${pts > 0 ? 'text-green-400' : 'text-red-400/60'}`}>
                            {pts > 0 ? `+${row.Points}` : '0'}
                        </span>
                    </div>
                )
            })}
        </div>
    </section>
  )
}
