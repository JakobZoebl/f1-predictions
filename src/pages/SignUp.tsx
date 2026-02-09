import { F1Background } from "@/components/f1/f1-background"
import "./SignUp.css"
import { F1Header } from "@/components/f1/f1-header"
import { F1Footer } from "@/components/f1/f1-footer"
import { SignupContainer } from "@/components/f1/signup-container"

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
