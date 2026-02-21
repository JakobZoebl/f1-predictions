"use client"

import { ArrowLeft, Settings, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { cn, hexToHsl, getAdaptiveDeepBackground } from "@/lib/utils"
import emblem from "@/assets/emblem.png"
import "@/frontend/styles/F1Header.css"

type F1HeaderVariant = "back" | "landing" | "Home"

interface F1HeaderProps {
  variant?: F1HeaderVariant
  backHref?: string
  activeNav?: string
  primaryColor?: string
  isAuthenticated?: boolean
  username?: string
}

export function F1Header({
  variant = "back",
  backHref = "/",
  activeNav = "Home",
  primaryColor,
  isAuthenticated = false,
  username = "User",
}: F1HeaderProps) {
  
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
        // Apply glass style to landing AND Home variants for consistency
        (variant === "landing" || variant === "Home") && "header-glass"
      )}
      style={headerStyle}
    >
      <div className="header-container">
        {/* Left side - always logo for landing & Home, back for back */}
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

        {/* Center nav links (shown for "Home" variant OR "landing" if authenticated) */}
        {(variant === "Home" || (variant === "landing" && isAuthenticated)) && (
          <nav className="header-center-nav" aria-label="Main navigation">
            <Link
              to="/home"
              className={cn(
                "header-nav-link",
                activeNav === "Home" ? "header-nav-link-active" : "header-nav-link-inactive"
              )}
            >
              Home
            </Link>

            {/* Predictions Dropdown */}
            <div className="header-dropdown-container group">
              <button
                className={cn(
                  "header-dropdown-trigger",
                  (activeNav === "RacePredictions" || activeNav === "SeasonPredictions" || activeNav === "SprintPredictions") 
                    ? "header-nav-link-active" 
                    : "header-nav-link-inactive"
                )}
              >
                Predictions
                <ChevronDown className="header-dropdown-icon" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="header-dropdown-menu">
                <div className="header-dropdown-content">
                  <Link
                    to="/race-predictions"
                    className={cn(
                      "header-dropdown-item",
                      activeNav === "RacePredictions" ? "text-f1-neon" : "text-white/80"
                    )}
                  >
                    Grand Prix
                  </Link>
                  <Link
                    to="/sprint-predictions"
                    className={cn(
                      "header-dropdown-item",
                      activeNav === "SprintPredictions" ? "text-f1-neon" : "text-white/80"
                    )}
                  >
                    Sprint
                  </Link>
                  <Link
                    to="/season-predictions"
                    className={cn(
                      "header-dropdown-item",
                      activeNav === "SeasonPredictions" ? "text-f1-neon" : "text-white/80"
                    )}
                  >
                    Season
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="/season-overview"
              className={cn(
                "header-nav-link",
                activeNav === "Season" ? "header-nav-link-active" : "header-nav-link-inactive"
              )}
            >
              Calendar
            </Link>

            {/* Results Dropdown */}
            <div className="header-dropdown-container group">
              <button
                className={cn(
                  "header-dropdown-trigger",
                  (activeNav === "Results" || activeNav === "SprintResults" || activeNav === "SeasonResults") 
                    ? "header-nav-link-active" 
                    : "header-nav-link-inactive"
                )}
              >
                Results
                <ChevronDown className="header-dropdown-icon" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="header-dropdown-menu">
                <div className="header-dropdown-content">
                  <Link
                    to="/race-results"
                    className={cn(
                      "header-dropdown-item",
                      activeNav === "Results" ? "text-f1-neon" : "text-white/80"
                    )}
                  >
                    Grand Prix
                  </Link>
                  <Link
                    to="/sprint-results"
                    className={cn(
                      "header-dropdown-item",
                      activeNav === "SprintResults" ? "text-f1-neon" : "text-white/80"
                    )}
                  >
                    Sprint
                  </Link>
                  <Link
                    to="/season-results"
                    className={cn(
                      "header-dropdown-item",
                      activeNav === "SeasonResults" ? "text-f1-neon" : "text-white/80"
                    )}
                  >
                    Season
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="/leaderboard"
              className={cn(
                "header-nav-link",
                activeNav === "Leaderboard" ? "header-nav-link-active" : "header-nav-link-inactive"
              )}
            >
              Leaderboard
            </Link>
          </nav>
        )}

        {/* Right side - Auth-aware navigation */}
        <div className="header-right-nav">
          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                @{username}
              </Link>
              <Link 
                to="/profile-settings" 
                className="p-2 text-white/50 hover:text-white transition-colors"
                aria-label="Profile Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="header-login-btn">
                Login
              </Link>
              <Link to="/signup" className="header-signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Gradient line */}
      <div className="header-gradient-line" />
    </header>
  )
}
