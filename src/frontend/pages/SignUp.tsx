import { F1Background } from "@/frontend/components/blank-background"
import "@/frontend/styles/SignUp.css"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import { SignupContainer } from "@/frontend/auth/SignupContainer"

export default function SignUp() {
  return (
    <F1Background>
      <F1Header variant="back" backHref="/" />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <SignupContainer />
      </main>
      <F1Footer />
    </F1Background>
  )
}
