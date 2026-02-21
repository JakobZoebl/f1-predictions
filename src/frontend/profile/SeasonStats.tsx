import { type SeasonStatsData } from "@/lib/hooks/useSeasonStats"
import "@/frontend/styles/SeasonStats.css"

interface SeasonStatsProps {
  data: SeasonStatsData
}

export function SeasonStats({ data }: SeasonStatsProps) {
  return (
    <div className="season-stats-wrapper">
      <div className="season-stats-panel">
        <h3 className="season-stats-title">
          Your Season Stats
        </h3>

        <div className="season-stats-grid">
            {/* Left Column: General Stats */}
            <div className="season-stats-column">
                <div className="stat-card">
                    <div>
                        <div className="stat-card-label">Overall Rank</div>
                        <div className="stat-card-value">{data.rank}</div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-label">Total Points</div>
                        <div className="stat-card-value-highlight">{data.total_points}</div>
                    </div>
                </div>

                <div className="stat-mini-cards">
                     <div className="stat-mini-card">
                        <div className="stat-mini-label">Points Behind Leader</div>
                        <div className="stat-mini-value">-</div>
                     </div>
                     <div className="stat-mini-card">
                        <div className="stat-mini-label">Avg Points/Race</div>
                        <div className="stat-mini-value">{data.avg_points ? Number(data.avg_points).toFixed(1) : 0}</div>
                     </div>
                </div>

                <div className="stat-mini-cards" style={{ marginTop: '0.5rem' }}>
                     <div className="stat-mini-card">
                        <div className="stat-mini-label">Best Race</div>
                        <div className="stat-mini-value">{data.best_finish}</div>
                     </div>
                     <div className="stat-mini-card">
                        <div className="stat-mini-label">Worst Race</div>
                        <div className="stat-mini-value">{data.worst_finish}</div>
                     </div>
                </div>
            </div>

            {/* Right Column: Prediction Accuracy Bars */}
            <div className="accuracy-section">
                <h4 className="accuracy-title">Prediction Accuracy Breakdown</h4>
                
                {Object.entries(data.accuracyBars).map(([key, val]) => (
                    <div key={key} className="group">
                        <div className="accuracy-bar-labels">
                            <span className="accuracy-bar-name">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="accuracy-bar-percent">{val}%</span>
                        </div>
                        <div className="accuracy-bar-track">
                            <div 
                                className="accuracy-bar-fill" 
                                style={{ width: `${val}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}
