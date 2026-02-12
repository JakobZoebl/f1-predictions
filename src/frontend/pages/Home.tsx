import { F1Header } from "@/frontend/components/f1-header"
import F1Background from "@/frontend/components/team-driver-background"
import { TEAMS, DRIVERS } from "@/lib/f1-presets"
import { TEAM_EMBLEMS } from "@/lib/team-emblems"
import { DRIVER_IMAGES } from "@/lib/driver-images"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import { SeasonSummary } from "@/frontend/home/SeasonSummary"
import { MiniLeaderboard } from "@/frontend/home/MiniLeaderboard"
import { Button } from "@/frontend/components/button"
import { Link } from "react-router-dom"
import "@/frontend/styles/Home.css"

export default function Home() {
    // Mock data for Mini Leaderboard
    const leaderboardData = [
        { rank: 1, userId: "1", username: "racingpro47", displayName: "RacingPro47", points: 124, movement: 0 },
        { rank: 2, userId: "2", username: "f1fanatic", displayName: "F1Fanatic", points: 105, movement: 0 },
        { rank: 3, userId: "3", username: "speeddemon", displayName: "SpeedDemon", points: 98, movement: -1 },
        { rank: 4, userId: "me", username: "username", displayName: "YOU", points: 87, movement: 2 },
        { rank: 5, userId: "4", username: "maxverstappen33", displayName: "MaxVerstap...", points: 84, movement: 1 },
    ]

  return (
    <div className="home-page-container">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
          <F1Background 
            teamColors={TEAMS.redbull.colors}
            driverColors={DRIVERS.verstappen.colors}
            teamLogoUrl={TEAM_EMBLEMS.redbull}
            driverLogoUrl={DRIVER_IMAGES.verstappen}
          />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <F1Header variant="Home" activeNav="Home" />
        
        <main className="home-main-content">
          
          {/* Feature Race Section */}
          <section>
            <FeatureRace 
                 renderActions={(raceColors) => (
                    <div className="home-action-buttons">
                        <Link to="/race-predictions">
                            <Button 
                                className="btn-predict"
                                style={{ 
                                    backgroundColor: raceColors.primary,
                                }}
                            >
                                Make Your Predictions
                            </Button>
                        </Link>
                    </div>
                )}
            />
          </section>

          {/* Dashboard Grid */}
          <div className="home-dashboard-grid">
             <SeasonSummary />
             <MiniLeaderboard data={leaderboardData} currentUserId="me" />
          </div>

          {/* Race Calendar Teaser (Optional, based on image bottom part) */}
             {/* Note: The image shows a race calendar at the bottom. 
                 The prompt asked for "your season summary" and "small top 5 leaderboard". 
                 The calendar components are not explicitly requested as "new unique components" to be created in step 5,
                 but step 1 says "link all the ui elements". 
                 However, I don't have a specific Calendar component ready-made in the list of existing components provided in the prompt.
                 The prompt says "create a new folder called home... that holds all the new unique components".
                 I will assume the Season Summary and Mini Leaderboard are the main ones requested.
                 I can add a placeholder or simple list for the calendar if needed, but for now I'll stick to the requested items.
             */}
        </main>
      </div>
    </div>
  )
}
