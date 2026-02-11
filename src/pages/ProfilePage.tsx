import { useState } from "react"
import { Settings, ChevronDown } from "lucide-react"
import { F1Header } from "@/components/f1/f1-header"
import F1Background from "@/components/f1/F1Background"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import { DRIVER_IMAGES } from "@/lib/driver-images"
import { TEAM_EMBLEMS } from "@/lib/team-emblems"
import "@/styles/ProfilePage.css"

import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileCards } from "@/components/profile/ProfileCards"
import { SeasonStats } from "@/components/profile/SeasonStats"
import { MOCK_PROFILE } from "@/lib/mock-profile-data"

// Change these keys to instantly switch team/driver colors & branding
const DEFAULT_TEAM_KEY = "redbull"
const DEFAULT_DRIVER_KEY = "verstappen"

export default function ProfilePage() {
  const [teamKey, setTeamKey] = useState(DEFAULT_TEAM_KEY)
  const [driverKey, setDriverKey] = useState(DEFAULT_DRIVER_KEY)

  const team = TEAMS[teamKey]
  const driver = DRIVERS[driverKey]

  return (
    <main className="profile-main">
       {/* Background layer */}
       <F1Background
        teamColors={team.colors}
        driverColors={driver.colors}
        driverLogoUrl={DRIVER_IMAGES[driverKey]}
        teamLogoUrl={TEAM_EMBLEMS[teamKey]}
      />

      <F1Header variant="dashboard" activeNav="Profile">
        <div className="header-right-nav">
          <span className="header-username">@{MOCK_PROFILE.user.username}</span>
          <button
            type="button"
            className="header-settings-btn"
            aria-label="Settings"
          >
            <Settings className="settings-icon" />
          </button>
        </div>
      </F1Header>
      
      {/* ── Page Content ── */}
      <div className="profile-page-container">
        <ProfileHeader 
            username={`@${MOCK_PROFILE.user.username}`}
            displayName={MOCK_PROFILE.user.displayName}
            memberSince={MOCK_PROFILE.user.memberSince}
            rank={MOCK_PROFILE.user.rank}
            points={MOCK_PROFILE.user.totalPoints}
        />

        <ProfileCards 
            teamKey={teamKey}
            driverKey={driverKey}
            data={MOCK_PROFILE}
        />

        <SeasonStats data={MOCK_PROFILE.seasonStats} />
      </div>

      {/* ── Floating Preset Switcher (bottom-right) ─────────── */}
      <div className="preset-switcher">
        {/* Team selector */}
        <div className="preset-selector-group">
          <label className="preset-selector-label">
            Team
          </label>
          <div className="preset-select-wrapper">
            <select
              value={teamKey}
              onChange={(e) => setTeamKey(e.target.value)}
              className="preset-select"
            >
              {Object.entries(TEAMS).map(([key, t]) => (
                <option key={key} value={key}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="preset-chevron" />
          </div>
        </div>

        {/* Driver selector */}
        <div className="preset-selector-group">
          <label className="preset-selector-label">
            Driver
          </label>
          <div className="preset-select-wrapper">
            <select
              value={driverKey}
              onChange={(e) => setDriverKey(e.target.value)}
              className="preset-select"
            >
              {Object.entries(DRIVERS).map(([key, d]) => (
                <option key={key} value={key}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="preset-chevron" />
          </div>
        </div>
      </div>

      {/* ── Sparkle icon (bottom-center) ── */}
      <div className="sparkle-container">
        <svg
          viewBox="0 0 24 24"
          className="sparkle-icon"
          fill="currentColor"
        >
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      </div>

    </main>
  )
}
