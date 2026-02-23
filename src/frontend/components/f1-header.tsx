"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { ArrowLeft, Settings, ChevronDown, Menu, X, Home, Trophy, Calendar, Flag, Award, User, LogIn } from "lucide-react"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const showMobileNav = variant === "Home" || (variant === "landing" && isAuthenticated)
  
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
    <>
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
        <div className={cn("header-right-nav", showMobileNav && "header-right-nav-mobile-hidden")}>
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

        {/* Burger button — only visible below 1024px when nav is applicable */}
        {showMobileNav && (
          <button
            className="header-burger-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Gradient line */}
      <div className="header-gradient-line" />
    </header>

    {/* ── Mobile Sidebar (portaled to body to escape header's backdrop-filter containing block) ── */}
    {showMobileNav && isMobileMenuOpen && createPortal(
      <>
        {/* Backdrop */}
        <div className="header-mobile-overlay" onClick={closeMobileMenu} />

        {/* Sidebar */}
        <aside className="header-mobile-sidebar" aria-label="Mobile navigation">
          <div className="header-mobile-sidebar-inner">
            {/* Close */}
            <button className="header-mobile-close-btn" onClick={closeMobileMenu} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>

            {/* Logo */}
            <div className="header-mobile-logo">
              <img src={emblem} alt="F1 Emblem" className="h-8 w-auto" />
              <span className="header-mobile-logo-text">F1 PREDICTIONS</span>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1">
              <Link
                to="/home"
                onClick={closeMobileMenu}
                className={cn(
                  "header-mobile-nav-link",
                  activeNav === "Home" ? "header-mobile-nav-link-active" : "header-mobile-nav-link-inactive"
                )}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              {/* Predictions Group */}
              <div className="header-mobile-section-title">
                <Flag className="h-3.5 w-3.5" />
                Predictions
              </div>
              <Link
                to="/race-predictions"
                onClick={closeMobileMenu}
                className={cn(
                  "header-mobile-sub-link",
                  activeNav === "RacePredictions" ? "header-mobile-sub-link-active" : "header-mobile-sub-link-inactive"
                )}
              >
                Grand Prix
              </Link>
              <Link
                to="/sprint-predictions"
                onClick={closeMobileMenu}
                className={cn(
                  "header-mobile-sub-link",
                  activeNav === "SprintPredictions" ? "header-mobile-sub-link-active" : "header-mobile-sub-link-inactive"
                )}
              >
                Sprint
              </Link>
              <Link
                to="/season-predictions"
                onClick={closeMobileMenu}
                className={cn(
                  "header-mobile-sub-link",
                  activeNav === "SeasonPredictions" ? "header-mobile-sub-link-active" : "header-mobile-sub-link-inactive"
                )}
              >
                Season
              </Link>

              {/* Calendar */}
              <Link
                to="/season-overview"
                onClick={closeMobileMenu}
                className={cn(
                  "header-mobile-nav-link",
                  activeNav === "Season" ? "header-mobile-nav-link-active" : "header-mobile-nav-link-inactive"
                )}
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Link>

              {/* Results Group */}
              <div className="header-mobile-section-title">
                <Trophy className="h-3.5 w-3.5" />
                Results
              </div>
              <Link
                to="/race-results"
                onClick={closeMobileMenu}
                className={cn(
                  "header-mobile-sub-link",
                  activeNav === "Results" ? "header-mobile-sub-link-active" : "header-mobile-sub-link-inactive"
                )}
              >
                Grand Prix
              </Link>
              <Link
                to="/sprint-results"
                onClick={closeMobileMenu}
                className={cn(
                  "header-mobile-sub-link",
                  activeNav === "SprintResults" ? "header-mobile-sub-link-active" : "header-mobile-sub-link-inactive"
                )}
              >
                Sprint
              </Link>
              <Link
                to="/season-results"
                onClick={closeMobileMenu}
                className={cn(
                  "header-mobile-sub-link",
                  activeNav === "SeasonResults" ? "header-mobile-sub-link-active" : "header-mobile-sub-link-inactive"
                )}
              >
                Season
              </Link>

              {/* Leaderboard */}
              <Link
                to="/leaderboard"
                onClick={closeMobileMenu}
                className={cn(
                  "header-mobile-nav-link",
                  activeNav === "Leaderboard" ? "header-mobile-nav-link-active" : "header-mobile-nav-link-inactive"
                )}
              >
                <Award className="h-4 w-4" />
                Leaderboard
              </Link>
            </nav>

            {/* Divider */}
            <div className="header-mobile-divider" />

            {/* Auth Section */}
            <div className="header-mobile-auth">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={closeMobileMenu} className="header-mobile-auth-user">
                    <User className="h-4 w-4" />
                    @{username}
                  </Link>
                  <Link to="/profile-settings" onClick={closeMobileMenu} className="header-mobile-auth-settings">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMobileMenu} className="header-mobile-login-btn">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu} className="header-mobile-signup-btn">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </aside>
      </>,
      document.body
    )}
    </>
  )
}
