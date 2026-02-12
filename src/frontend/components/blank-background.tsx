"use client"

import type { ReactNode } from "react"
import { hexToHsl } from "@/lib/utils"

interface F1BackgroundProps {
  children: ReactNode
  primaryColor?: string
}

export function F1Background({ children, primaryColor }: F1BackgroundProps) {
  // Configurable values
  // Default blue: hsl(211 100% 50%)
  // Default radial dark: hsl(211 60% 15% / 0.4)
  // Default grid: hsl(211 100% 50% / 0.3)

  let radialGradient = "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(211 60% 15% / 0.4), transparent)"
  let gridGradient = "linear-gradient(hsl(211 100% 50% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(211 100% 50% / 0.3) 1px, transparent 1px)"

  if (primaryColor) {
    const hsl = hexToHsl(primaryColor)
    if (hsl) {
      // Create derived colors
      const neonColor = `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`
      // For the dark radial part, we use same hue, but reducing saturation and lightness similar to the default ratio
      // Default: S=60%, L=15%. Neon: S=100%, L=50%.
      // Ratio: S = neonS * 0.6, L = neonL * 0.3
      const darkColor = `hsl(${hsl.h} ${Math.round(hsl.s * 0.6)}% ${Math.round(hsl.l * 0.3)}% / 0.4)`

      radialGradient = `radial-gradient(ellipse 80% 60% at 50% 0%, ${darkColor}, transparent)`
      gridGradient = `linear-gradient(${neonColor} 1px, transparent 1px), linear-gradient(90deg, ${neonColor} 1px, transparent 1px)`
      
      // We also update the grid gradient opacity to 0.3 implicitly by appending / 0.3 to the color variable? 
      // Wait, in the string above: `hsl(211 100% 50% / 0.3)`.
      // So I should add `/ 0.3` to the neonColor usages in gridGradient.
      const gridColor = `hsl(${hsl.h} ${hsl.s}% ${hsl.l}% / 0.3)`
      gridGradient = `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle radial gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: radialGradient,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: gridGradient,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  )
}
