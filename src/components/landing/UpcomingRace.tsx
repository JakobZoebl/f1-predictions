"use client"

import { useEffect, useState, useCallback } from "react"
import { Calendar, Flag, Clock } from "lucide-react"
import "@/styles/UpcomingRace.css"

function useCountdown(targetDate: Date) {
  const calculate = useCallback(() => {
    const now = new Date()
    const diff = targetDate.getTime() - now.getTime()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
    }
  }, [targetDate])

  const [timeLeft, setTimeLeft] = useState(calculate)

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calculate()), 60000)
    return () => clearInterval(interval)
  }, [calculate])

  return timeLeft
}

const predictionClose = new Date("2026-03-02T12:00:00Z")

export function UpcomingRace() {
  const { days, hours, minutes } = useCountdown(predictionClose)

  return (
    <section className="upcoming-race-section">
      <div className="upcoming-race-container">
        {/* Outer glow wrapper */}
        <div className="race-card-outer">
          {/* Animated glow border */}
          <div className="glow-pulse-border" />
          <div className="glow-border" />

          {/* Card content */}
          <div className="race-card-inner">
            {/* Subtle track map background SVG */}
            <div className="track-map-overlay">
              <svg viewBox="0 0 800 400" className="track-map-svg" aria-hidden="true">
                <path
                  d="M100,200 Q150,50 250,100 T400,80 Q500,60 550,150 T700,200 Q750,300 650,320 T400,340 Q250,350 200,280 T100,200"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {/* Top glow accent line */}
            <div className="card-top-accent" />

            <div className="card-content-wrapper">
              <h2 className="section-title">
                Upcoming Race
              </h2>

              {/* Inner race info card with its own blue glow border */}
              <div className="race-info-card-outer">
                {/* Inner glow border */}
                <div className="race-info-glow-pulse" />
                <div className="race-info-glow" />

                <div className="race-info-card-inner">
                  <div className="race-header">
                    <span className="race-flag" role="img" aria-label="Bahrain flag">
                      {"\uD83C\uDDE7\uD83C\uDDED"}
                    </span>
                    <h3 className="race-title">
                      Bahrain Grand Prix
                    </h3>
                  </div>

                  <div className="race-details-wrapper">
                    <span className="race-detail-item">
                      <Calendar className="race-detail-icon" />
                      March 2, 2026
                    </span>
                    <span className="race-detail-item">
                      <Flag className="race-detail-icon" />
                      57 Laps
                    </span>
                    <span className="race-detail-item">
                      <Clock className="race-detail-icon" />
                      15:00 GMT
                    </span>
                  </div>

                  <div className="countdown-wrapper">
                    <Clock className="race-detail-icon" />
                    <span className="countdown-text">Predictions close in:</span>
                    <span className="countdown-timer">
                      {days}d {hours}h {minutes}m
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom glow accent line */}
            <div className="card-bottom-accent" />
          </div>
        </div>
      </div>
    </section>
  )
}
