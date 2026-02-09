"use client"

import { Calendar, Flag, Clock } from "lucide-react"
import { useEffect, useState } from "react"

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 60_000) // update every minute
    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return { days, hours, minutes }
}

export function UpcomingRaceSection() {
  const raceDate = new Date("2026-03-02T15:00:00Z")
  const { days, hours, minutes } = useCountdown(raceDate)

  return (
    <section className="px-4 pb-16 md:pb-20">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-xl border border-f1-card-border bg-f1-card/60 backdrop-blur-sm">
        {/* Red accent top edge */}
        <div className="h-1 w-full bg-gradient-to-r from-f1-red via-f1-red/60 to-transparent" />

        {/* Circuit map placeholder background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg
            className="h-full w-full"
            viewBox="0 0 600 300"
            fill="none"
            aria-hidden="true"
          >
            {/* Simplified circuit path placeholder */}
            <path
              d="M100 200 C100 100, 200 50, 300 80 S450 150, 500 100 S550 50, 500 200 S350 250, 300 220 S150 280, 100 200Z"
              stroke="hsl(211 100% 50%)"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="100" cy="200" r="4" fill="hsl(0 72% 51%)" />
          </svg>
        </div>

        <div className="relative flex flex-col items-center gap-4 px-6 py-8 text-center">
          <h2 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            UPCOMING RACE
          </h2>

          {/* Inner race info card */}
          <div className="w-full max-w-md rounded-lg border border-f1-neon/30 bg-background/50 px-6 py-5 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <h3 className="text-xl font-bold text-foreground md:text-2xl">
                Bahrain Grand Prix
              </h3>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  March 2, 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <Flag className="h-3.5 w-3.5" />
                  57 Laps
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  15:00 GMT
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
                <span className="text-muted-foreground">
                  {"Predictions close in:"}
                </span>
                <Clock className="h-4 w-4 text-f1-neon" />
                <span className="font-bold">
                  {`${days}d ${hours}h ${minutes}m`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
