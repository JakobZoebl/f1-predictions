"use client"

import { useState } from "react"
import "@/frontend/styles/ProfileSettings.css"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import { Loader2, Check } from "lucide-react"
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
  onSave: () => Promise<void>
}

export function ThemeCustomization({ 
  selectedTeam, 
  selectedDriver, 
  onTeamChange, 
  onDriverChange,
  onSave,
}: ThemeCustomizationProps) {
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const teamColors = TEAMS[selectedTeam]?.colors || { primary: "#E10600", secondary: "#000000" }
  const driverColors = DRIVERS[selectedDriver]?.colors || { primary: "#FF8700", secondary: "#000000" }

  async function handleApply() {
    if (saving) return
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await onSave()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences.")
    } finally {
      setSaving(false)
    }
  }

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
        onClick={handleApply}
        disabled={saving}
        className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {saving ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
        ) : (
          "Apply Theme"
        )}
      </button>

      {success && (
        <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
          <Check className="h-4 w-4" /> Preferences saved!
        </div>
      )}

      {error && (
        <div className="mt-3 text-red-400 text-sm">{error}</div>
      )}
    </div>
  )
}
