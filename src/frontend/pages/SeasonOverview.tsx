import { useMemo } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { RACES, SPRINTS } from "@/lib/f1-presets"
import { F1Header } from "@/frontend/components/f1-header"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import { Button } from "@/frontend/components/button"
import { Link } from "react-router-dom"
import { PageLoader } from "@/frontend/components/PageLoader"
import { F1Footer } from "@/frontend/components/f1-footer"
import "@/frontend/styles/SeasonOverview.css"

export default function SeasonOverview() {
  const { user } = useAuth()
  const { profile, loading } = useUserProfile()

  const isAuthenticated = !!user
  const displayUsername = profile?.username || user?.user_metadata?.username || "User"

  const allEventData = useMemo(() => {
    const racesWithType = RACES.map(r => ({ ...r, type: 'race' }));
    const sprintsWithType = SPRINTS.map(s => ({ ...s, type: 'sprint' }));
    const combined = [...racesWithType, ...sprintsWithType];
    
    return combined.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time.split(' ')[0]}:00Z`);
      const dateB = new Date(`${b.date}T${b.time.split(' ')[0]}:00Z`);
      return dateA.getTime() - dateB.getTime();
    });
  }, []);

  if (loading) return <PageLoader />

  const now = new Date();

  return (
    <div className="season-overview-container">
      <F1Header variant="Home" activeNav="Season" isAuthenticated={isAuthenticated} username={displayUsername} />
      
      <main className="season-overview-main">
        <h1 className="season-overview-title">
          2026 Season Overview
        </h1>
        
        <div className="season-overview-races-container">
          {allEventData.map((event) => {
            // Cutoff calculation
            const cutoffDate = new Date(event.cutoff.replace(' ', 'T') + ':00Z');
            
            // Results Available logic: 00:00 day after race date
            const resultsDay = new Date(event.date);
            resultsDay.setUTCDate(resultsDay.getUTCDate() + 1);
            resultsDay.setUTCHours(0, 0, 0, 0);
            
            const isResultsAvailable = now >= resultsDay;
            const isLocked = now >= cutoffDate && !isResultsAvailable;
            
            // Unlock logic: Predictions open at 00:00 day after previous race
            let unlockDate: Date | null = null;
            if (event.round > 1) {
              const prevRace = RACES.find(r => r.round === event.round - 1);
              if (prevRace) {
                const prevResultsDay = new Date(prevRace.date);
                prevResultsDay.setUTCDate(prevResultsDay.getUTCDate() + 1);
                prevResultsDay.setUTCHours(0, 0, 0, 0);
                unlockDate = prevResultsDay;
              }
            }

            const isPending = unlockDate && now < unlockDate;
            const isOpen = now < cutoffDate && !isPending;

            const isRace = event.type === 'race';

            return (
              <FeatureRace 
                key={event.id} 
                race={event}
                className="season-overview-feature-race"
                renderActions={(raceColors) => (
                  <div className="season-overview-actions">

                    {isOpen && (
                      <Link to={isRace ? "/race-predictions" : "/sprint-predictions"}>
                        <Button 
                          className="season-overview-btn-predict"
                          style={{ 
                            backgroundColor: raceColors.primary,
                            boxShadow: `0 10px 25px -5px ${raceColors.primary}40`
                          }}
                        >
                          Make your predictions
                        </Button>
                      </Link>
                    )}
                    
                    {isLocked && (
                      <Button 
                        disabled 
                        className="season-overview-btn-locked"
                        style={{ 
                          borderColor: raceColors.primary,
                          color: raceColors.primary,
                          opacity: 0.6
                        }}
                      >
                        Locked
                      </Button>
                    )}

                    {isResultsAvailable && (
                      <Link to={isRace ? "/race-results" : "/sprint-results"}>
                        <Button 
                          className="season-overview-btn-results"
                          style={{ 
                            borderColor: raceColors.primary,
                            color: raceColors.primary,
                            backgroundColor: 'transparent'
                          }}
                        >
                          View Results
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              />
            )
          })}
        </div>
      </main>
      <F1Footer />
    </div>
  )
}
