import { useState, useEffect } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { F1Header } from "@/frontend/components/f1-header"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import { SeasonSummary } from "@/frontend/home/SeasonSummary"
import { MiniLeaderboard, type LeaderboardEntry } from "@/frontend/home/MiniLeaderboard"
import { Button } from "@/frontend/components/button"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import { PageLoader } from "@/frontend/components/PageLoader"
import "@/frontend/styles/Home.css"

export default function Home() {
    const { user } = useAuth()
    const { profile, loading } = useUserProfile()

    const isAuthenticated = !!user
    const displayUsername = profile?.username || user?.user_metadata?.username || "User"

    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])

    useEffect(() => {
        const fetchTop5 = async () => {
            try {
                const { data, error } = await supabase
                    .from('leaderboard')
                    .select(`
                        rank,
                        user_id,
                        total_points,
                        users (username, display_name)
                    `)
                    .order('rank', { ascending: true })
                    .limit(5)

                if (error) throw error

                if (data) {
                    setLeaderboardData(data.map(entry => {
                        const user = (Array.isArray(entry.users) ? entry.users[0] : entry.users) as Record<string, string> | null;
                        return {
                            rank: entry.rank || 0,
                            userId: entry.user_id,
                            username: user?.username || 'Unknown',
                            displayName: user?.display_name || user?.username || 'Unknown',
                            points: entry.total_points || 0,
                            movement: 0,
                        };
                    }))
                }
            } catch (err) {
                console.error("Error fetching mini leaderboard:", err)
            }
        }
        fetchTop5()
    }, [])

  if (loading) {
      return <PageLoader />
  }

  return (
    <div className="home-page-container">
      {/* Content Layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <F1Header variant="Home" activeNav="Home" isAuthenticated={isAuthenticated} username={displayUsername} />
        
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
             <MiniLeaderboard data={leaderboardData} currentUserId={user?.id} />
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
