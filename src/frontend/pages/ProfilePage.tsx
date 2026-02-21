"use client"

import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { useCardsStats } from "@/lib/hooks/useCardsStats"
import { useSeasonStats } from "@/lib/hooks/useSeasonStats"
import { F1Header } from "@/frontend/components/f1-header"
import { PageLoader } from "@/frontend/components/PageLoader"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import "@/frontend/styles/ProfilePage.css"

import { F1Footer } from "@/frontend/components/f1-footer"
import { ProfileHeader } from "@/frontend/profile/ProfileHeader"
import { ProfileCards } from "@/frontend/profile/ProfileCards"
import { SeasonStats } from "@/frontend/profile/SeasonStats"
import { MOCK_PROFILE } from "@/lib/mock-profile-data"

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile()

  // Fallback keys used while loading or if user has no preferences set
  const DEFAULT_TEAM_KEY = "redbull"
  const DEFAULT_DRIVER_KEY = "verstappen"

  // Derive team/driver from profile preferences or use defaults
  const teamKey =
    profile?.favorite_team_id && TEAMS[profile.favorite_team_id]
      ? profile.favorite_team_id
      : DEFAULT_TEAM_KEY
  const driverKey =
    profile?.favorite_driver_id && DRIVERS[profile.favorite_driver_id]
      ? profile.favorite_driver_id
      : DEFAULT_DRIVER_KEY

  const { stats: cardsData, loading: cardsLoading } = useCardsStats(teamKey, driverKey)
  const { seasonStats, loading: seasonStatsLoading } = useSeasonStats()

  const isPageLoading = profileLoading || seasonStatsLoading

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

  if (isPageLoading) return <PageLoader />

  return (
    <main className="profile-main">
      <F1Header variant="Home" activeNav="Profile" isAuthenticated={isAuthenticated} username={displayUsername} />
      
      {/* ── Page Content ── */}
      <div className="profile-page-container">
          <>
            <ProfileHeader 
                username={`@${displayUsername}`}
                displayName={displayName}
                memberSince={memberSince}
                rank={seasonStats ? (typeof seasonStats.rank === 'number' ? seasonStats.rank : parseInt(seasonStats.rank.replace('#', '')) || 0) : MOCK_PROFILE.user.rank}
                points={seasonStats?.total_points ?? MOCK_PROFILE.user.totalPoints}
            />

            {cardsLoading ? (
               <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading cards data...</div>
            ) : (
                <ProfileCards 
                    teamKey={teamKey}
                    driverKey={driverKey}
                    data={cardsData}
                />
            )}

            <SeasonStats data={MOCK_PROFILE.seasonStats} />
          </>
      </div>
      <F1Footer />
    </main>
  )
}
