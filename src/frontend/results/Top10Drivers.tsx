import { DRIVERS, TEAMS } from "@/lib/f1-presets"
import { findDriver, type RaceResult } from "./utils"

interface Top10DriversProps {
  results: RaceResult[]
  score?: number
  maxScore?: number
}

export function Top10Drivers({ results, score = 0, maxScore = 152 }: Top10DriversProps) {
  return (
    <section className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 h-full flex flex-col">
        <div className="prediction-section-title">
            <h2>Top 10 Drivers</h2>
            <span className="max-pts">Your Score: {score}/{maxScore}</span>
        </div>

        <div className="flex flex-col gap-1">
            {/* Header row */}
            <div className="grid grid-cols-[2rem_1fr_1fr_3rem] gap-2 px-2 pb-2 border-b border-white/10 text-xs text-white/50 uppercase">
                <span>Pos</span>
                <span>Actual</span>
                <span>Predicted</span>
                <span className="text-right">Pts</span>
            </div>

            {results.map((row) => {
                const pts = parseInt(row.Points)
                const actualKey = DRIVERS[row.Actual] ? row.Actual : findDriver(row.Actual)
                const predictedKey = DRIVERS[row.Predicted] ? row.Predicted : findDriver(row.Predicted)
                const actualDriver = actualKey ? DRIVERS[actualKey] : null
                const predictedDriver = predictedKey ? DRIVERS[predictedKey] : null
                const actualTeam = actualDriver ? TEAMS[actualDriver.team] : null
                const predictedTeam = predictedDriver ? TEAMS[predictedDriver.team] : null

                return (
                    <div
                        key={row.Position}
                        className="grid grid-cols-[2rem_1fr_1fr_3rem] gap-2 items-center px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        {/* Position */}
                        <span className="font-mono text-xs text-white/50 font-bold">P{row.Position}</span>

                        {/* Actual driver */}
                        <div className="dnd-slot-driver">
                            <div
                                className="team-accent"
                                style={{ backgroundColor: actualDriver?.colors.primary ?? '#555' }}
                            />
                            <div className="driver-info">
                                <span className="driver-name">{actualDriver?.name || row.Actual || '—'}</span>
                                {actualTeam && <span className="driver-team">{actualTeam.name}</span>}
                            </div>
                        </div>

                        {/* Predicted driver */}
                        <div className={`dnd-slot-driver ${pts === 0 ? 'opacity-50' : ''}`}>
                            <div
                                className="team-accent"
                                style={{ backgroundColor: predictedDriver?.colors.primary ?? '#555' }}
                            />
                            <div className="driver-info">
                                <span className="driver-name">{predictedDriver?.name || row.Predicted || '—'}</span>
                                {predictedTeam && <span className="driver-team">{predictedTeam.name}</span>}
                            </div>
                            {pts > 0 && <span className="text-green-500 text-xs ml-1">✔</span>}
                        </div>

                        {/* Points */}
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
