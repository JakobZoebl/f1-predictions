"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { supabase } from "@/lib/supabaseClient"
import { type Session } from "@supabase/supabase-js"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import { DriverDragDrop } from "@/frontend/predictions/DriverDragDrop"
import { ConstructorDragDrop } from "@/frontend/predictions/ConstructorDragDrop"
import { SeasonBonusPredictions, type SeasonBonusValues } from "@/frontend/predictions/SeasonBonusPredictions"
import { PredictionSummary } from "@/frontend/predictions/PredictionSummary"
import { PageLoader } from "@/frontend/components/PageLoader"
import { RACES, DRIVERS, TEAMS } from "@/lib/f1-presets"
import "@/frontend/styles/SeasonPredictions.css"

const SEASON_DRIVER_POINTS = [
  250, 180, 150, 120, 100, 80, 60, 40, 20, 10, // Top 10
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10,      // 11-20
  10, 10                                      // 21-22
]

const SEASON_CONSTRUCTOR_POINTS = [
  250, 180, 150, 120, 100, // Top 5
  10, 10, 10, 10, 10, 10   // 6-11
]

const INITIAL_BONUS: SeasonBonusValues = {
  most_poles: "",
  most_fastest_laps: "",
  most_retirements: "",
}

export default function SeasonPredictions() {
  const { user } = useAuth()
  const { profile, loading } = useUserProfile()

  const isAuthenticated = !!user
  const displayUsername = profile?.username || user?.user_metadata?.username || "User"

  const [selectedDrivers, setSelectedDrivers] = useState<(string | null)[]>(Array(22).fill(null))
  const [selectedConstructors, setSelectedConstructors] = useState<(string | null)[]>(Array(11).fill(null))
  const [bonusValues, setBonusValues] = useState<SeasonBonusValues>(INITIAL_BONUS)
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)

  // Fetch existing predictions
  useEffect(() => {
    async function fetchPredictions() {
      if (!isAuthenticated) return;
      
      setIsLoadingPredictions(true);
      try {
        const token = user?.id ? await supabase.auth.getSession().then(({ data }: {data: {session: Session | null}}) => data.session?.access_token) : null;
        
        const response = await fetch(`/api/predictions?session_type=season&season=2026`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.prediction) {
            const pred = data.prediction;
            
            // Populate drivers (DB holds 22)
            const fetchedDrivers = [
              pred.d1_driver, pred.d2_driver, pred.d3_driver, pred.d4_driver, pred.d5_driver,
              pred.d6_driver, pred.d7_driver, pred.d8_driver, pred.d9_driver, pred.d10_driver,
              pred.d11_driver, pred.d12_driver, pred.d13_driver, pred.d14_driver, pred.d15_driver,
              pred.d16_driver, pred.d17_driver, pred.d18_driver, pred.d19_driver, pred.d20_driver,
              pred.d21_driver, pred.d22_driver
            ];
            setSelectedDrivers(fetchedDrivers);

            // Populate constructors (DB holds 11)
            const fetchedConstructors = [
              pred.c1_constructor, pred.c2_constructor, pred.c3_constructor, pred.c4_constructor, pred.c5_constructor,
              pred.c6_constructor, pred.c7_constructor, pred.c8_constructor, pred.c9_constructor, pred.c10_constructor,
              pred.c11_constructor
            ];
            setSelectedConstructors(fetchedConstructors);

            // Populate bonus
            setBonusValues({
              most_poles: pred.most_poles || "",
              most_fastest_laps: pred.most_fastest_laps || "",
              most_retirements: pred.most_retirements || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch season predictions:", error);
      } finally {
        setIsLoadingPredictions(false);
      }
    }

    if (user) {
        fetchPredictions();
    }
  }, [user, isAuthenticated]);

  const firstRace = RACES.find(r => r.round === 1)
  const isLocked = useMemo(() => {
    if (!firstRace) return false
    const firstRaceDate = new Date(`${firstRace.date}T${firstRace.time.split(' ')[0]}:00Z`)
    return new Date() >= firstRaceDate
  }, [firstRace])

  const handleDriversChange = useCallback((drivers: (string | null)[]) => {
    if (!isLocked) setSelectedDrivers(drivers)
  }, [isLocked])

  const handleConstructorsChange = useCallback((constructors: (string | null)[]) => {
    if (!isLocked) setSelectedConstructors(constructors)
  }, [isLocked])

  const handleBonusChange = useCallback((values: SeasonBonusValues) => {
    if (!isLocked) setBonusValues(values)
  }, [isLocked])

  // Validation
  const filledDriversCount = selectedDrivers.filter(Boolean).length
  const filledConstructorsCount = selectedConstructors.filter(Boolean).length
  const bonusFilledCount = Object.values(bonusValues).filter(Boolean).length
  
  const handleSubmit = async () => {
    if (!isAuthenticated) return;

    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const token = user?.id ? await supabase.auth.getSession().then(({ data }: {data: {session: Session | null}}) => data.session?.access_token) : null;
      
      const payload = {
        session_type: 'season',
        season: 2026,
        drivers: selectedDrivers,
        constructors: selectedConstructors,
        bonus: bonusValues
      };

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit season predictions');
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  }

  // Auto-fill for testing/convenience (Optional, maybe remove later)
  const handleAutoFill = () => {
    if (isLocked) return
    
    // Randomize drivers
    const drivers = Object.keys(DRIVERS)
    const shuffledDrivers = [...drivers].sort(() => Math.random() - 0.5)
    setSelectedDrivers(shuffledDrivers)
    
    // Randomize constructors
    const teams = Object.keys(TEAMS)
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5)
    setSelectedConstructors(shuffledTeams)
    
    // Randomly select bonus values
    const randomDriver = () => drivers[Math.floor(Math.random() * drivers.length)]
    setBonusValues({
      most_poles: randomDriver(),
      most_fastest_laps: randomDriver(),
      most_retirements: randomDriver(),
    })
  }

  if (loading || isLoadingPredictions) return <PageLoader />

  return (
    <>
      <F1Header variant="Home" activeNav="SeasonPredictions" isAuthenticated={isAuthenticated} username={displayUsername} />

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        <div className="prediction-header-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative z-10">
             <h1 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-wide text-white mb-3 text-shadow-lg">
               2026 Season Predictions
             </h1>
             <p className="text-white/70 text-base md:text-lg max-w-2xl font-light">
               Predict the final standings for the 2026 Season.
               {firstRace && (
                 <span className="text-red-400 font-medium mt-2 flex items-center gap-2">
                   <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                   Locks before {firstRace.name} ({new Date(firstRace.date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })})
                 </span>
               )}
             </p>
          </div>
          
          {isLocked && (
            <div className="relative z-10 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-3 rounded-xl font-display font-bold uppercase tracking-wider shadow-lg shadow-red-500/10">
              Predictions Locked
            </div>
          )}
        </div>

        {submitError && (
          <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg text-center mb-4">
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded-lg text-center mb-4">
            Season Predictions saved successfully!
          </div>
        )}

        {/* Drivers Championship */}
        <section className="prediction-section">
          <div className="prediction-section-title">
            <h2>Drivers Championship</h2>
            <span className="max-pts">max 1130 pts</span>
          </div>
          <DriverDragDrop
            selected={selectedDrivers}
            onChange={handleDriversChange}
            slotCount={22}
            points={SEASON_DRIVER_POINTS}
            poolLabel="Remaining Drivers: {count}"
            twoColumns={true}
          />
        </section>

        {/* Constructors Championship */}
        <section className="prediction-section">
          <div className="prediction-section-title">
            <h2>Constructors Championship</h2>
            <span className="max-pts">max 860 pts</span>
          </div>
          <ConstructorDragDrop
            selected={selectedConstructors}
            onChange={handleConstructorsChange}
            slotCount={11}
            points={SEASON_CONSTRUCTOR_POINTS}
            poolLabel="Remaining Constructors: {count}"
          />
        </section>

        {/* Season Bonus */}
        <section className="prediction-section">
          <div className="prediction-section-title">
            <h2>Season Bonus</h2>
            <span className="max-pts">max 300 pts</span>
          </div>
          <SeasonBonusPredictions
            values={bonusValues}
            onChange={handleBonusChange}
          />
        </section>

        {/* Summary & Submit */}
        <PredictionSummary
          driverCount={filledDriversCount}
          constructorCount={filledConstructorsCount}
          bonusCount={bonusFilledCount}
          totalBonusFields={3}
          totalDrivers={22}
          totalConstructors={11}
          maxPoints={{
            drivers: 1130,
            constructors: 860,
            bonus: 300
          }}
          labels={{
            drivers: "Drivers Championship",
            constructors: "Constructors Championship",
            bonus: "Season Statistics"
          }}
          onAutoFill={!isLocked ? handleAutoFill : undefined}
          onSubmit={handleSubmit}
        />

      </main>

      <F1Footer />
    </>
  )
}
