import { F1Button } from "@/frontend/landing/F1Button"
import heroBg from "@/assets/landing_page_background.png"
import "@/frontend/styles/HeroSection.css"

export function HeroSection() {
  return (
    <section className="hero-section">
      {/* Background image */}
      <div
        className="hero-bg-image"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />
      {/* Dark overlay for text legibility */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          {"Predict. Compete. Win."}
        </h1>

        <div className="hero-buttons">
          <F1Button to="/signup" variant="default">
            {"Get Started - Sign Up"}
          </F1Button>
          <F1Button to="/leaderboard" variant="outline">
            {"View Current Standings"}
          </F1Button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="hero-bottom-fade" />
    </section>
  )
}
