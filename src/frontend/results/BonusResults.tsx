import { DRIVERS, TEAMS } from "@/lib/f1-presets"
import { findDriver, type RaceResult } from "./utils"

interface BonusResultsProps {
  results: RaceResult[]
  score?: number
  maxScore?: number
}

export function BonusResults({ results, score = 0, maxScore = 41 }: BonusResultsProps) {
  return (
    <section className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 flex-1 flex flex-col">
        <div className="prediction-section-title">
            <h2>Bonus Predictions</h2>
            <span className="max-pts">Your Score: {score}/{maxScore}</span>
        </div>

        <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left h-full">
                <thead className="text-xs text-white/50 uppercase">
                    <tr>
                        <th className="px-2 py-2">Category</th>
                        <th className="px-2 py-2">Actual</th>
                        <th className="px-2 py-2">Predicted</th>
                        <th className="px-2 py-2 text-right">Pts</th>
                    </tr>
                </thead>
                <tbody className="text-white divide-y divide-white/5">
                    {results.map((row, idx) => {
                        const pts = parseInt(row.Points)
                        const isDriverRow = ["pole_position", "fastest_lap", "first_retirement", "most_poles", "most_fastest_laps", "most_retirements"].some(k => row.Position.includes(k))

                        const renderDriverCell = (name: string, faded: boolean) => {
                            const key = DRIVERS[name] ? name : findDriver(name)
                            const driver = key ? DRIVERS[key] : null
                            const team = driver ? TEAMS[driver.team] : null
                            if (!key) return <span className={faded ? 'opacity-50' : ''}>{name || '—'}</span>
                            return (
                                <div className={`dnd-slot-driver ${faded ? 'opacity-50' : ''}`}>
                                    <div className="team-accent" style={{ backgroundColor: driver?.colors.primary ?? '#555' }} />
                                    <div className="driver-info">
                                        <span className="driver-name">{driver?.name || name}</span>
                                        {team && <span className="driver-team">{team.name}</span>}
                                    </div>
                                </div>
                            )
                        }

                        return (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-2 py-2">
                               <span className="capitalize">{row.Position.replace(/_/g, ' ')}</span>
                            </td>
                            <td className="px-2 py-2">
                                {isDriverRow ? renderDriverCell(row.Actual, false) : row.Actual}
                            </td>
                            <td className="px-2 py-2">
                                {isDriverRow ? renderDriverCell(row.Predicted, pts === 0) : (
                                    <span className={pts === 0 ? 'opacity-50' : ''}>{row.Predicted}</span>
                                )}
                            </td>
                            <td className={`px-2 py-2 text-right font-bold ${pts > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {pts > 0 ? `+${row.Points}` : '0'}
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </section>
  )
}
