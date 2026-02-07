import { Navbar } from "@/components/landing/Navbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { UpcomingRace } from "@/components/landing/UpcomingRace"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <UpcomingRace />
      <Footer />
    </main>
  )
}
