"use client"

import { ArrowLeft, Settings } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import "@/styles/F1Header.css"

type F1HeaderVariant = "back" | "landing" | "dashboard"

interface F1HeaderProps {
  variant?: F1HeaderVariant
  backHref?: string
  username?: string
  activeNav?: string
}

export function F1Header({
  variant = "back",
  backHref = "/",
  username = "@username",
  activeNav = "Dashboard",
}: F1HeaderProps) {
  return (
    <header
      className={cn(
        "header-base",
        variant === "landing" ? "header-landing" : "header-relative"
      )}
    >
      <div className="header-container">
        {/* Left side - always logo for landing & dashboard, back for back */}
        {variant === "back" ? (
          <Link to={backHref} className="header-back-link">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        ) : (
          <div className="header-logo-container">
            <F1CarIcon />
            <span className="header-logo-text">
              F1 PREDICTIONS
            </span>
          </div>
        )}

        {/* Center logo (only for "back" variant) */}
        {variant === "back" && (
          <div className="header-center-logo">
            <F1CarIcon />
            <span className="header-logo-text">
              F1 PREDICTIONS
            </span>
          </div>
        )}

        {/* Center nav links (only for "dashboard" variant) */}
        {variant === "dashboard" && (
          <nav className="header-center-nav" aria-label="Main navigation">
            {["Dashboard", "Predictions", "Leaderboard"].map((item) => (
              <Link
                key={item}
                to={
                  item === "Dashboard"
                    ? "/dashboard"
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

        {/* Right side */}
        {variant === "landing" ? (
          <nav className="header-right-nav" aria-label="Auth navigation">
            <Link to="/login" className="header-login-btn">
              Login
            </Link>
            <Link to="/signup" className="header-signup-btn">
              Sign Up
            </Link>
          </nav>
        ) : variant === "dashboard" ? (
          <div className="header-right-nav">
            <span className="header-username">{username}</span>
            <button
              type="button"
              className="header-settings-btn"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="header-spacer" />
        )}
      </div>

      {/* Gradient line */}
      <div className="header-gradient-line" />
    </header>
  )
}

function F1CarIcon() {
  return (
    <svg
      width="28"
      height="16"
      viewBox="0 0 28 16"
      fill="none"
      aria-hidden="true"
    >
      {/* Car body */}
      <path
        d="M2 10L5 6L10 4L18 3L24 4L26 7L26 10L2 10Z"
        fill="hsl(0 80% 45%)"
      />
      {/* Windshield */}
      <path d="M12 4L15 3L16 6L12 6Z" fill="hsl(210 40% 20%)" />
      {/* Front wing */}
      <path d="M24 7L27 6L28 9L26 9Z" fill="hsl(0 80% 40%)" />
      {/* Rear wing */}
      <path d="M2 6L4 3L5 6Z" fill="hsl(0 80% 40%)" />
      {/* Front wheel */}
      <circle cx="22" cy="11" r="2.5" fill="hsl(210 10% 20%)" />
      <circle cx="22" cy="11" r="1.5" fill="hsl(210 10% 35%)" />
      {/* Rear wheel */}
      <circle cx="7" cy="11" r="2.5" fill="hsl(210 10% 20%)" />
      <circle cx="7" cy="11" r="1.5" fill="hsl(210 10% 35%)" />
    </svg>
  )
}
