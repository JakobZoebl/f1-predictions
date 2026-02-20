import { Outlet } from "react-router-dom"
import F1Background from "@/frontend/components/team-driver-background"
import { useUserProfile } from "@/lib/hooks/UserProfileContext"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import { TEAM_EMBLEMS } from "@/lib/team-emblems"
import { DRIVER_IMAGES } from "@/lib/driver-images"

export function BackgroundLayout() {
  const { profile } = useUserProfile()

  const teamKey = profile?.favorite_team_id && TEAMS[profile.favorite_team_id] 
    ? profile.favorite_team_id 
    : "redbull"
  const driverKey = profile?.favorite_driver_id && DRIVERS[profile.favorite_driver_id] 
    ? profile.favorite_driver_id 
    : "verstappen"

  return (
    <>
      <F1Background 
        teamColors={TEAMS[teamKey].colors}
        driverColors={DRIVERS[driverKey].colors}
        teamLogoUrl={TEAM_EMBLEMS[teamKey]}
        driverLogoUrl={DRIVER_IMAGES[driverKey]}
      />
      <Outlet />
    </>
  )
}
