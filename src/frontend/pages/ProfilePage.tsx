

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

// Change these keys to instantly switch team/driver colors & branding
const DEFAULT_TEAM_KEY = "redbull"
const DEFAULT_DRIVER_KEY = "verstappen"

export default function ProfilePage() {
  // In a real app, these would come from the user's profile context/store
  const teamKey = DEFAULT_TEAM_KEY
  const driverKey = DEFAULT_DRIVER_KEY

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

      <F1Header variant="Home" activeNav="Profile" isAuthenticated={true} username={MOCK_PROFILE.user.username} />
      
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



    </main>
  )
}
