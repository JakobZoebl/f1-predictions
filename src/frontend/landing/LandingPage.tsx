import { Link } from "react-router-dom"
import { F1Header } from "@/frontend/components/f1-header"
import { HeroSection } from "@/frontend/components/hero-section"
import { FeaturesSection } from "@/frontend/landing/FeaturesSection"
import { UpcomingRaceSection } from "@/frontend/landing/UpcomingRaceSection"
import { F1Footer } from "@/frontend/components/f1-footer"
import "@/frontend/styles/LandingPage.css"

export default function LandingPage() {
  return (
    <main className="landing-page-main">
      <F1Header variant="landing">
        <nav className="header-right-nav" aria-label="Auth navigation">
          <Link to="/profile" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Profile
          </Link>
          <Link to="/login" className="header-login-btn">
            Login
          </Link>
          <Link to="/signup" className="header-signup-btn">
            Sign Up
          </Link>
        </nav>
      </F1Header>
      <HeroSection />
      <FeaturesSection />
      <UpcomingRaceSection />
      <F1Footer />
    </main>
  )
}
