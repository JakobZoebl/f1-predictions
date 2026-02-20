
import { F1Header } from "@/frontend/components/f1-header"
import { HeroSection } from "@/frontend/landing/HeroSection"
import { UpcomingRaceSection } from "@/frontend/landing/UpcomingRaceSection"
import { F1Footer } from "@/frontend/components/f1-footer"
import { FeaturesSection } from "@/frontend/landing/FeaturesSection"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/useUserProfile"
import "@/frontend/styles/LandingPage.css"

export default function LandingPage() {
  const { user } = useAuth()
  const { profile } = useUserProfile()

  const isAuthenticated = !!user
  const displayUsername = profile?.username || user?.user_metadata?.username || "User"

  return (
    <main className="landing-page-main">
      <F1Header variant="landing" isAuthenticated={isAuthenticated} username={displayUsername} />
      <HeroSection />
      <FeaturesSection />
      <UpcomingRaceSection />
      <F1Footer />
    </main>
  )
}
