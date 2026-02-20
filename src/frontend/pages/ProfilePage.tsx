"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { F1Header } from "@/frontend/components/f1-header"
import F1Background from "@/frontend/components/team-driver-background"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import { DRIVER_IMAGES } from "@/lib/driver-images"
import { TEAM_EMBLEMS } from "@/lib/team-emblems"
import "@/frontend/styles/ProfilePage.css"

import { ProfileHeader } from "@/frontend/profile/ProfileHeader"
import { ProfileCards } from "@/frontend/profile/ProfileCards"
import { SeasonStats } from "@/frontend/profile/SeasonStats"
import { MOCK_PROFILE } from "@/lib/mock-profile-data"

interface UserProfile {
  username: string
  display_name: string
  email: string
  favorite_team_id: string | null
  favorite_driver_id: string | null
  created_at: string | null
}

export default function ProfilePage() {
  const { user, session } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fallback keys used while loading or if user has no preferences set
  const DEFAULT_TEAM_KEY = "redbull"
  const DEFAULT_DRIVER_KEY = "verstappen"

  useEffect(() => {
    if (!session?.access_token) {
      setLoading(false)
      return
    }

    async function fetchProfile() {
      try {
        setLoading(true)
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${session!.access_token}` },
        })
        const data = await res.json()

        if (data.success && data.profile) {
          setProfile(data.profile)
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session?.access_token])

  // Derive team/driver from profile preferences or use defaults
  const teamKey =
    profile?.favorite_team_id && TEAMS[profile.favorite_team_id]
      ? profile.favorite_team_id
      : DEFAULT_TEAM_KEY
  const driverKey =
    profile?.favorite_driver_id && DRIVERS[profile.favorite_driver_id]
      ? profile.favorite_driver_id
      : DEFAULT_DRIVER_KEY

  const team = TEAMS[teamKey]
  const driver = DRIVERS[driverKey]

  // Format membership date
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : MOCK_PROFILE.user.memberSince

  const displayUsername = profile?.username || user?.user_metadata?.username || MOCK_PROFILE.user.username
  const displayName = profile?.display_name || user?.user_metadata?.display_name || MOCK_PROFILE.user.displayName
  const isAuthenticated = !!user

  return (
    <main className="profile-main">
       {/* Background layer */}
       <F1Background
        teamColors={team.colors}
        driverColors={driver.colors}
        driverLogoUrl={DRIVER_IMAGES[driverKey]}
        teamLogoUrl={TEAM_EMBLEMS[teamKey]}
      />

      <F1Header variant="Home" activeNav="Profile" isAuthenticated={isAuthenticated} username={displayUsername} />
      
      {/* ── Page Content ── */}
      <div className="profile-page-container">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white/60 text-lg">Loading profile...</div>
          </div>
        ) : (
          <>
            <ProfileHeader 
                username={`@${displayUsername}`}
                displayName={displayName}
                memberSince={memberSince}
                rank={MOCK_PROFILE.user.rank}
                points={MOCK_PROFILE.user.totalPoints}
            />

            <ProfileCards 
                teamKey={teamKey}
                driverKey={driverKey}
                data={MOCK_PROFILE}
            />

            <SeasonStats data={MOCK_PROFILE.seasonStats} />
          </>
        )}
      </div>
    </main>
  )
}
