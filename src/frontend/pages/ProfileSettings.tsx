"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile, type UserProfile } from "@/lib/hooks/useUserProfile"
import type { User, Session } from "@supabase/supabase-js"
import { useBackground } from "@/frontend/components/BackgroundContext"

import { ProfileDetails } from "@/frontend/profile-settings/ProfileDetails"
import { ThemeCustomization } from "@/frontend/profile-settings/ThemeCustomization"
import { SecuritySettings } from "@/frontend/profile-settings/SecuritySettings"
import { F1Header } from "@/frontend/components/f1-header"
import { supabase } from "@/lib/supabaseClient"
import { PageLoader } from "@/frontend/components/PageLoader"
import { F1Footer } from "@/frontend/components/f1-footer"
import "@/frontend/styles/ProfileSettings.css"

export default function ProfileSettings() {
  const { user, session } = useAuth()
  const { profile, loading, error, refetch } = useUserProfile()

  const displayUsername = profile?.username || user?.user_metadata?.username || "User"
  const isAuthenticated = !!user

  return (
    <div className="profile-settings-container">
      {/* Content Layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <F1Header variant="Home" activeNav="Profile" isAuthenticated={isAuthenticated} username={displayUsername} />
        
        <main className="profile-settings-page relative pt-24">
          {loading ? (
            <PageLoader />
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-red-400 text-lg">{error}</div>
            </div>
          ) : (
            <ProfileSettingsContent 
              profile={profile} 
              user={user} 
              session={session} 
              refetch={refetch} 
            />
          )}
        </main>
        <F1Footer />
      </div>
    </div>
  )
}

function ProfileSettingsContent({ 
  profile, 
  user, 
  session, 
  refetch 
}: { 
  profile: UserProfile | null
  user: User | null
  session: Session | null
  refetch: () => Promise<void>
}) {
  const [selectedTeam, setSelectedTeam] = useState(profile?.favorite_team_id || "ferrari")
  const [selectedDriver, setSelectedDriver] = useState(profile?.favorite_driver_id || "leclerc")

  const { setBackgroundConfig, resetToDefault } = useBackground()
  const navigate = useNavigate()

  // Live background preview based on dropdown selection
  useEffect(() => {
    setBackgroundConfig({
      type: "team-driver",
      teamId: selectedTeam,
      driverId: selectedDriver
    })
  }, [selectedTeam, selectedDriver, setBackgroundConfig])

  // Revert preview on unmount to prevent unintended background changes across pages
  useEffect(() => {
    return () => {
      resetToDefault()
    }
  }, [resetToDefault])

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
    navigate("/")
  }

  // Delete account
  async function handleDeleteAccount() {
    if (!session?.access_token) return

    const res = await fetch("/api/auth/delete-account", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
    const data = await res.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to delete account.")
    }

    // After backend deletion, sign out locally
    await supabase.auth.signOut()
    navigate("/")
  }

  return (
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
          onDeleteAccount={handleDeleteAccount}
        />
      </div>
    </>
  )
}
