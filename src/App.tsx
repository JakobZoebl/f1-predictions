import { Routes, Route } from 'react-router-dom'
import LandingPage from "@/frontend/pages/LandingPage"
import Login from "@/frontend/pages/Login"
import SignUp from "@/frontend/pages/SignUp"
import ProfilePage from "@/frontend/pages/ProfilePage"
import Leaderboard from "@/frontend/pages/Leaderboard"
import RacePredictions from "@/frontend/pages/RacePredictions"
import Home from "@/frontend/pages/Home"

import SeasonOverview from "@/frontend/pages/SeasonOverview"
import ProfileSettings from "@/frontend/pages/ProfileSettings"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/race-predictions" element={<RacePredictions />} />
      <Route path="/season-overview" element={<SeasonOverview />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile-settings" element={<ProfileSettings />} />
    </Routes>
  )
}

export default App
