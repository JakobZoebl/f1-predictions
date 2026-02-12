"use client"

import { useState } from "react"


import { ProfileDetails } from "@/frontend/components/profile-settings/ProfileDetails"
import { ThemeCustomization } from "@/frontend/components/profile-settings/ThemeCustomization"
import { SecuritySettings } from "@/frontend/components/profile-settings/SecuritySettings"
import { F1Header } from "@/frontend/components/f1-header"
import F1Background from "@/frontend/components/team-driver-background"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import { TEAM_EMBLEMS } from "@/lib/team-emblems"
import { DRIVER_IMAGES } from "@/lib/driver-images"
import "@/frontend/styles/ProfileSettings.css"

export default function ProfileSettings() {
  const [selectedTeam, setSelectedTeam] = useState("ferrari")
  const [selectedDriver, setSelectedDriver] = useState("leclerc")

  const team = TEAMS[selectedTeam] || TEAMS.ferrari
  const driver = DRIVERS[selectedDriver] || DRIVERS.leclerc

  return (
    <div className="profile-settings-container">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <F1Background 
          teamColors={team.colors}
          driverColors={driver.colors}
          teamLogoUrl={TEAM_EMBLEMS[selectedTeam]}
          driverLogoUrl={DRIVER_IMAGES[selectedDriver]}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <F1Header variant="Home" activeNav="Profile" isAuthenticated={true} username="max_verstappen" />
        
        <main className="profile-settings-page relative pt-24">
          <div className="profile-settings-grid">
              <ProfileDetails />
              <ThemeCustomization 
                selectedTeam={selectedTeam}
                selectedDriver={selectedDriver}
                onTeamChange={setSelectedTeam}
                onDriverChange={setSelectedDriver}
              />
          </div>
          
          <div className="mt-6">
              <SecuritySettings />
          </div>
        </main>
      </div>
    </div>
  )
}
