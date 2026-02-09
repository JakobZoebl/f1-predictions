import { Link } from "react-router-dom"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden px-4 py-20 md:min-h-[480px]">
      {/* Background placeholder -- dark gradient simulating a track scene */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(210 30% 8%) 0%, hsl(210 40% 14%) 30%, hsl(210 25% 10%) 70%, hsl(210 35% 6%) 100%)",
        }}
      />
      {/* Simulated track lighting streaks */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "linear-gradient(160deg, transparent 30%, hsl(210 20% 25%) 45%, transparent 55%), linear-gradient(200deg, transparent 40%, hsl(210 15% 20%) 55%, transparent 65%)",
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
