"use client"

import { useEffect, useState } from "react"
import type { ColorPair } from "@/lib/f1-presets"

export interface F1BackgroundProps {
  teamColors?: ColorPair
  driverColors?: ColorPair
  teamLogoUrl?: string
  driverLogoUrl?: string
}

const DEFAULT_TEAM: ColorPair = {
  primary: "#DC143C",
  secondary: "#1E3A5F",
}

const DEFAULT_DRIVER: ColorPair = {
  primary: "#FF8C00",
  secondary: "#1E3A5F",
}

/*
  Geometry — all diagonals at 65 degrees from horizontal bottom edge.
  ===================================================================

  tan(65deg) ≈ 2.145
  For a 16:9 viewport, horizontal shift per 100% height = 26% of width.
  SHIFT = 26

  Every diagonal line at top-x goes to (top-x - 26)% at the bottom.

  STRIPE POSITIONS (symmetric):
  ─────────────────────────────
  The outer stripe edges and inner stripe edges are placed so both sides
  mirror each other in distance from their respective screen edges AND
  from the center.

  Left side (top positions):
    outerLeft  = 14%  → bottom = 14 - 26 = -12%
    innerLeft  = 19%  → bottom = 19 - 26 = -7%

  Right side (top positions):
    innerRight = 81%  → bottom = 81 - 26 = 55%
    outerRight = 86%  → bottom = 86 - 26 = 60%

  Distance from edge:   left outer 14% from left   |  right outer 14% from right (100-86)  ✓
  Distance from center: left inner 31% from 50%     |  right inner 31% from 50% (81-50)     ✓
  Stripe width:         5% on both sides                                                     ✓

  EDGE PANELS: solid color from 0% to outerLeft line (left) and outerRight line to 100% (right).
  SEPARATION LINES: 0.6% wide, on the inner edge of each stripe, in team/driver primary color.
*/

const SHIFT = 26
const SEP_W = 0.6

// Left separation line: anchors to BOTTOM LEFT corner (0%, 100%) at 65 degrees
// For 65deg angle with SHIFT=26: if bottom is at 0%, top is at 0+26=26%
const L_SEP_OUTER_T = 26               // 26 (top)
const L_SEP_INNER_T = 26 + SEP_W       // 26.6 (top)
const L_SEP_OUTER_B = 0                // 0 (bottom, left corner)
const L_SEP_INNER_B = SEP_W            // 0.6 (bottom)

// Left stripe: positioned to the left of the separation line
// Inner edge matches separation outer edge, outer edge is 5% further left
const STRIPE_W = 5
const L_INNER_T = L_SEP_OUTER_T        // 26
const L_OUTER_T = L_INNER_T - STRIPE_W // 21
const L_INNER_B = L_SEP_OUTER_B        // 0
const L_OUTER_B = L_INNER_B - STRIPE_W // -5

// Right separation line: anchors to TOP RIGHT corner (100%, 0%) at 65 degrees
// For 65deg angle with SHIFT=26: if top is at 100%, bottom is at 100-26=74%
const R_SEP_INNER_T = 100 - SEP_W      // 99.4 (top)
const R_SEP_OUTER_T = 100              // 100 (top, right corner)
const R_SEP_INNER_B = 74 - SEP_W       // 73.4 (bottom)
const R_SEP_OUTER_B = 74               // 74 (bottom)

// Right stripe: positioned to the right of the separation line
// Inner edge matches separation outer edge, outer edge is 5% further right
const R_INNER_T = R_SEP_OUTER_T        // 100
const R_OUTER_T = R_INNER_T + STRIPE_W // 105
const R_INNER_B = R_SEP_OUTER_B        // 74
const R_OUTER_B = R_INNER_B + STRIPE_W // 79

export default function F1Background({
  teamColors = DEFAULT_TEAM,
  driverColors = DEFAULT_DRIVER,
  teamLogoUrl,
  driverLogoUrl,
}: F1BackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // ── Center split with horizontal chevron notch ─────────────
  const ct = 60 // center line x at top (shifted right so mid-screen is centered)
  const notchY1 = 48
  const notchY2 = 52
  const cNotchTop = ct - SHIFT * (notchY1 / 100) // x at notchY1
  const notchStep = 4 // horizontal step (parallel to bottom)
  const cNotchBot = cNotchTop + notchStep
  const cb = cNotchBot - SHIFT * ((100 - notchY2) / 100) // x at bottom

  const leftClip = `polygon(0 0, ${ct}% 0%, ${cNotchTop}% ${notchY1}%, ${cNotchBot}% ${notchY2}%, ${cb}% 100%, 0 100%)`
  const rightClip = `polygon(${ct}% 0%, 100% 0%, 100% 100%, ${cb}% 100%, ${cNotchBot}% ${notchY2}%, ${cNotchTop}% ${notchY1}%)`

  // Thin glow line along center split
  const gw = 0.5
  const centerGlowClip = `polygon(
    ${ct - gw}% 0%, ${ct + gw}% 0%,
    ${cNotchTop + gw}% ${notchY1}%, ${cNotchBot + gw}% ${notchY2}%,
    ${cb + gw}% 100%, ${cb - gw}% 100%,
    ${cNotchBot - gw}% ${notchY2}%, ${cNotchTop - gw}% ${notchY1}%
  )`

  // ── Left edge panel (solid team secondary) ─────────────────
  // Parallelogram from left screen edge to the outer stripe line.
  // Since the outer line goes off-screen at the bottom, we extend the polygon
  // to cover the full left strip: 0,0 → outerTop,0 → outerBot,100 → 0,100
  // But outerBot is -12%, so clip naturally covers corner.
  const leftEdgeClip = `polygon(0% 0%, ${L_OUTER_T}% 0%, ${L_OUTER_B}% 100%, 0% 100%)`

  // ── Left accent stripe (gradient) ─────────────────────────
  const leftStripeClip = `polygon(${L_OUTER_T}% 0%, ${L_INNER_T}% 0%, ${L_INNER_B}% 100%, ${L_OUTER_B}% 100%)`

  // ── Left separation line ───────────────────────────────────
  const leftSepClip = `polygon(${L_SEP_OUTER_T}% 0%, ${L_SEP_INNER_T}% 0%, ${L_SEP_INNER_B}% 100%, ${L_SEP_OUTER_B}% 100%)`

  // ── Right edge panel (solid driver secondary) ──────────────
  const rightEdgeClip = `polygon(${R_OUTER_T}% 0%, 100% 0%, 100% 100%, ${R_OUTER_B}% 100%)`

  // ── Right accent stripe (gradient) ─────────────────────────
  const rightStripeClip = `polygon(${R_INNER_T}% 0%, ${R_OUTER_T}% 0%, ${R_OUTER_B}% 100%, ${R_INNER_B}% 100%)`

  // ── Right separation line ──────────────────────────────────
  const rightSepClip = `polygon(${R_SEP_INNER_T}% 0%, ${R_SEP_OUTER_T}% 0%, ${R_SEP_OUTER_B}% 100%, ${R_SEP_INNER_B}% 100%)`

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>

      {/* ── LEFT HALF (Team main gradient) ───────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: leftClip,
          transform: mounted ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${teamColors.primary} 0%, ${teamColors.secondary} 100%)`,
          }}
        />
      </div>

      {/* ── RIGHT HALF (Driver main gradient) ────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: rightClip,
          transform: mounted ? "translateX(0)" : "translateX(100%)",
          transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${driverColors.primary} 0%, ${driverColors.secondary} 100%)`,
          }}
        />
      </div>

      {/* ── CENTER GLOW LINE ─────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: centerGlowClip,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 48%, rgba(255,255,255,0.18) 52%, rgba(255,255,255,0.08) 100%)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1.2s ease-out 0.6s",
        }}
      />

      {/* ── LEFT EDGE PANEL (solid team secondary) ───────────── */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: leftEdgeClip,
          background: teamColors.secondary,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-60%)",
          transition:
            "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, opacity 0.6s ease 0.25s",
        }}
      />

      {/* ── LEFT ACCENT STRIPE (gradient, opposite direction) ── */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: leftStripeClip,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-60%)",
          transition:
            "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, opacity 0.6s ease 0.3s",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${teamColors.secondary} 0%, ${teamColors.primary} 100%)`,
          }}
        />
      </div>

      {/* ── LEFT SEPARATION LINE (team primary) ──────────────── */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: leftSepClip,
          background: teamColors.primary,
          opacity: mounted ? 0.9 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-60%)",
          transition:
            "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, opacity 0.6s ease 0.35s",
        }}
      />

      {/* ── RIGHT EDGE PANEL (solid driver secondary) ────────── */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: rightEdgeClip,
          background: driverColors.secondary,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(60%)",
          transition:
            "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, opacity 0.6s ease 0.25s",
        }}
      />

      {/* ── RIGHT ACCENT STRIPE (gradient, opposite direction) ─ */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: rightStripeClip,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(60%)",
          transition:
            "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, opacity 0.6s ease 0.3s",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${driverColors.secondary} 0%, ${driverColors.primary} 100%)`,
          }}
        />
      </div>

      {/* ── RIGHT SEPARATION LINE (driver primary) ───────────── */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: rightSepClip,
          background: driverColors.primary,
          opacity: mounted ? 0.9 : 0,
          transform: mounted ? "translateY(0)" : "translateY(60%)",
          transition:
            "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, opacity 0.6s ease 0.35s",
        }}
      />

      {/* ── TEAM LOGO (left center) ──────────────────────────── */}
      <div
        className="absolute left-0 top-0 flex items-center justify-center"
        style={{
          width: "50%",
          height: "100%",
          opacity: mounted ? 1 : 0,
          transform: mounted
            ? "scale(1) translateX(0)"
            : "scale(0.85) translateX(-30px)",
          transition:
            "opacity 0.8s ease 0.8s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
        }}
      >
        {teamLogoUrl ? (
          <img
            src={teamLogoUrl || "/placeholder.svg"}
            alt="Team logo"
            className="max-h-[45vh] max-w-[35vw] object-contain"
            crossOrigin="anonymous"
            style={{
              filter: `drop-shadow(0 0 40px ${teamColors.secondary}55)`,
            }}
          />
        ) : (
          <TeamPlaceholderLogo color={teamColors.secondary} />
        )}
      </div>

      {/* ── DRIVER LOGO (right center) ───────────────────────── */}
      <div
        className="absolute right-0 top-0 flex items-center justify-center"
        style={{
          width: "50%",
          height: "100%",
          opacity: mounted ? 1 : 0,
          transform: mounted
            ? "scale(1) translateX(0)"
            : "scale(0.85) translateX(30px)",
          transition:
            "opacity 0.8s ease 0.8s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
        }}
      >
        {driverLogoUrl ? (
          <img
            src={driverLogoUrl || "/placeholder.svg"}
            alt="Driver logo"
            className="max-h-[45vh] max-w-[35vw] object-contain"
            crossOrigin="anonymous"
            style={{
              filter: `drop-shadow(0 0 40px ${driverColors.primary}55)`,
            }}
          />
        ) : (
          <DriverPlaceholderLogo color={driverColors.primary} />
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Placeholder logos
   ═══════════════════════════════════════════════════════════════════ */

function TeamPlaceholderLogo({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className="max-h-[40vh] max-w-[30vw]"
      style={{ filter: `drop-shadow(0 0 30px ${color}44)` }}
    >
      <path
        d="M100 10 L180 50 L180 100 Q180 150 100 155 Q20 150 20 100 L20 50 Z"
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.5"
      />
      <path
        d="M100 40 L145 70 L100 100 L55 70 Z"
        fill={color}
        fillOpacity="0.35"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.7"
      />
      <circle cx="100" cy="70" r="8" fill={color} fillOpacity="0.5" />
    </svg>
  )
}

function DriverPlaceholderLogo({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="max-h-[40vh] max-w-[30vw]"
      style={{ filter: `drop-shadow(0 0 30px ${color}44)` }}
    >
      <ellipse
        cx="100"
        cy="85"
        rx="65"
        ry="55"
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.45"
      />
      <path
        d="M55 85 Q100 60 145 85 Q130 95 100 95 Q70 95 55 85 Z"
        fill={color}
        fillOpacity="0.4"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />
      <text
        x="100"
        y="150"
        textAnchor="middle"
        fontSize="36"
        fontWeight="bold"
        fill={color}
        fillOpacity="0.45"
        fontFamily="sans-serif"
      >
        01
      </text>
    </svg>
  )
}
