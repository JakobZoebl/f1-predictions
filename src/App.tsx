import { Routes, Route } from 'react-router-dom'
import LandingPage from "@/frontend/landing/LandingPage"
import Login from "@/frontend/pages/Login"
import SignUp from "@/frontend/pages/SignUp"
import ProfilePage from "@/frontend/pages/ProfilePage"
import TemplatePage from "@/frontend/pages/TemplatePage"
import Leaderboard from "@/frontend/pages/Leaderboard"
import RacePredictions from "@/frontend/pages/RacePredictions"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/template" element={<TemplatePage />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/race-predictions" element={<RacePredictions />} />
    </Routes>
  )
}

export default App
