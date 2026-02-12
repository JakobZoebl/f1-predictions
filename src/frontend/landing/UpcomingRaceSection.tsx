import { Link } from "react-router-dom"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import "@/frontend/styles/UpcomingRace.css"

export function UpcomingRaceSection() {
  return (
    <section className="upcoming-race-section">
      <FeatureRace
        className="max-w-6xl"
        renderActions={(colors) => (
          <Link to="/race-predictions">
            <button 
              className="predict-button" 
              style={{ 
                  backgroundColor: colors.primary,
                  color: '#ffffff',
                  '--btn-glow': colors.secondary 
              } as React.CSSProperties}
            >
              Make your predictions
            </button>
          </Link>
        )}
      />
    </section>
  )
}
