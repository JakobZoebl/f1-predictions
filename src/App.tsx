import { Routes, Route } from 'react-router-dom'
import LandingPage from "@/components/landing/LandingPage"
import Login from "@/pages/Login"
import SignUp from "@/pages/SignUp"
import TestPage from "@/pages/TestPage"
import TemplatePage from "@/pages/TemplatePage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/template" element={<TemplatePage />} />
    </Routes>
  )
}

export default App
