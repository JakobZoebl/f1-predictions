
import { F1Header } from "@/frontend/components/f1-header"
import { HeroSection } from "@/frontend/components/hero-section"
import { FeaturesSection } from "@/frontend/landing/FeaturesSection"
import { UpcomingRaceSection } from "@/frontend/landing/UpcomingRaceSection"
import { F1Footer } from "@/frontend/components/f1-footer"
import "@/frontend/styles/LandingPage.css"

export default function LandingPage() {
  return (
    <main className="landing-page-main">
      <F1Header variant="landing" isAuthenticated={false} />
      <HeroSection />
      <FeaturesSection />
      <UpcomingRaceSection />
      <F1Footer />
    </main>
  )
}
