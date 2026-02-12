import { MOCK_PROFILE } from "@/lib/mock-profile-data"
import "@/frontend/styles/SeasonStats.css"

type SeasonStatsData = typeof MOCK_PROFILE['seasonStats']

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
                        <div className="stat-card-value">#{data.rank} <span className="stat-card-value-sub">of 20 (Top 20%)</span></div>
                    </div>
                    <div className="stat-card-right">
                        <div className="stat-card-label">Total Points</div>
                        <div className="stat-card-value-highlight">{data.totalPoints}</div>
                    </div>
                </div>

                <div className="stat-mini-cards">
                     <div className="stat-mini-card">
                        <div className="stat-mini-label">Points Behind Leader</div>
                        <div className="stat-mini-value">{data.behindLeader}</div>
                     </div>
                     <div className="stat-mini-card">
                        <div className="stat-mini-label">Avg Points/Race</div>
                        <div className="stat-mini-value">{data.avgPoints}</div>
                     </div>
                </div>

                <div className="stat-highlights">
                    <div className="stat-highlight-item">
                        <span className="stat-highlight-icon-gold">🏆</span> Best: <b>{data.bestRace}</b>
                    </div>
                    <div className="stat-highlight-item">
                        <span className="stat-highlight-icon-blue">📉</span> Worst: <b>{data.worstRace}</b>
                    </div>
                    <div className="stat-highlight-item">
                         <span className="stat-highlight-icon-orange">🔥</span> Streak: <b>{data.currentStreak}</b>
                    </div>
                    <div className="stat-highlight-item">
                         <span className="stat-highlight-icon-purple">🎯</span> Consistency: <b>{data.consistencyScore}</b>
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
