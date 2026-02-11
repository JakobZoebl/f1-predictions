import { Routes, Route } from 'react-router-dom'
import LandingPage from "@/components/landing/LandingPage"
import Login from "@/pages/Login"
import SignUp from "@/pages/SignUp"
import ProfilePage from "@/pages/ProfilePage"
import TemplatePage from "@/pages/TemplatePage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/template" element={<TemplatePage />} />
    </Routes>
  )
}

export default App
