"use client"

import "@/frontend/styles/ProfileSettings.css"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select"

interface ThemeCustomizationProps {
  selectedTeam: string
  selectedDriver: string
  onTeamChange: (team: string) => void
  onDriverChange: (driver: string) => void
}

export function ThemeCustomization({ 
  selectedTeam, 
  selectedDriver, 
  onTeamChange, 
  onDriverChange 
}: ThemeCustomizationProps) {
  
  const teamColors = TEAMS[selectedTeam]?.colors || { primary: "#E10600", secondary: "#000000" }
  const driverColors = DRIVERS[selectedDriver]?.colors || { primary: "#FF8700", secondary: "#000000" }

  return (
    <div className="settings-container">
      <h2>Theme & Preferences</h2>
      
      {/* Team Dropdown */}
      <div className="settings-field">
        <label className="settings-label">Favourite Team</label>
        <div className="settings-select-wrapper">
          <Select value={selectedTeam} onValueChange={onTeamChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TEAMS).map(([key, team]) => (
                <SelectItem key={key} value={key}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Team Color Preview */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-md border border-white/20"
              style={{ backgroundColor: teamColors.primary }}
            />
            <span className="text-xs text-white/60">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-md border border-white/20"
              style={{ backgroundColor: teamColors.secondary }}
            />
            <span className="text-xs text-white/60">Secondary</span>
          </div>
        </div>
      </div>

      {/* Driver Dropdown */}
      <div className="settings-field">
        <label className="settings-label">Favourite Driver</label>
        <div className="settings-select-wrapper">
          <Select value={selectedDriver} onValueChange={onDriverChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a driver" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DRIVERS).map(([key, driver]) => (
                <SelectItem key={key} value={key}>
                  {driver.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Driver Color Preview */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-md border border-white/20"
              style={{ backgroundColor: driverColors.primary }}
            />
            <span className="text-xs text-white/60">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-md border border-white/20"
              style={{ backgroundColor: driverColors.secondary }}
            />
            <span className="text-xs text-white/60">Secondary</span>
          </div>
        </div>
      </div>

      {/* Apply Theme Button */}
      <button 
        className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
      >
        Apply Theme
      </button>
    </div>
  )
}
