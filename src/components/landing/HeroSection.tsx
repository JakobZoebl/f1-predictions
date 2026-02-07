import { Button } from "@/components/ui/button"
import heroBg from "@/assets/template_files/landing_page_background.png"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/40 to-background" />
      {/* Blue tint overlay */}
      <div className="absolute inset-0 bg-primary/5" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-20 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground drop-shadow-lg sm:text-5xl md:text-7xl">
          <span className="text-balance">Predict. Compete. Win.</span>
        </h1>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="rounded-full bg-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/50"
          >
            Get Started - Sign Up
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-foreground/30 bg-transparent px-8 py-6 text-base font-semibold text-foreground backdrop-blur-sm hover:border-foreground/60 hover:bg-foreground/10 hover:text-foreground"
          >
            View Current Standings
          </Button>
        </div>
      </div>
    </section>
  )
}
