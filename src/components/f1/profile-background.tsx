"use client"

import { useEffect, useState, type ReactNode } from "react"

/**
 * Color pairs for F1 teams and drivers.
 * Each pair has a primary and secondary color (hex).
 * Swap these values to change the background for any team/driver combo.
 */
export interface ColorPair {
  primary: string
  secondary: string
}

// ---- Preset color pairs (easily changeable) ----

export const TEAM_COLORS: Record<string, ColorPair> = {
  "Red Bull Racing": { primary: "#1e3264", secondary: "#cc1e4a" },
  Ferrari: { primary: "#a6051a", secondary: "#fff200" },
  Mercedes: { primary: "#00d2be", secondary: "#000000" },
  McLaren: { primary: "#ff8700", secondary: "#47c7fc" },
  "Aston Martin": { primary: "#006f62", secondary: "#cedc00" },
  Alpine: { primary: "#0090ff", secondary: "#f363b7" },
  Williams: { primary: "#005aff", secondary: "#00a3e0" },
  "RB (VCARB)": { primary: "#2b4562", secondary: "#bfc4c9" },
  "Kick Sauber": { primary: "#52e252", secondary: "#000000" },
  Haas: { primary: "#b6babd", secondary: "#e10600" },
}

export const DRIVER_COLORS: Record<string, ColorPair> = {
  "Max Verstappen": { primary: "#ff8c00", secondary: "#1e3264" },
  "Sergio Perez": { primary: "#1e3264", secondary: "#cc1e4a" },
  "Lewis Hamilton": { primary: "#a6051a", secondary: "#fff200" },
  "Charles Leclerc": { primary: "#a6051a", secondary: "#ffffff" },
  "Lando Norris": { primary: "#ff8700", secondary: "#47c7fc" },
  "Oscar Piastri": { primary: "#ff8700", secondary: "#0058a3" },
}

interface ProfileBackgroundProps {
  teamName?: string
  driverName?: string
  teamColors?: ColorPair
  driverColors?: ColorPair
  children?: ReactNode
}

export function ProfileBackground({
  teamName = "Red Bull Racing",
  driverName = "Max Verstappen",
  teamColors: teamColorsProp,
  driverColors: driverColorsProp,
  children,
}: ProfileBackgroundProps) {
  const teamColors = teamColorsProp ?? TEAM_COLORS[teamName] ?? TEAM_COLORS["Red Bull Racing"]
  const driverColors =
    driverColorsProp ?? DRIVER_COLORS[driverName] ?? DRIVER_COLORS["Max Verstappen"]

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Trigger entrance animation after mount
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* ===== LEFT SIDE - Team ===== */}
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          clipPath: "polygon(0 0, 58% 0, 42% 100%, 0 100%)",
          transform: mounted ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Primary fill */}
        <div className="absolute inset-0" style={{ backgroundColor: teamColors.primary }} />

        {/* Animated gradient shimmer */}
        <div
          className="absolute inset-0 animate-[shimmerLeft_8s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(135deg, ${teamColors.secondary}66 0%, transparent 40%, ${teamColors.secondary}33 70%, transparent 100%)`,
          }}
        />

        {/* Secondary accent stripe on far left edge */}
        <div
          className="absolute top-0 left-0 h-full transition-transform delay-500 duration-700 ease-out"
          style={{
            width: "5%",
            clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)",
            backgroundColor: teamColors.secondary,
            opacity: 0.85,
            transform: mounted ? "translateX(0)" : "translateX(-200%)",
          }}
        />

        {/* Team logo placeholder */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity delay-700 duration-1000"
          style={{
            opacity: mounted ? 1 : 0,
            clipPath: "polygon(0 0, 58% 0, 42% 100%, 0 100%)",
          }}
        >
          <div className="relative flex h-48 w-48 items-center justify-center md:h-64 md:w-64 lg:h-80 lg:w-80">
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-2xl"
              style={{ backgroundColor: teamColors.secondary }}
            />
            {/* Placeholder logo shape - team shield */}
            <svg
              viewBox="0 0 200 200"
              className="h-full w-full drop-shadow-2xl"
              aria-label={`${teamName} logo placeholder`}
            >
              <defs>
                <filter id="teamGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Bull-like silhouette placeholder */}
              <path
                d="M30 140 Q30 100 50 80 L60 60 Q70 50 80 55 L90 65 Q100 45 110 50 L120 60 Q135 40 145 55 L150 70 Q170 80 175 110 Q178 130 165 145 L155 150 Q140 160 120 155 L100 150 Q80 155 60 150 L45 145 Q30 145 30 140Z"
                fill={teamColors.secondary}
                fillOpacity="0.7"
                stroke={teamColors.secondary}
                strokeWidth="2"
                strokeOpacity="0.9"
                filter="url(#teamGlow)"
              />
              {/* Inner detail */}
              <path
                d="M45 135 Q45 105 60 85 L70 70 Q80 60 90 68 L95 72 Q100 55 110 60 L118 68 Q130 52 138 65 L142 75 Q158 85 162 110 Q164 125 155 138 L148 142 Q135 150 118 146 L100 142 Q82 146 65 142 L52 138 Q45 138 45 135Z"
                fill={teamColors.primary}
                fillOpacity="0.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE - Driver ===== */}
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          clipPath: "polygon(58% 0, 100% 0, 100% 100%, 42% 100%)",
          transform: mounted ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Primary fill */}
        <div className="absolute inset-0" style={{ backgroundColor: driverColors.primary }} />

        {/* Animated gradient shimmer */}
        <div
          className="absolute inset-0 animate-[shimmerRight_8s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(225deg, ${driverColors.secondary}66 0%, transparent 40%, ${driverColors.secondary}33 70%, transparent 100%)`,
          }}
        />

        {/* Secondary accent stripe on far right edge */}
        <div
          className="absolute top-0 right-0 h-full transition-transform delay-500 duration-700 ease-out"
          style={{
            width: "5%",
            clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)",
            backgroundColor: driverColors.secondary,
            opacity: 0.85,
            transform: mounted ? "translateX(0)" : "translateX(200%)",
          }}
        />

        {/* Driver logo placeholder */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity delay-700 duration-1000"
          style={{
            opacity: mounted ? 1 : 0,
            clipPath: "polygon(58% 0, 100% 0, 100% 100%, 42% 100%)",
          }}
        >
          <div className="relative flex h-48 w-48 items-center justify-center md:h-64 md:w-64 lg:h-80 lg:w-80">
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-2xl"
              style={{ backgroundColor: driverColors.secondary }}
            />
            {/* Placeholder logo shape - lion/heraldic crest */}
            <svg
              viewBox="0 0 200 200"
              className="h-full w-full drop-shadow-2xl"
              aria-label={`${driverName} logo placeholder`}
            >
              <defs>
                <filter id="driverGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Lion-like heraldic placeholder */}
              <path
                d="M100 25 Q115 30 120 45 L125 55 Q135 50 140 55 Q150 60 148 75 L145 85 Q155 90 155 105 L152 120 Q148 135 140 145 L130 155 Q120 165 110 170 L100 175 L90 170 Q80 165 70 155 L60 145 Q52 135 48 120 L45 105 Q45 90 55 85 L52 75 Q50 60 60 55 Q65 50 75 55 L80 45 Q85 30 100 25Z"
                fill={driverColors.primary}
                fillOpacity="0.6"
                stroke={driverColors.primary}
                strokeWidth="2"
                strokeOpacity="0.8"
                filter="url(#driverGlow)"
              />
              {/* Inner details - crown-like top */}
              <path
                d="M90 35 Q95 28 100 32 Q105 28 110 35 L115 50 Q110 45 100 42 Q90 45 85 50Z"
                fill={driverColors.secondary}
                fillOpacity="0.6"
              />
              {/* Body detail */}
              <path
                d="M75 80 Q80 70 90 68 L100 65 L110 68 Q120 70 125 80 L128 95 Q125 110 120 120 L110 135 Q105 140 100 142 Q95 140 90 135 L80 120 Q75 110 72 95Z"
                fill={driverColors.secondary}
                fillOpacity="0.4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ===== Center diagonal seam glow ===== */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity delay-300 duration-1000"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        <svg className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="seamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.15" />
              <stop offset="50%" stopColor="white" stopOpacity="0.05" />
              <stop offset="100%" stopColor="white" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <line
            x1="58%"
            y1="0"
            x2="42%"
            y2="100%"
            stroke="url(#seamGrad)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* ===== Dark overlay vignette for readability ===== */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 30%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Decorative sparkle element - bottom right */}
      <div
        className="pointer-events-none absolute right-8 bottom-8 z-20 transition-opacity delay-1000 duration-700"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M16 0L18.5 13.5L32 16L18.5 18.5L16 32L13.5 18.5L0 16L13.5 13.5L16 0Z"
            fill="white"
            fillOpacity="0.6"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes shimmerLeft {
          0%, 100% { transform: translateX(-5%) translateY(-5%); opacity: 0.6; }
          50% { transform: translateX(3%) translateY(3%); opacity: 1; }
        }
        @keyframes shimmerRight {
          0%, 100% { transform: translateX(5%) translateY(-5%); opacity: 0.6; }
          50% { transform: translateX(-3%) translateY(3%); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
