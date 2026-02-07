"use client"

import { useEffect, useState } from "react"
import { Calendar, Flag, Clock } from "lucide-react"

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    function calculate() {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      }
    }

    setTimeLeft(calculate())
    const interval = setInterval(() => setTimeLeft(calculate()), 60000)
    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

export function UpcomingRace() {
  const predictionClose = new Date("2026-03-02T12:00:00Z")
  const { days, hours, minutes } = useCountdown(predictionClose)

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        {/* Outer glow wrapper */}
        <div className="relative rounded-2xl p-[2px]">
          {/* Animated glow border */}
          <div className="animate-glow-pulse absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/60 via-primary/30 to-primary/60 blur-sm" />
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50" />

          {/* Card content */}
          <div className="relative overflow-hidden rounded-2xl bg-card">
            {/* Subtle track map background SVG */}
            <div className="absolute inset-0 opacity-[0.06]">
              <svg viewBox="0 0 800 400" className="h-full w-full" aria-hidden="true">
                <path
                  d="M100,200 Q150,50 250,100 T400,80 Q500,60 550,150 T700,200 Q750,300 650,320 T400,340 Q250,350 200,280 T100,200"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {/* Top glow accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="relative z-10 flex flex-col items-center gap-5 p-8">
              <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Upcoming Race
              </h2>

              {/* Inner race info card with its own blue glow border */}
              <div className="relative w-full max-w-md rounded-xl p-[1px]">
                {/* Inner glow border */}
                <div className="animate-glow-pulse absolute -inset-[1px] rounded-xl bg-gradient-to-b from-primary/40 via-primary/20 to-primary/40 blur-[2px]" />
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-primary/30 via-primary/10 to-primary/30" />

                <div className="relative rounded-xl bg-secondary/80 p-6 text-center backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl" role="img" aria-label="Bahrain flag">
                      {"\uD83C\uDDE7\uD83C\uDDED"}
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                      Bahrain Grand Prix
                    </h3>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      March 2, 2026
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Flag className="h-4 w-4 text-primary" />
                      57 Laps
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      15:00 GMT
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-primary/15 bg-background/60 px-4 py-3 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Predictions close in:</span>
                    <span className="font-display font-bold text-foreground">
                      {days}d {hours}h {minutes}m
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom glow accent line */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
