import { useAuth } from "@/frontend/auth/AuthContext"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import { F1Background as BlankBackground } from "@/frontend/components/blank-background"
import "@/frontend/styles/Impressum.css"

export default function Impressum() {
  const { user } = useAuth()
  const isAuthenticated = !!user

  return (
    <BlankBackground>
      <div className="relative z-10 min-h-screen flex flex-col w-full">
        <F1Header variant={isAuthenticated ? "Home" : "landing"} isAuthenticated={isAuthenticated} activeNav="" />
        
        <main className="impressum-main">
          <div className="impressum-content-card">
            <h1 className="impressum-title">Impressum</h1>
            
            <div className="impressum-section">
              <p>
                Jakob Zöbl<br />
                Arnikastraße 7<br />
                4600 Wels<br />
              </p>
            </div>

            <div className="impressum-section">
              <h2>Kontakt</h2>
              <p>
                Telefon: +43 (0) 677 639 71 639<br />
                E-Mail: info@f1-predictions.invalid
              </p>
            </div>

            <div className="impressum-section disclaimer">
               <p>This is a hobby project and is not affiliated with, endorsed, or sponsored by Formula One. All Formula 1 brands and logos are the property of their respective owners.</p>
            </div>
          </div>
        </main>
        
        <F1Footer />
      </div>
    </BlankBackground>
  )
}
