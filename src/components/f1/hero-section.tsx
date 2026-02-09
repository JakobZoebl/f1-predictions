import { Link } from "react-router-dom"
import heroBg from "@/assets/template_files/landing_page_background.png"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden px-4 py-20 md:min-h-[480px]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />
      {/* Dark overlay for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-background/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-7xl">
          {"Predict. Compete. Win."}
        </h1>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            to="/signup"
            className="inline-flex h-12 items-center rounded-full bg-f1-neon px-8 text-sm font-bold tracking-wide text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-f1-neon focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {"Get Started - Sign Up"}
          </Link>
          <Link
            to="/standings"
            className="inline-flex h-12 items-center rounded-full border border-f1-card-border bg-secondary/80 px-8 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-f1-neon focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {"View Current Standings"}
          </Link>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
