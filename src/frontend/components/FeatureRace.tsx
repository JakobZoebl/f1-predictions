"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { RACES, SPRINTS } from "@/lib/f1-presets"
import { getEventStatus } from "@/lib/event-utils"
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

import type { RaceEvent } from "@/lib/f1-presets"

interface FeatureRaceProps {
  className?: string
  style?: React.CSSProperties
  renderActions?: (raceColors: { primary: string; secondary: string }) => React.ReactNode
  race?: RaceEvent
  /** When true, hides the countdown and shows score/rank instead */
  resultsMode?: boolean
  userScore?: number
  userMaxScore?: number
  userRank?: number
}

export function FeatureRace({ className, style, renderActions, race, resultsMode, userScore, userMaxScore, userRank }: FeatureRaceProps) {
    // Logic to find the next upcoming race (only if race prop is not provided)
    const nextRace = useMemo(() => {
        if (race) return race
        if (!RACES || RACES.length === 0) return null
        
        const allEvents = [...RACES, ...SPRINTS].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time.split(' ')[0]}:00Z`);
            const dateB = new Date(`${b.date}T${b.time.split(' ')[0]}:00Z`);
            return dateA.getTime() - dateB.getTime();
        });

        // Find the first event where results are not yet available (now < 00:00 day after event.date)
        const now = new Date()
        const upcoming = allEvents.find(r => {
            const resultsDay = new Date(r.date);
            resultsDay.setUTCDate(resultsDay.getUTCDate() + 1);
            resultsDay.setUTCHours(0, 0, 0, 0);
            return resultsDay > now
        })
        return upcoming || allEvents[allEvents.length - 1]
    }, [race])

    const targetDate = useMemo(() => {
        if (!nextRace) return new Date()
        try {
            if (nextRace.cutoff) {
                return new Date(nextRace.cutoff.replace(' ', 'T') + ':00Z')
            }
             const timePart = nextRace.time.split(' ')[0]
             const timeWithSeconds = timePart.length === 5 ? `${timePart}:00` : timePart
             return new Date(`${nextRace.date}T${timeWithSeconds}Z`)
        } catch (e) {
            console.error("Date parsing error", e)
            return new Date()
        }
    }, [nextRace])

    const { isOpen: isPredictionsOpen, isLocked, unlocksAt } = useMemo(() => getEventStatus(nextRace), [nextRace])

    const { days, hours, minutes } = useCountdown(targetDate)

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
        >
            {/* Left Side: Information & Countdown */}
            <div className="race-content-left">
                <div className="race-content-top">
                    <span className="upcoming-label whitespace-nowrap">
                        {isPredictionsOpen ? (
                            nextRace.name.includes("Sprint") ? "Sprint Race" : "Grand Prix"
                        ) : nextRace.name.includes("Sprint") ? "Upcoming Sprint" : "Upcoming Grand Prix"}
                    </span>
                    
                    {/* Meta Info Row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-white">
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
                    
                {/* Countdown OR Results Score OR Cancelled Badge */}
                {nextRace.isCancelled ? (
                    <div className="race-cancelled-badge mb-4">
                        CANCELLED
                    </div>
                ) : resultsMode ? (
                    <div className="race-results-score mb-4">
                        <div className="race-results-score-item">
                            <span className="race-results-score-value" style={{ color: nextRace.colors.primary }}>
                                {userScore ?? 0}
                            </span>
                            <span className="race-results-score-label">
                                {userMaxScore !== undefined ? `/ ${userMaxScore} pts` : 'pts'}
                            </span>
                        </div>
                        {userRank !== undefined && (
                            <div className="race-results-rank-badge" style={{ borderColor: `${nextRace.colors.primary}60`, color: nextRace.colors.primary }}>
                                #{userRank} this race
                            </div>
                        )}
                    </div>
                ) : (
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
                )}

                <div className="race-details-center">
                    <h2 className="race-title-large leading-tight">
                        {nextRace.country} <br/> {nextRace.name.includes("Sprint") ? "Sprint" : "Grand Prix"}{resultsMode ? " - Results" : ""}
                    </h2>
                    
                    <div className="race-meta-row mt-2">
                        <span className="text-white/70 italic">{nextRace.circuit}</span>
                    </div>
                </div>

                <div className="race-actions-bottom flex flex-col items-start gap-2">
                    {/* Locks display */}
                    {nextRace.cutoff && !resultsMode && !isLocked && (
                         <div className="flex items-center gap-1.5 opacity-80 mb-1">
                            <span style={{ color: nextRace.colors.primary }} className="font-bold uppercase text-sm tracking-wider">Locks:</span>
                            <span className="text-sm font-medium text-white/90">
                                {new Date(nextRace.cutoff.replace(' ', 'T') + ':00Z').toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                         </div>
                    )}
                    {/* Unlocks at display */}
                    {!isPredictionsOpen && unlocksAt && !resultsMode && (
                        <div className="flex items-center gap-1.5 opacity-80 mb-1">
                            <span style={{ color: nextRace.colors.primary }} className="font-bold uppercase text-sm tracking-wider">Unlocks at:</span>
                            <span className="text-sm font-medium text-white/90">
                                {unlocksAt.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    )}

 

                    {renderActions && renderActions(nextRace.colors)}
                </div>
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
