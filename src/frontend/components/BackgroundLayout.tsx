import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import F1Background from "@/frontend/components/team-driver-background"
import { F1Background as BlankBackground } from "@/frontend/components/blank-background"
import { useUserProfile } from "@/lib/hooks/UserProfileContext"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import { TEAM_EMBLEMS } from "@/lib/team-emblems"
import { DRIVER_IMAGES } from "@/lib/driver-images"
import { useBackground } from "@/frontend/components/BackgroundContext"

export function BackgroundLayout() {
  const { profile } = useUserProfile()
  const { config, setBackgroundConfig } = useBackground()
  const location = useLocation()

  // Define route-based background overrides
  useEffect(() => {
    const path = location.pathname
    const blankPages = [
      "/",
      "/race-predictions", 
      "/season-predictions", 
      "/season-overview", 
      "/login", 
      "/signup"
    ]

    const isBlankPage = blankPages.some(p => p === "/" ? path === "/" : path.startsWith(p))

    if (isBlankPage) {
      if (config.type !== "blank") {
        setBackgroundConfig({ type: "blank" })
      }
    } else {
      // Default behavior for other pages (Home, Profile, etc.) will use Team/Driver background
      // pages like Results and Leaderboard will handle their own overrides via context
      if (config.type === "blank" && !isBlankPage) {
        setBackgroundConfig({ type: "team-driver" })
      }
    }


  }, [location.pathname, setBackgroundConfig, config.type])

  // Resolve team/driver based on config or user profile
  const teamKey = config.teamId || profile?.favorite_team_id || "redbull"
  const driverKey = config.driverId || profile?.favorite_driver_id || "verstappen"

  // Ensure keys are valid presets
  const finalTeamKey = TEAMS[teamKey] ? teamKey : "redbull"
  const finalDriverKey = DRIVERS[driverKey] ? driverKey : "verstappen"

  if (config.type === "blank") {
    return (
      <>
        <BlankBackground primaryColor={config.primaryColor}>
          <Outlet />
        </BlankBackground>
      </>
    )
  }

  return (
    <>
      <F1Background 
        teamColors={TEAMS[finalTeamKey].colors}
        driverColors={DRIVERS[finalDriverKey].colors}
        teamLogoUrl={TEAM_EMBLEMS[finalTeamKey]}
        driverLogoUrl={DRIVER_IMAGES[finalDriverKey]}
      />
      <Outlet />
    </>
  )
}
