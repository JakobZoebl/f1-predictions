import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from "@/frontend/auth/AuthContext"
import { UserProfileProvider } from "@/lib/hooks/UserProfileContext"
import { AuthCallback } from "@/frontend/auth/AuthCallback"
import LandingPage from "@/frontend/pages/LandingPage"
import Login from "@/frontend/pages/Login"
import SignUp from "@/frontend/pages/SignUp"
import ProfilePage from "@/frontend/pages/ProfilePage"
import Leaderboard from "@/frontend/pages/Leaderboard"
import RacePredictions from "@/frontend/pages/RacePredictions"
import Home from "@/frontend/pages/Home"


import { BackgroundLayout } from "@/frontend/components/BackgroundLayout"
import SeasonOverview from "@/frontend/pages/SeasonOverview"
import SeasonPredictions from "@/frontend/pages/SeasonPredictions"
import ProfileSettings from "@/frontend/pages/ProfileSettings"
import RaceResults from "@/frontend/pages/RaceResults"
import { BackgroundProvider } from "@/frontend/components/BackgroundContext"


function App() {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <BackgroundProvider>
          <Routes>
            {/* Public / Auth routes (they have their own specific backgrounds) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            
            {/* Authenticated routes wrapped with the team/driver background layout */}
            <Route element={<BackgroundLayout />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/race-predictions" element={<RacePredictions />} />
              <Route path="/season-predictions" element={<SeasonPredictions />} />
              <Route path="/season-overview" element={<SeasonOverview />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile-settings" element={<ProfileSettings />} />
              <Route path="/race-results" element={<RaceResults />} />
            </Route>
          </Routes>
        </BackgroundProvider>
      </UserProfileProvider>

    </AuthProvider>
  )
}

export default App
