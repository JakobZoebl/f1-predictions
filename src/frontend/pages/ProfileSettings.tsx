"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/useUserProfile"

import { ProfileDetails } from "@/frontend/profile-settings/ProfileDetails"
import { ThemeCustomization } from "@/frontend/profile-settings/ThemeCustomization"
import { SecuritySettings } from "@/frontend/profile-settings/SecuritySettings"
import { F1Header } from "@/frontend/components/f1-header"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import { supabase } from "@/lib/supabaseClient"
import { PageLoader } from "@/frontend/components/PageLoader"
import "@/frontend/styles/ProfileSettings.css"

export default function ProfileSettings() {
  const { user, session } = useAuth()
  const { profile, loading, error, refetch } = useUserProfile()

  const [selectedTeam, setSelectedTeam] = useState("ferrari")
  const [selectedDriver, setSelectedDriver] = useState("leclerc")

  // Sync local dropdowns when profile data arrives or changes
  const profileTeamId = profile?.favorite_team_id
  const profileDriverId = profile?.favorite_driver_id
  useEffect(() => {
    if (profileTeamId && TEAMS[profileTeamId]) {
      setSelectedTeam(profileTeamId)
    }
    if (profileDriverId && DRIVERS[profileDriverId]) {
      setSelectedDriver(profileDriverId)
    }
  }, [profileTeamId, profileDriverId])

  // Save display name
  async function handleSaveDisplayName(newDisplayName: string) {
    if (!session?.access_token) return

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ display_name: newDisplayName }),
    })
    const data = await res.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to update display name.")
    }

    // Refresh the global profile cache
    await refetch()
  }

  // Save preferences (favorite team & driver)
  async function handleSavePreferences() {
    if (!session?.access_token) return

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        favorite_team_id: selectedTeam,
        favorite_driver_id: selectedDriver,
      }),
    })
    const data = await res.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to save preferences.")
    }

    // Refresh the global profile cache so other pages see the update
    await refetch()
  }

  // Password update
  async function handleUpdatePassword(newPassword: string) {
    if (!session?.access_token) return

    const res = await fetch("/api/auth/update-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ new_password: newPassword }),
    })
    const data = await res.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to update password.")
    }
  }

  // Sign out
  async function handleSignOut() {
    await supabase.auth.signOut()
  }



  const displayUsername = profile?.username || user?.user_metadata?.username || "User"
  const isAuthenticated = !!user

  if (loading) return <PageLoader />

  return (
    <div className="profile-settings-container">
      {/* Content Layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <F1Header variant="Home" activeNav="Profile" isAuthenticated={isAuthenticated} username={displayUsername} />
        
        <main className="profile-settings-page relative pt-24">
          {error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-red-400 text-lg">{error}</div>
            </div>
          ) : (
            <>
              <div className="profile-settings-grid">
                <ProfileDetails
                  username={profile?.username || ""}
                  email={profile?.email || user?.email || ""}
                  displayName={profile?.display_name || ""}
                  onSaveDisplayName={handleSaveDisplayName}
                />
                <ThemeCustomization 
                  selectedTeam={selectedTeam}
                  selectedDriver={selectedDriver}
                  onTeamChange={setSelectedTeam}
                  onDriverChange={setSelectedDriver}
                  onSave={handleSavePreferences}
                />
              </div>
              
              <div className="mt-6">
                <SecuritySettings
                  onUpdatePassword={handleUpdatePassword}
                  onSignOut={handleSignOut}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
