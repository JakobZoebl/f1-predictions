import { useState } from "react"
import { Settings, ChevronDown } from "lucide-react"
import { F1Header } from "@/components/f1/f1-header"
import F1Background from "@/components/f1/F1Background"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import "@/styles/TestPage.css"

// Change these keys to instantly switch team/driver colors & branding
const DEFAULT_TEAM_KEY = "redbull"
const DEFAULT_DRIVER_KEY = "verstappen"

export default function TestPage() {
  const [teamKey, setTeamKey] = useState(DEFAULT_TEAM_KEY)
  const [driverKey, setDriverKey] = useState(DEFAULT_DRIVER_KEY)

  const team = TEAMS[teamKey]
  const driver = DRIVERS[driverKey]

  return (
    <main className="relative min-h-screen bg-transparent text-foreground">
       {/* Background layer */}
       <F1Background
        teamColors={team.colors}
        driverColors={driver.colors}
      />

      <F1Header variant="dashboard" activeNav="Test">
        <div className="header-right-nav">
          <span className="header-username">@username</span>
          <button
            type="button"
            className="header-settings-btn"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </F1Header>
      
      {/* ── Page Content ── */}
      <div className="test-page-container relative z-10">
        {/* Add components here to test them */}
      </div>

      {/* ── Floating Preset Switcher (bottom-right) ─────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Team selector */}
        <div className="relative group">
          <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1 font-medium shadow-black drop-shadow-sm">
            Team
          </label>
          <div className="relative">
            <select
              value={teamKey}
              onChange={(e) => setTeamKey(e.target.value)}
              className="appearance-none bg-[#0f1628]/80 backdrop-blur-md border border-white/10 text-white text-xs rounded-lg pl-3 pr-8 py-2 cursor-pointer hover:border-white/25 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[#e10600]/50 min-w-[160px]"
            >
              {Object.entries(TEAMS).map(([key, t]) => (
                <option key={key} value={key}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Driver selector */}
        <div className="relative group">
          <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1 font-medium shadow-black drop-shadow-sm">
            Driver
          </label>
          <div className="relative">
            <select
              value={driverKey}
              onChange={(e) => setDriverKey(e.target.value)}
              className="appearance-none bg-[#0f1628]/80 backdrop-blur-md border border-white/10 text-white text-xs rounded-lg pl-3 pr-8 py-2 cursor-pointer hover:border-white/25 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[#e10600]/50 min-w-[160px]"
            >
              {Object.entries(DRIVERS).map(([key, d]) => (
                <option key={key} value={key}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Sparkle icon (bottom-right) ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-white/20 animate-pulse-slow"
          fill="currentColor"
        >
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      </div>

    </main>
  )
}
