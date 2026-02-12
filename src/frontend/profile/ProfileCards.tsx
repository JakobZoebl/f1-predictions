import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import { DRIVER_IMAGES } from "@/lib/driver-images"
import { TEAM_LOGOS } from "@/lib/team-logos"
import { MOCK_PROFILE } from "@/lib/mock-profile-data"
import "@/frontend/styles/ProfileCards.css"

type ProfileData = typeof MOCK_PROFILE

interface ProfileCardsProps {
  teamKey: string
  driverKey: string
  data: ProfileData
}

export function ProfileCards({ teamKey, driverKey, data }: ProfileCardsProps) {
  const team = TEAMS[teamKey]
  const driver = DRIVERS[driverKey]
  const driverImage = DRIVER_IMAGES[driverKey]
  const teamLogo = TEAM_LOGOS[teamKey]

  return (
    <div className="profile-cards-grid">
      {/* ── CONSTRUCTOR SIDE ── */}
      <div 
        className="profile-card"
        style={{
          boxShadow: `0 0 40px -10px ${team.colors.primary}20`
        }}
      >
        <h2 className="profile-card-title">Constructor Side</h2>

        {/* Team Logo Area */}
        <div className="profile-card-logo-area">
            <div className="profile-card-logo-bubble">
                {teamLogo ? (
                    <img src={teamLogo} alt={team.name} className="profile-card-logo-img" />
                ) : (
                    <div className="profile-card-logo-fallback">Logo</div>
                )}
            </div>
        </div>

        <div className="profile-card-name-area">
            <div className="profile-card-name-row">
                <h3 className="profile-card-name">
                    {team.name}
                </h3>
            </div>
        </div>

        {/* Color Bars */}
        <div className="profile-card-color-bars">
            <div className="profile-card-color-bar" style={{ backgroundColor: team.colors.primary }}></div>
            <div className="profile-card-color-label">[Team Color]</div>
            <div className="profile-card-color-bar" style={{ backgroundColor: team.colors.secondary }}></div>
        </div>

        {/* Stats Grid */}
        <div className="profile-card-stats-grid">
            <div className="profile-card-standings-row">
                 <span className="profile-card-standings-label">Constructor Standings</span>
                 <div className="profile-card-standings-value">
                    <span className="profile-card-standings-pos">P{data.constructor.standingsPos}</span> • {data.constructor.standingsPoints} points
                 </div>
            </div>
            
            <div className="profile-card-stats-summary">
                <span>Races: {data.constructor.seasonStats.races}</span>
                <span>Wins: {data.constructor.seasonStats.wins}</span>
                <span>Podiums: {data.constructor.seasonStats.podiums}</span>
                <span>DNFs: {data.constructor.seasonStats.dnfs}</span>
            </div>

            <div className="profile-card-section">
                <div className="profile-card-section-label">Recent Results</div>
                <div className="profile-card-result-badges">
                    {data.constructor.recentResults.map((res: string, i: number) => (
                        <span key={i} className="profile-card-result-badge">{res}</span>
                    ))}
                </div>
            </div>
            
            {/* User Predictions Section */}
            <div className="profile-card-predictions-section">
                <div className="profile-card-section-label-mb">Your Predictions for {team.name}</div>
                <div className="profile-card-predictions-list">
                     <div className="profile-card-prediction-row">
                        <span className="profile-card-prediction-label">Exact Position</span>
                        <span className="profile-card-prediction-value">+{data.constructor.userPredictions.exactPosition} points</span>
                     </div>
                     <div className="profile-card-prediction-row">
                        <span className="profile-card-prediction-label">Your Position</span>
                        <span className="profile-card-prediction-value">+{data.constructor.userPredictions.yourPosition} points</span>
                     </div>
                     <div className="profile-card-prediction-total-row">
                        <span className="profile-card-prediction-total-label">Total</span>
                        <span className="profile-card-prediction-value">{data.constructor.userPredictions.total} points</span>
                     </div>
                </div>
            </div>
        </div>
      </div>

      {/* ── DRIVER SIDE ── */}
      <div 
        className="profile-card"
        style={{
          boxShadow: `0 0 40px -10px ${driver.colors.primary}20`
        }}
      >
        <h2 className="profile-card-title">Driver Side</h2>

        {/* Driver Photo */}
        <div className="profile-card-photo-bubble">
            {driverImage ? (
                 <img src={driverImage} alt={driver.name} className="profile-card-photo-img" />
            ) : (
                <div className="profile-card-photo-fallback">No Image</div>
            )}
        </div>
        
        <div className="profile-card-name-area">
            <div className="profile-card-name-row">
                <span className="profile-card-driver-number">#{driver.number}</span>
                <span className="profile-card-name-divider"></span>
                <h3 className="profile-card-name">{driver.name}</h3>
            </div>
        </div>

        {/* Color Bars */}
        <div className="profile-card-color-bars">
            <div className="profile-card-color-bar" style={{ backgroundColor: driver.colors.primary }}></div>
            <div className="profile-card-color-label">[Driver Color]</div>
            <div className="profile-card-color-bar" style={{ backgroundColor: driver.colors.secondary }}></div>
        </div>

        {/* Stats Grid */}
        <div className="profile-card-stats-grid">
             <div className="profile-card-standings-row">
                 <span className="profile-card-standings-label">Driver Standings</span>
                 <div className="profile-card-standings-value">
                    <span className="profile-card-standings-pos">P{data.driver.standingsPos}</span> • {data.driver.standingsPoints} points
                 </div>
            </div>

            <div className="profile-card-stats-summary-wrap">
                <span>Races: {data.driver.seasonStats.races}</span> • 
                <span>Wins: {data.driver.seasonStats.wins}</span> • 
                <span>Podiums: {data.driver.seasonStats.podiums}</span> • 
                <span>Poles: {data.driver.seasonStats.poles}</span>
            </div>

             <div className="profile-card-section">
                <div className="profile-card-section-label">Recent Finishes</div>
                <div className="profile-card-result-badges">
                    {data.driver.recentResults.map((res: string, i: number) => (
                        <span key={i} className="profile-card-result-badge-driver">🏆 {res}</span>
                    ))}
                </div>
            </div>

            {/* Prediction Accuracy Section */}
            <div className="profile-card-predictions-section">
                <div className="profile-card-section-label-mb">Prediction Accuracy for {driver.name}</div>
                <div className="profile-card-predictions-list">
                     <div className="profile-card-prediction-row">
                        <span className="profile-card-prediction-label">Exact Position Matches</span>
                        <span className="profile-card-prediction-value-neutral">{data.driver.userPredictions.exactMatches}</span>
                     </div>
                     <div className="profile-card-prediction-row">
                        <span className="profile-card-prediction-label">Pole Position</span>
                        <span className="profile-card-prediction-value-neutral">{data.driver.userPredictions.polePosition}</span>
                     </div>
                     <div className="profile-card-prediction-accuracy-row">
                        <span className="profile-card-prediction-total-label">Overall Accuracy</span>
                        <span className="profile-card-prediction-value-accent">{data.driver.userPredictions.accuracy}</span>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
