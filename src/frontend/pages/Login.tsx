import { F1Background } from "@/frontend/components/blank-background"
import "@/frontend/styles/Login.css"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import { LoginContainer } from "@/frontend/components/login-container"

export default function Login() {
  return (
    <F1Background>
      <F1Header variant="back" backHref="/" />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <LoginContainer />
      </main>
      <F1Footer />
    </F1Background>
  )
}
