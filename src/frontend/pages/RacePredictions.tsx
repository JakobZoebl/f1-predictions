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
import { useNextRace } from "@/lib/hooks/useNextRace"
import { DRIVERS, TEAMS } from "@/lib/f1-presets"
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

export default function RacePredictions() {
  const { user } = useAuth()
  const { profile, loading } = useUserProfile()

  const isAuthenticated = !!user
  const displayUsername = profile?.username || user?.user_metadata?.username || "User"

  const [selectedDrivers, setSelectedDrivers] = useState<(string | null)[]>(Array(10).fill(null))
  const [selectedConstructors, setSelectedConstructors] = useState<(string | null)[]>(Array(5).fill(null))
  const [bonusValues, setBonusValues] = useState<BonusValues>(INITIAL_BONUS)

  const nextRace = useNextRace()
  const primaryColor = nextRace?.colors?.primary

  const { isOpen: isPredictionsOpen } = getEventStatus(nextRace)

  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)

  // Fetch existing predictions
  useEffect(() => {
    async function fetchPredictions() {
      if (!isAuthenticated || !nextRace?.round) return;
      
      setIsLoadingPredictions(true);
      try {
        const token = user?.id ? await supabase.auth.getSession().then(({ data }: {data: {session: Session | null}}) => data.session?.access_token) : null;
        
        const response = await fetch(`/api/predictions?session_type=race&race_id=${nextRace.round}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.prediction) {
            const pred = data.prediction;
            
            // Populate drivers
            const fetchedDrivers = [
              pred.p1_driver, pred.p2_driver, pred.p3_driver, pred.p4_driver, pred.p5_driver,
              pred.p6_driver, pred.p7_driver, pred.p8_driver, pred.p9_driver, pred.p10_driver
            ];
            setSelectedDrivers(fetchedDrivers);

            // Populate constructors
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
        console.error("Failed to fetch predictions:", error);
      } finally {
        setIsLoadingPredictions(false);
      }
    }

    if (nextRace?.round && user) {
        fetchPredictions();
    }
  }, [nextRace?.round, user, isAuthenticated]);

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
    // Randomize and select top 10 drivers
    const drivers = Object.keys(DRIVERS)
    const shuffledDrivers = [...drivers].sort(() => Math.random() - 0.5)
    setSelectedDrivers(shuffledDrivers.slice(0, 10))

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
    if (!isAuthenticated || !nextRace?.round) return;

    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const token = user?.id ? await supabase.auth.getSession().then(({ data }: {data: {session: Session | null}}) => data.session?.access_token) : null;
      
      const payload = {
        session_type: 'race',
        race_id: nextRace.round,
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
      <F1Header variant="Home" activeNav="RacePredictions" primaryColor={primaryColor} isAuthenticated={isAuthenticated} username={displayUsername} />

      <main 
        className="container mx-auto px-4 py-8 space-y-8 flex-1"
        style={accentStyle}
      >
        {/* Race Info Banner */}
        <FeatureRace />

        {/* Prediction content visible only if open */}
        {isPredictionsOpen ? (
          <>
            {/* Top 10 Drivers */}
            <section className="prediction-section">
              <div className="prediction-section-title">
                <h2>Top 10 Drivers</h2>
                <span className="max-pts">max 101 pts</span>
              </div>
              <DriverDragDrop
                selected={selectedDrivers}
                onChange={handleDriversChange}
              />
            </section>

            {/* Top 5 Constructors */}
            <section className="prediction-section">
              <div className="prediction-section-title">
                <h2>Top 5 Constructors</h2>
                <span className="max-pts">max 80 pts</span>
              </div>
              <ConstructorDragDrop
                selected={selectedConstructors}
                onChange={handleConstructorsChange}
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
                bonusCount={bonusFilledCount}
                totalBonusFields={3}
                onAutoFill={handleAutoFill}
                onSubmit={handleSubmit}
                />
            </section>
          </>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Predictions are currently locked</h3>
            <p className="text-white/60 max-w-md mx-auto">
              Race predictions unlock immediately after the previous race weekend concludes. 
              Check the countdown above to see when this race session begins!
            </p>
          </div>
        )}
      </main>

      <F1Footer primaryColor={primaryColor} />
    </>
  )
}
