import { F1Background } from "@/components/f1/f1-background"
import "@/styles/Login.css"
import { F1Header } from "@/components/f1/f1-header"
import { F1Footer } from "@/components/f1/f1-footer"
import { LoginContainer } from "@/components/f1/login-container"

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
