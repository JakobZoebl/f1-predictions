"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { RACES } from "@/lib/f1-presets"
import ReactCountryFlag from "react-country-flag"
import "@/frontend/styles/UpcomingRace.css"

// Helper to load track assets dynamically
function getTrackAssetUrl(trackImage: string) {
  return new URL(`../../assets/tracks/${trackImage}`, import.meta.url).href
}

function useCountdown(targetDate: Date) {
  const calculate = useCallback(() => {
    const now = new Date()
    const diff = targetDate.getTime() - now.getTime()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }, [targetDate])

  const [timeLeft, setTimeLeft] = useState(calculate)

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calculate()), 1000)
    return () => clearInterval(interval)
  }, [calculate])

  return timeLeft
}

interface FeatureRaceProps {
  className?: string
  style?: React.CSSProperties
  renderActions?: (raceColors: { primary: string; secondary: string }) => React.ReactNode
}

export function FeatureRace({ className, style, renderActions }: FeatureRaceProps) {
    // Logic to find the next upcoming race
    const nextRace = useMemo(() => {
        if (!RACES || RACES.length === 0) return null
        // Find the first race in the future
        const now = new Date()
        const upcoming = RACES.find(r => {
            const raceTime = new Date(`${r.date}T${r.time.split(' ')[0]}:00Z`)
            return raceTime > now
        })
        return upcoming || RACES[0]
    }, [])

    const raceDate = useMemo(() => {
        if (!nextRace) return new Date()
        try {
             const timePart = nextRace.time.split(' ')[0]
             const timeWithSeconds = timePart.length === 5 ? `${timePart}:00` : timePart
             return new Date(`${nextRace.date}T${timeWithSeconds}Z`)
        } catch (e) {
            console.error("Date parsing error", e)
            return new Date()
        }
    }, [nextRace])

    const { days, hours, minutes } = useCountdown(raceDate)

    if (!nextRace) return <div className="p-8 text-center text-white">No upcoming races found</div>

  return (
    <div 
        className={`upcoming-race-container ${className || ''}`}
        style={{
            ...style,
            // @ts-expect-error - Custom CSS variables for dynamic colors
            '--race-primary-color': nextRace.colors.primary,
            '--race-secondary-color': nextRace.colors.secondary,
            '--race-primary-color-dim': `${nextRace.colors.primary}40`,
        }}
    >
        <div 
            className="race-card-container"
            style={{ background: 'transparent' }} 
        >
            {/* Left Side: Information & Countdown */}
            <div className="race-content-left">
                <div className="race-content-top">
                    <span className="upcoming-label whitespace-nowrap">Upcoming Race</span>
                    
                    {/* Meta Info Row */}
                    <div className="flex items-center gap-3 text-sm font-medium text-white">
                         <div className="flex items-center">
                            <ReactCountryFlag 
                                countryCode={nextRace.countryCode} 
                                svg 
                                style={{
                                    width: '1.5em',
                                    height: '1.1em',
                                }}
                                title={nextRace.country}
                            />
                        </div>
                        <span className="font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: nextRace.colors.primary }}>
                            Round {nextRace.round}
                        </span>
                        <span className="text-white/30">•</span>
                        <span className="whitespace-nowrap">
                            {new Date(nextRace.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                        </span>
                         <span className="text-white/30">•</span>
                        <span className="whitespace-nowrap">
                            {nextRace.time}
                        </span>
                         <span className="text-white/30">•</span>
                        <span className="whitespace-nowrap">
                            {nextRace.laps} Laps
                        </span>
                    </div>
                </div>
                    
                {/* Countdown */}
                <div className="race-countdown-compact mb-4">
                    <div className="countdown-grid">
                        <div className="countdown-item">
                            <span className="countdown-value">{days.toString().padStart(2, '0')}</span>
                            <span className="countdown-unit" style={{ color: nextRace.colors.primary }}>D</span>
                        </div>
                        <div className="countdown-item">
                            <span className="countdown-value">{hours.toString().padStart(2, '0')}</span>
                            <span className="countdown-unit" style={{ color: nextRace.colors.primary }}>H</span>
                        </div>
                        <div className="countdown-item">
                            <span className="countdown-value">{minutes.toString().padStart(2, '0')}</span>
                            <span className="countdown-unit" style={{ color: nextRace.colors.primary }}>M</span>
                        </div>
                    </div>
                </div>

                <div className="race-details-center">
                    <h2 className="race-title-large leading-tight">
                        {nextRace.country} <br/> Grand Prix
                    </h2>
                    
                    <div className="race-meta-row mt-2">
                        <span className="text-white/70 italic">{nextRace.circuit}</span>
                    </div>
                </div>

                {renderActions && (
                    <div className="race-actions-bottom">
                        {renderActions(nextRace.colors)}
                    </div>
                )}
            </div>

            {/* Right Side: Track Map */}
            <div className="race-track-right">
                <img 
                    src={getTrackAssetUrl(nextRace.trackImage)} 
                    alt={nextRace.circuit} 
                    className="track-map-img" 
                />
            </div>

        </div>
    </div>
  )
}
