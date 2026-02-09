import { Routes, Route } from 'react-router-dom'
import LandingPage from "@/components/landing/LandingPage"
import Login from "@/pages/Login"
import SignUp from "@/pages/SignUp"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

export default App
