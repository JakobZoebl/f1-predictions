"use client"

import { useState, useCallback, useEffect } from "react"
import { useAuth } from "@/frontend/auth/AuthContext"
import { supabase } from "@/lib/supabaseClient"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import { type Session } from "@supabase/supabase-js"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import { DriverDragDrop } from "@/frontend/predictions/DriverDragDrop"
import { ConstructorDragDrop } from "@/frontend/predictions/ConstructorDragDrop"
import { BonusPredictions, type BonusValues } from "@/frontend/predictions/BonusPredictions"
import { PredictionSummary } from "@/frontend/predictions/PredictionSummary"
import { useNextSprint } from "@/lib/hooks/useNextSprint"
import { DRIVERS, TEAMS, type RaceEvent } from "@/lib/f1-presets"
import { getEventStatus } from "@/lib/event-utils"
import { hexToHsl } from "@/lib/utils"
import { PageLoader } from "@/frontend/components/PageLoader"
import "@/frontend/styles/RacePredictions.css"

const INITIAL_BONUS: BonusValues = {
  pole_position: "",
  fastest_lap: "",
  first_retirement: "",
  safety_car: false,
  red_flag: false,
}

export default function SprintPredictions() {
  const { user } = useAuth()
  const { profile, loading } = useUserProfile()

  const isAuthenticated = !!user
  const displayUsername = profile?.username || user?.user_metadata?.username || "User"

  const [selectedDrivers, setSelectedDrivers] = useState<(string | null)[]>(Array(8).fill(null))
  const [selectedConstructors, setSelectedConstructors] = useState<(string | null)[]>(Array(5).fill(null))
  const [bonusValues, setBonusValues] = useState<BonusValues>(INITIAL_BONUS)

  const nextSprint: RaceEvent | undefined = useNextSprint() ?? undefined
  const primaryColor = nextSprint?.colors?.primary

  const { isOpen: isPredictionsOpen } = getEventStatus(nextSprint)

  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)

  // Fetch existing predictions
  useEffect(() => {
    async function fetchPredictions() {
      if (!isAuthenticated || !nextSprint?.round) return;
      
      setIsLoadingPredictions(true);
      try {
        const token = user?.id ? await supabase.auth.getSession().then(({ data }: {data: {session: Session | null}}) => data.session?.access_token) : null;
        
        const response = await fetch(`/api/predictions?session_type=sprint&race_id=${nextSprint.round}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.prediction) {
            const pred = data.prediction;
            
            // Populate drivers (only 8 for sprints)
            const fetchedDrivers = [
              pred.sp1_driver, pred.sp2_driver, pred.sp3_driver, pred.sp4_driver, 
              pred.sp5_driver, pred.sp6_driver, pred.sp7_driver, pred.sp8_driver
            ];
            setSelectedDrivers(fetchedDrivers);

            // Populate constructors (only 5 for sprints)
            const fetchedConstructors = [
              pred.c1_constructor, pred.c2_constructor, pred.c3_constructor, 
              pred.c4_constructor, pred.c5_constructor
            ];
            setSelectedConstructors(fetchedConstructors);

            // Populate bonus
            setBonusValues({
              pole_position: pred.pole_position || "",
              fastest_lap: pred.fastest_lap || "",
              first_retirement: pred.first_retirement || "",
              safety_car: pred.safety_car || false,
              red_flag: pred.red_flag || false,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch sprint predictions:", error);
      } finally {
        setIsLoadingPredictions(false);
      }
    }

    if (nextSprint?.round && user) {
        fetchPredictions();
    }
  }, [nextSprint?.round, user, isAuthenticated]);

  const handleDriversChange = useCallback((drivers: (string | null)[]) => {
    setSelectedDrivers(drivers)
  }, [])

  const handleConstructorsChange = useCallback((constructors: (string | null)[]) => {
    setSelectedConstructors(constructors)
  }, [])

  const handleBonusChange = useCallback((values: BonusValues) => {
    setBonusValues(values)
  }, [])

  const handleAutoFill = useCallback(() => {
    // Randomize and select top 8 drivers
    const drivers = Object.keys(DRIVERS)
    const shuffledDrivers = [...drivers].sort(() => Math.random() - 0.5)
    setSelectedDrivers(shuffledDrivers.slice(0, 8))
    
    // Randomize and select top 5 constructors
    const teams = Object.keys(TEAMS)
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5)
    setSelectedConstructors(shuffledTeams.slice(0, 5))
    
    // Randomly select bonus values
    const randomDriver = () => drivers[Math.floor(Math.random() * drivers.length)]
    setBonusValues({
      pole_position: randomDriver(),
      fastest_lap: randomDriver(),
      first_retirement: randomDriver(),
      safety_car: Math.random() > 0.5,
      red_flag: Math.random() > 0.5,
    })
  }, [])

  // Count filled bonus fields
  const bonusFilledCount = [
    bonusValues.pole_position,
    bonusValues.fastest_lap,
    bonusValues.first_retirement,
  ].filter(p => p !== null && p !== undefined && p !== "").length

  // Filter out nulls for counts
  const filledDriversCount = selectedDrivers.filter(Boolean).length
  const filledConstructorsCount = selectedConstructors.filter(Boolean).length

  // Calculate dynamic style for prediction elements
  const accentStyle = primaryColor 
    ? (() => {
        const hsl = hexToHsl(primaryColor);
        if (hsl) {
          // Define the H S L values for the CSS variable
          return { '--prediction-accent': `${hsl.h} ${hsl.s}% ${hsl.l}%` } as React.CSSProperties;
        }
        return {};
      })()
    : {};

  const handleSubmit = async () => {
    if (!isAuthenticated || !nextSprint?.round) return;

    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const token = user?.id ? await supabase.auth.getSession().then(({ data }: {data: {session: Session | null}}) => data.session?.access_token) : null;
      
      const payload = {
        session_type: 'sprint',
        race_id: nextSprint.round,
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
        throw new Error(errorData.error || 'Failed to submit predictions');
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  if (loading || isLoadingPredictions) return <PageLoader />

  return (
    <>
      <F1Header variant="Home" activeNav="SprintPredictions" primaryColor={primaryColor} isAuthenticated={isAuthenticated} username={displayUsername} />

      <main 
        className="container mx-auto px-4 py-8 space-y-8 flex-1"
        style={accentStyle}
      >
        {/* Race Info Banner */}
        <FeatureRace race = {nextSprint}/>

        {/* Prediction content visible only if open */}
        {isPredictionsOpen ? (
          <>
            {/* Top 8 Drivers */}
            <section className="prediction-section">
              <div className="prediction-section-title">
                <h2>Top 8 Sprint Drivers</h2>
                <span className="max-pts">max 36 pts</span>
              </div>
              <DriverDragDrop
                selected={selectedDrivers}
                onChange={handleDriversChange}
                slotCount={8}
                points={[8, 7, 6, 5, 4, 3, 2, 1]}
              />
            </section>

            {/* Top 5 Constructors */}
            <section className="prediction-section">
              <div className="prediction-section-title">
                <h2>Top 5 Sprint Constructors</h2>
                <span className="max-pts">max 30 pts</span>
              </div>
              <ConstructorDragDrop
                selected={selectedConstructors}
                onChange={handleConstructorsChange}
                points={[8, 7, 6, 5, 4]}
                poolLabel="Remaining Constructors — 4 pts each if in top 5"
              />
            </section>

            {/* Bonus Predictions */}
            <section className="prediction-section">
              <div className="prediction-section-title">
                <h2>Bonus Predictions</h2>
                <span className="max-pts">max 40 pts</span>
              </div>
              <BonusPredictions
                values={bonusValues}
                onChange={handleBonusChange}
              />
            </section>

            {/* Summary & Submit */}
            <section className="prediction-section">
                {submitError && (
                  <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg text-center mb-4">
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="bg-green-500/20 border border-green-500 text-white p-3 rounded-lg text-center mb-4">
                    Predictions saved successfully!
                  </div>
                )}
                <PredictionSummary
                  driverCount={filledDriversCount}
                  constructorCount={filledConstructorsCount}
                  totalConstructors={5}
                  bonusCount={bonusFilledCount}
                  totalBonusFields={3}
                  totalDrivers={8}
                  labels={{
                    drivers: "Top 8 Drivers"
                  }}
                  maxPoints={{
                      drivers: 36,
                      constructors: 30,
                      bonus: 40
                  }}
                  onAutoFill={handleAutoFill}
                  onSubmit={handleSubmit}
                />
            </section>
          </>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Predictions are currently locked</h3>
            <p className="text-white/60 max-w-md mx-auto">
              Sprint predictions unlock immediately after the previous race weekend concludes. 
              Check the countdown above to see when this race session begins!
            </p>
          </div>
        )}
      </main>

      <F1Footer primaryColor={primaryColor} />
    </>
  )
}
