"use client"

import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { cn, hexToHsl, getAdaptiveDeepBackground } from "@/lib/utils"
import emblem from "@/assets/emblem.png"
import "@/frontend/styles/F1Header.css"

type F1HeaderVariant = "back" | "landing" | "dashboard"

interface F1HeaderProps {
  variant?: F1HeaderVariant
  backHref?: string
  activeNav?: string
  primaryColor?: string
}

export function F1Header({
  variant = "back",
  backHref = "/",
  activeNav = "Dashboard",
  primaryColor,
  children,
}: F1HeaderProps & { children?: React.ReactNode }) {
  
  // Calculate dynamic style if primaryColor is provided
  const headerStyle = primaryColor 
    ? (() => {
        const style: Record<string, string | undefined> = {};
        const hsl = hexToHsl(primaryColor);
        if (hsl) {
          style['--f1-neon'] = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
          
          // Apply adaptive background tint with 60% opacity to match glass effect
          const activeBg = getAdaptiveDeepBackground(primaryColor, 0.6);
          if (activeBg) {
             style.backgroundColor = activeBg;
          }
        }
        return style as React.CSSProperties;
      })()
    : {};

  return (
    <header
      className={cn(
        "header-base",
        variant === "landing" ? "header-landing" : "header-relative",
        // Apply glass style to landing AND dashboard variants for consistency
        (variant === "landing" || variant === "dashboard") && "header-glass"
      )}
      style={headerStyle}
    >
      <div className="header-container">
        {/* Left side - always logo for landing & dashboard, back for back */}
        {variant === "back" ? (
          <Link to={backHref} className="header-back-link">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        ) : (
          <Link to="/" className="header-logo-container">
            <img src={emblem} alt="F1 Emblem" className="h-10 w-auto" />
            <span className="header-logo-text">
              F1 PREDICTIONS
            </span>
          </Link>
        )}

        {/* Center logo (only for "back" variant) */}
        {variant === "back" && (
          <Link to="/" className="header-center-logo">
            <img src={emblem} alt="F1 Emblem" className="h-10 w-auto" />
            <span className="header-logo-text">
              F1 PREDICTIONS
            </span>
          </Link>
        )}

        {/* Center nav links (only for "dashboard" variant) */}
        {variant === "dashboard" && (
          <nav className="header-center-nav" aria-label="Main navigation">
            {["Dashboard", "Predictions", "Leaderboard", "Template"].map((item) => (
              <Link
                key={item}
                to={
                  item === "Dashboard"
                    ? "/dashboard"
                    : item === "Predictions"
                    ? "/race-predictions"
                    : `/${item.toLowerCase()}`
                }
                className={cn(
                  "header-nav-link",
                  activeNav === item
                    ? "header-nav-link-active"
                    : "header-nav-link-inactive"
                )}
              >
                {item}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side - Render children (actions) here */}
        <div className="header-right-nav">
          {children ? (
            children
          ) : (
            <div className="header-spacer" />
          )}
        </div>
      </div>

      {/* Gradient line */}
      <div className="header-gradient-line" />
    </header>
  )
}
