import { Link } from "react-router-dom"
import { F1Header } from "@/components/f1/f1-header"
import { HeroSection } from "@/components/f1/hero-section"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { UpcomingRace } from "@/components/landing/UpcomingRace"
import { F1Footer } from "@/components/f1/f1-footer"
import "@/styles/LandingPage.css"

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
      <UpcomingRace />
      <F1Footer />
    </main>
  )
}
