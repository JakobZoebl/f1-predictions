import { F1Header } from "@/components/f1/f1-header"
import { HeroSection } from "@/components/f1/hero-section"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { UpcomingRace } from "@/components/landing/UpcomingRace"
import { F1Footer } from "@/components/f1/f1-footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <F1Header variant="landing" />
      <HeroSection />
      <FeaturesSection />
      <UpcomingRace />
      <F1Footer />
    </main>
  )
}
